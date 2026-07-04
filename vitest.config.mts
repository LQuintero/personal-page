import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
  },
  resolve: {
    alias: [
      { find: '@/server', replacement: path.resolve(__dirname, 'server') },
      { find: '@/shared', replacement: path.resolve(__dirname, 'shared') },
      { find: '@', replacement: path.resolve(__dirname, 'client') },
    ],
  },
});
