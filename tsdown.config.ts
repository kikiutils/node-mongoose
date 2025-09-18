import {
    glob,
    rm,
} from 'node:fs/promises';
import { resolve } from 'node:path';

import { defineConfig } from 'tsdown';

import packageJson from './package.json' with { type: 'json' };

export default defineConfig({
    alias: { '@': resolve(import.meta.dirname, 'src') },
    clean: true,
    dts: true,
    entry: ['./src/**/*.ts'],
    exports: {
        customExports(exports) {
            Object.entries(exports).forEach(([key, value]: [string, string]) => {
                if (!value.endsWith('.js')) return;
                if (value.includes('internals')) return delete exports[key];
                exports[key] = {
                    /* eslint-disable perfectionist/sort-objects */
                    types: value.replace(/\.js$/, '.d.ts'),
                    import: null,
                    require: null,
                    /* eslint-enable perfectionist/sort-objects */
                };

                if (!value.startsWith('./dist/types')) exports[key].import = value;
            });

            return exports;
        },
    },
    external: [
        ...new Set([
            // eslint-disable-next-line ts/ban-ts-comment
            // @ts-ignore
            ...Object.keys(packageJson.dependencies || {}),
            ...Object.keys(packageJson.devDependencies || {}),
            // eslint-disable-next-line ts/ban-ts-comment
            // @ts-ignore
            ...Object.keys(packageJson.peerDependencies || {}),
        ]),
    ],
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
