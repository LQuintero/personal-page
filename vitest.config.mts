import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname) }],
  },
});
