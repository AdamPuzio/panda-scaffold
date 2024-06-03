import { defineConfig } from 'tsup'

export default defineConfig({
  shims: true,
  splitting: true,
  target: 'esnext',
  platform: 'node',
  esbuildOptions(options, context) {
    if (context.format === 'esm') options.inject = ['src/esm-shim.ts']
  },
})
