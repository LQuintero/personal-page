import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  oxc: {
    jsx: {
      runtime: 'automatic',
    },
  },
  test: {
    environment: 'node',
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname) }],
  },
});
