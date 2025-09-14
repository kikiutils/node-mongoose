import { resolve } from 'node:path';

import { defineConfig } from 'tsdown';

export default defineConfig({
    alias: { '@': resolve(import.meta.dirname, 'src') },
    clean: true,
    dts: true,
    entry: [
        './src/**/*.ts',
        '!./src/**/_internals.ts',
        '!./src/**/_internals/**',
        '!./src/**/internals/**',
    ],
    exports: true,
    format: 'esm',
    publint: true,
    sourcemap: true,
    tsconfig: './tsconfig.build.json',
    unbundle: true,
    unused: true,
});
