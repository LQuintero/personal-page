import { beforeEach, describe, expect, it, vi } from 'vitest';

const { lrange, lrem, exec, lpush, ltrim, evalCommand } = vi.hoisted(() => ({
  lrange: vi.fn(),
  lrem: vi.fn(),
  exec: vi.fn(),
  lpush: vi.fn(),
  ltrim: vi.fn(),
  evalCommand: vi.fn(),
}));

vi.mock('@/server/utils/redis', () => ({
  getRedisClientOrNull: () => ({
    lrange,
    lrem,
    eval: evalCommand,
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
    evalCommand.mockReset();
    exec.mockResolvedValue([]);
    evalCommand.mockResolvedValue(0);
  });

  it('prunes questions older than 30 days in one Redis call', async () => {
    await logChatMessage({
      ts: new Date().toISOString(),
      question: 'What has she built?',
      answered: true,
    });

    expect(evalCommand).toHaveBeenCalledTimes(1);
    expect(lrange).not.toHaveBeenCalled();
    expect(lrem).not.toHaveBeenCalled();

    const [script, keys, args] = evalCommand.mock.calls[0];
    expect(keys).toEqual(['chat:log']);
    expect(script).toContain('decoded.ts < cutoff');
    expect(script).toContain('LREM');

    const cutoff = Date.parse(args[0]);
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    expect(cutoff).toBeGreaterThan(thirtyDaysAgo - 5_000);
    expect(cutoff).toBeLessThan(thirtyDaysAgo + 5_000);
  });

  it('still logs when pruning fails', async () => {
    evalCommand.mockRejectedValue(new Error('redis down'));

    await expect(
      logChatMessage({
        ts: new Date().toISOString(),
        question: 'What has she built?',
        answered: true,
      })
    ).resolves.toBeUndefined();

    expect(lpush).toHaveBeenCalled();
  });
});
