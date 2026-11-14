import { defineConfig } from 'tsdown';

import { generatePackageExports } from './scripts/generate-package-exports.ts';

export default defineConfig({
    attw: {
        level: 'error',
        profile: 'esm-only',
    },
    clean: true,
    deps: { onlyBundle: [] },
    dts: true,
    entry: ['./src/**/*.ts'],
    exports: {
        customExports: generatePackageExports,
        exclude: [/(?:^|\/)_?internals?(?:\/|$)/],
    },
    fixedExtension: false,
    format: 'esm',
    publint: true,
    sourcemap: true,
    tsconfig: './tsconfig.build.json',
    unbundle: true,
    unused: true,
});
