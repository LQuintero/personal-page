// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useContactForm } from './useContactForm';

const fetchMock = vi.fn();

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

function fill(result: { current: ReturnType<typeof useContactForm> }) {
  const fields = [
    ['name', 'Ada'],
    ['email', 'ada@example.com'],
    ['message', 'Hello there, world!'],
  ] as const;

  for (const [name, value] of fields) {
    act(() => {
      result.current.handleChange({
        target: { name, value },
      } as React.ChangeEvent<HTMLInputElement>);
    });
  }
}

describe('useContactForm daily limit', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it('tells the visitor when the daily cap resets', async () => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockResolvedValue(
      jsonResponse(
        { ok: false, scope: 'site', retryAfter: 2 * 60 * 60, error: 'ignored' },
        429
      )
    );
    const { result, unmount } = renderHook(() => useContactForm());
    fill(result);

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault() {},
      } as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.errors.general).toBe(
      'Too many requests today. Please try again in 2 hours.'
    );
    unmount();
  });

  it('does not promise tomorrow when the cap has no retry time', async () => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockResolvedValue(jsonResponse({ ok: false, scope: 'site' }, 429));
    const { result, unmount } = renderHook(() => useContactForm());
    fill(result);

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault() {},
      } as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.errors.general).toContain('try again later');
    expect(result.current.errors.general).not.toContain('tomorrow');
    unmount();
  });
});
