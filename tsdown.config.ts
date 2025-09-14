import {
    glob,
    rm,
} from 'node:fs/promises';
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
    plugins: [
        {
            name: 'remove-types-js',
            async writeBundle() {
                const files = [];
                for await (const file of glob('./dist/types/**/*.js')) files.push(file);
                await Promise.all(files.map((file) => rm(file, { force: true })));
            },
        },
    ],
    publint: true,
    sourcemap: true,
    tsconfig: './tsconfig.build.json',
    unbundle: true,
    unused: true,
});
