import { resolve } from 'node:path';

import { parse } from 'tsconfck';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    esbuild: { tsconfigRaw: (await parse('./tsconfig.tests.json')).tsconfig },
    resolve: { alias: { '@': resolve(import.meta.dirname, 'src') } },
    test: {
        coverage: {
            include: ['src/**/*'],
            reporter: [
                'text',
                'lcov',
            ],
        },
    },
});
