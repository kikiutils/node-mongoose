import { defineConfig } from 'tsdown';

export default defineConfig({
    alias: { '@/': './src' },
    clean: true,
    dts: true,
    entry: [
        './src/**/*.ts',
        '!./src/**/_internals.ts',
        '!./src/**/internals/**',
        '!./src/**/_internals/**',
    ],
    exports: true,
    format: 'esm',
    publint: true,
    sourcemap: true,
    tsconfig: './tsconfig.build.json',
    unbundle: true,
    unused: true,
});
