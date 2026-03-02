import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';

export default defineConfig({
  build: {
    target: 'es2020',
    lib: {
      entry: './src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.qwik.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        '@builder.io/qwik',
        '@builder.io/qwik/jsx-runtime',
        '@builder.io/qwik/jsx-dev-runtime',
        /^@builder\.io\/qwik/,
      ],
    },
    minify: 'esbuild',
    sourcemap: true,
  },
  plugins: [qwikVite()],
});
