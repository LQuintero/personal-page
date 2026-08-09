// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MAX_CHAT_MESSAGES, useChatBar } from './useChatBar';

const fetchMock = vi.fn();

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

describe('useChatBar', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it('sends a message and appends the reply', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true, reply: 'Hi there!' }));
    const { result } = renderHook(() => useChatBar());

    act(() => result.current.setInput('Hello'));
    await act(async () => {
      await result.current.sendMessage();
    });

    expect(result.current.messages.map((m) => [m.role, m.content])).toEqual([
      ['user', 'Hello'],
      ['assistant', 'Hi there!'],
    ]);
    expect(result.current.isOpen).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasStarted).toBe(true);
  });

  it('shows the fallback bubble when the request fails', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: false, error: 'boom' }, 500));
    const { result } = renderHook(() => useChatBar());

    act(() => result.current.setInput('Hello'));
    await act(async () => {
      await result.current.sendMessage();
    });

    const last = result.current.messages.at(-1);
    expect(last?.role).toBe('assistant');
    expect(last?.content).toContain('[here](/contact)');
    // The raw server error must never surface in the thread.
    expect(last?.content).not.toContain('boom');
  });

  it('shows a rate-limit message on 429', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: false, error: 'Too many messages.' }, 429));
    const { result } = renderHook(() => useChatBar());

    act(() => result.current.setInput('Hello'));
    await act(async () => {
      await result.current.sendMessage();
    });

    expect(result.current.messages.at(-1)?.content).toContain('give it a few minutes');
  });

  it('disables send once the conversation reaches the cap', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true, reply: 'Reply' }));
    const { result } = renderHook(() => useChatBar());

    for (let turn = 0; turn < MAX_CHAT_MESSAGES / 2; turn++) {
      act(() => result.current.setInput(`Question ${turn}`));
      await act(async () => {
        await result.current.sendMessage();
      });
    }

    expect(result.current.messages).toHaveLength(MAX_CHAT_MESSAGES);
    expect(result.current.canSend).toBe(false);

    // A further send is a no-op.
    act(() => result.current.setInput('One more'));
    await act(async () => {
      await result.current.sendMessage();
    });
    expect(result.current.messages).toHaveLength(MAX_CHAT_MESSAGES);
  });

  it('ignores an in-flight reply that resolves after Clear', async () => {
    let resolveFetch!: (response: Response) => void;
    fetchMock.mockImplementation(
      () => new Promise<Response>((resolve) => (resolveFetch = resolve))
    );
    const { result } = renderHook(() => useChatBar());

    act(() => result.current.setInput('Hello'));
    let sendPromise!: Promise<void>;
    act(() => {
      sendPromise = result.current.sendMessage();
    });
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.isLoading).toBe(true);

    act(() => result.current.clearChat());
    expect(result.current.messages).toHaveLength(0);

    // The stale reply lands after the thread was wiped — it must not repopulate it.
    await act(async () => {
      resolveFetch(jsonResponse({ ok: true, reply: 'Late reply' }));
      await sendPromise;
    });

    expect(result.current.messages).toHaveLength(0);
    expect(result.current.isLoading).toBe(false);
  });
});
