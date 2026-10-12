import { lua, lauxlib, lualib, to_luastring } from 'fengari';
import { beforeEach, describe, expect, it, vi } from 'vitest';

type LuaState = object;

/** Runs the prune script against an in-memory list, the way Redis EVAL would. */
function applyPruneScript(script: string, key: string, cutoff: string, entries: string[]): string[] {
  const list = [...entries];
  const L = lauxlib.luaL_newstate();
  try {
    lualib.luaL_openlibs(L);
    // A host exception inside cjson.decode must become a Lua error, so the
    // script's pcall keeps going instead of aborting the whole prune.
    lua.lua_atnativeerror(L, (state) => {
      lua.lua_pushliteral(state, 'native error');
      return 1;
    });

    lua.lua_newtable(L);
    lua.lua_pushcfunction(L, (state) => redisCall(state, list));
    lua.lua_setfield(L, -2, 'call');
    lua.lua_setglobal(L, 'redis');

    lua.lua_newtable(L);
    lua.lua_pushcfunction(L, cjsonDecode);
    lua.lua_setfield(L, -2, 'decode');
    lua.lua_setglobal(L, 'cjson');

    setLuaArray(L, 'KEYS', [key]);
    setLuaArray(L, 'ARGV', [cutoff]);

    const status = lauxlib.luaL_dostring(L, to_luastring(script));
    if (status !== lua.LUA_OK) {
      throw new Error(lua.lua_tojsstring(L, -1) ?? 'prune script failed');
    }
    return list;
  } finally {
    lua.lua_close(L);
  }
}

function setLuaArray(L: LuaState, name: string, values: string[]) {
  lua.lua_newtable(L);
  values.forEach((value, index) => {
    lua.lua_pushliteral(L, value);
    lua.lua_rawseti(L, -2, index + 1);
  });
  lua.lua_setglobal(L, name);
}

function pushJson(L: LuaState, value: unknown) {
  if (typeof value === 'string') {
    lua.lua_pushliteral(L, value);
    return;
  }
  if (typeof value === 'boolean') {
    lua.lua_pushboolean(L, value);
    return;
  }
  if (typeof value === 'number') {
    lua.lua_pushnumber(L, value);
    return;
  }
  if (value === null) {
    lua.lua_pushnil(L);
    return;
  }
  if (Array.isArray(value)) {
    lua.lua_newtable(L);
    value.forEach((item, index) => {
      pushJson(L, item);
      lua.lua_rawseti(L, -2, index + 1);
    });
    return;
  }
  if (typeof value === 'object') {
    lua.lua_newtable(L);
    for (const [field, item] of Object.entries(value)) {
      pushJson(L, item);
      lua.lua_setfield(L, -2, field);
    }
    return;
  }
  lauxlib.luaL_error(L, 'unsupported json');
}

function cjsonDecode(L: LuaState): number {
  const raw = lua.lua_tojsstring(L, 1);
  if (raw == null) return lauxlib.luaL_error(L, 'expected string');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return lauxlib.luaL_error(L, 'bad json');
  }
  pushJson(L, parsed);
  return 1;
}

function redisCall(L: LuaState, list: string[]): number {
  const command = lua.lua_tojsstring(L, 1);
  const key = lua.lua_tojsstring(L, 2);
  if (command === 'LRANGE') {
    const start = lua.lua_tointeger(L, 3);
    const stop = lua.lua_tointeger(L, 4);
    const slice = listRange(list, start, stop);
    lua.lua_newtable(L);
    slice.forEach((item, index) => {
      lua.lua_pushliteral(L, item);
      lua.lua_rawseti(L, -2, index + 1);
    });
    return 1;
  }
  if (command === 'LREM') {
    const count = lua.lua_tointeger(L, 3);
    const raw = lua.lua_tojsstring(L, 4) ?? '';
    lua.lua_pushinteger(L, listRemove(list, count, raw));
    return 1;
  }
  return lauxlib.luaL_error(L, `unknown command ${command ?? ''} on ${key ?? ''}`);
}

function listRange(list: string[], start: number, stop: number): string[] {
  const length = list.length;
  const normalize = (index: number) => {
    if (index < 0) index += length;
    return index;
  };
  let from = normalize(start);
  let to = normalize(stop);
  if (from < 0) from = 0;
  if (to >= length) to = length - 1;
  if (from > to || from >= length) return [];
  return list.slice(from, to + 1);
}

function listRemove(list: string[], count: number, raw: string): number {
  let removed = 0;
  const removeAt = (index: number) => {
    list.splice(index, 1);
    removed += 1;
  };
  if (count === 0) {
    for (let i = list.length - 1; i >= 0; i -= 1) {
      if (list[i] === raw) removeAt(i);
    }
    return removed;
  }
  const limit = Math.abs(count);
  if (count > 0) {
    for (let i = 0; i < list.length && removed < limit; ) {
      if (list[i] === raw) removeAt(i);
      else i += 1;
    }
    return removed;
  }
  for (let i = list.length - 1; i >= 0 && removed < limit; i -= 1) {
    if (list[i] === raw) removeAt(i);
  }
  return removed;
}

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

  it('prunes questions older than 30 days and keeps the rest', async () => {
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

    const cutoff = args[0] as string;
    const cutoffMs = Date.parse(cutoff);
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    expect(cutoffMs).toBeGreaterThan(thirtyDaysAgo - 5_000);
    expect(cutoffMs).toBeLessThan(thirtyDaysAgo + 5_000);

    const fresh = JSON.stringify({
      ts: new Date().toISOString(),
      question: 'What has she built?',
      answered: true,
    });
    const expired = JSON.stringify({
      ts: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(),
      question: 'What is "Eco Pass"?',
      answered: false,
    });
    const atCutoff = JSON.stringify({
      ts: cutoff,
      question: 'right on the line',
      answered: true,
    });
    const invalid = 'not-json';
    const missingTimestamp = JSON.stringify({ question: 'no timestamp', answered: true });
    const numericTimestamp = JSON.stringify({ ts: 0, question: 'bad timestamp', answered: false });

    expect(applyPruneScript(script, 'chat:log', cutoff, [
      fresh,
      expired,
      atCutoff,
      invalid,
      missingTimestamp,
      numericTimestamp,
      expired,
    ])).toEqual([fresh, atCutoff, invalid, missingTimestamp, numericTimestamp]);
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
