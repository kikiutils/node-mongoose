import { defineConfig } from 'tsdown';

export default defineConfig({
    attw: {
        level: 'error',
        profile: 'esm-only',
    },
    clean: true,
    deps: { onlyBundle: [] },
    dts: true,
    entry: ['./src/**/*.ts'],
    exports: { exclude: [/(^|\/)_?internals?(\/|$)/] },
    fixedExtension: false,
    format: 'esm',
    publint: true,
    sourcemap: true,
    tsconfig: './tsconfig.build.json',
    unbundle: true,
    unused: true,
});
