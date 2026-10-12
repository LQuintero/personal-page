declare module 'fengari' {
  type LuaState = object;

  export const lua: {
    LUA_OK: number;
    lua_atnativeerror(L: LuaState, fn: (L: LuaState) => number): void;
    lua_close(L: LuaState): void;
    lua_newtable(L: LuaState): void;
    lua_pushboolean(L: LuaState, b: boolean): void;
    lua_pushcfunction(L: LuaState, fn: (L: LuaState) => number): void;
    lua_pushinteger(L: LuaState, n: number): void;
    lua_pushliteral(L: LuaState, s: string): void;
    lua_pushnil(L: LuaState): void;
    lua_pushnumber(L: LuaState, n: number): void;
    lua_rawseti(L: LuaState, idx: number, n: number): void;
    lua_setfield(L: LuaState, idx: number, k: string): void;
    lua_setglobal(L: LuaState, name: string): void;
    lua_tointeger(L: LuaState, idx: number): number;
    lua_tojsstring(L: LuaState, idx: number): string | null;
  };
  export const lauxlib: {
    luaL_dostring(L: LuaState, s: Uint8Array): number;
    luaL_error(L: LuaState, fmt: string): number;
    luaL_newstate(): LuaState;
  };
  export const lualib: {
    luaL_openlibs(L: LuaState): void;
  };
  export function to_luastring(s: string): Uint8Array;
}
