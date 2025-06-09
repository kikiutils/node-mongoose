import { defineConfig } from 'ts-project-builder';

export default defineConfig({ builtInInputPluginOptions: { typescript: { tsconfig: './tsconfig.build.json' } } });
