import { beforeEach, describe, expect, it, vi } from 'vitest';

const { lrange, lrem, exec, lpush, ltrim } = vi.hoisted(() => ({
  lrange: vi.fn(),
  lrem: vi.fn(),
  exec: vi.fn(),
  lpush: vi.fn(),
  ltrim: vi.fn(),
}));

vi.mock('@/server/utils/redis', () => ({
  getRedisClientOrNull: () => ({
    lrange,
    lrem,
    pipeline: () => {
      const chain = {
        lpush: (...args: unknown[]) => {
          lpush(...args);
          return chain;
        },
        ltrim: (...args: unknown[]) => {
          ltrim(...args);
          return chain;
        },
        exec,
      };
      return chain;
    },
  }),
}));

import { isNoAnswerResponse, logChatMessage } from './chatLog.service';

describe('isNoAnswerResponse', () => {
  it('detects the canned fallback from the system prompt', () => {
    expect(
      isNoAnswerResponse("I'm not sure about that one, but you can ask Laura [here](/contact).")
    ).toBe(true);
  });

  it('detects the empty-reply fallback from the chat service', () => {
    expect(isNoAnswerResponse("I don't have an answer for that one.")).toBe(true);
  });

  it('detects the canned phrasing even with extra text around it', () => {
    expect(
      isNoAnswerResponse("Hmm, I'm not sure about that one — but her projects are fair game!")
    ).toBe(true);
  });

  it('treats substantive replies as answered', () => {
    expect(
      isNoAnswerResponse('At Reconstruct, she led the AWS/OCI migration.')
    ).toBe(false);
  });
});

describe('logChatMessage', () => {
  beforeEach(() => {
    lrange.mockReset();
    lrem.mockReset();
    exec.mockReset();
    lpush.mockReset();
    ltrim.mockReset();
    exec.mockResolvedValue([]);
    lrem.mockResolvedValue(1);
  });

  it('removes questions older than 30 days and leaves newer ones', async () => {
    const fresh = JSON.stringify({
      ts: new Date().toISOString(),
      question: 'What has she built?',
      answered: true,
    });
    const expired = JSON.stringify({
      ts: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(),
      question: 'old question',
      answered: false,
    });
    lrange.mockResolvedValue([fresh, expired]);

    await logChatMessage({
      ts: new Date().toISOString(),
      question: 'What has she built?',
      answered: true,
    });

    expect(lrem).toHaveBeenCalledTimes(1);
    expect(lrem).toHaveBeenCalledWith('chat:log', 1, expired);
  });
});
