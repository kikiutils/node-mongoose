# Changelog

## v6.1.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v6.0.1...v6.1.0)

### 🚀 Enhancements

- `mongooseAssertionsPlugin` add `assertUpdateSuccess` static model method ([be7817a](https://github.com/kikiutils/node-mongoose/commit/be7817a))

### ❤️ Contributors

- kiki-kanri

## v6.0.1

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v6.0.0...v6.0.1)

### 🩹 Fixes

- Correct generic type error in `assertMongooseUpdateSuccess` ([ff92747](https://github.com/kikiutils/node-mongoose/commit/ff92747))
- Export `typeof mongooseAssertionsPlugin` type in `builder.ts` for correct type loading ([304d9f7](https://github.com/kikiutils/node-mongoose/commit/304d9f7))

### ❤️ Contributors

- kiki-kanri

## v6.0.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v5.2.0...v6.0.0)

### 🚀 Enhancements

- Add assertions plugin and enforce it in `buildMongooseModel` ([2504e0e](https://github.com/kikiutils/node-mongoose/commit/2504e0e))

### 🔥 Performance

- **mongooseNormalizePlugin:** Pre-compute paths for conversion to improve performance and simplify code logic ([2399e8a](https://github.com/kikiutils/node-mongoose/commit/2399e8a))

### 💅 Refactors

- ⚠️ Restructure codebase ([bc590ed](https://github.com/kikiutils/node-mongoose/commit/bc590ed))
- ⚠️ Remove `mongooseDocumentOrObjectIdToDocument` ([e94e6aa](https://github.com/kikiutils/node-mongoose/commit/e94e6aa))

### 🏡 Chore

- Remove alias config ([e353604](https://github.com/kikiutils/node-mongoose/commit/e353604))
- Change `update-peer-dependencies-meta.ts` to non-executable permission file ([62a7690](https://github.com/kikiutils/node-mongoose/commit/62a7690))
- Upgrade dependencies ([8e206cc](https://github.com/kikiutils/node-mongoose/commit/8e206cc))

#### ⚠️ Breaking Changes

- ⚠️ Restructure codebase ([bc590ed](https://github.com/kikiutils/node-mongoose/commit/bc590ed))
- ⚠️ Remove `mongooseDocumentOrObjectIdToDocument` ([e94e6aa](https://github.com/kikiutils/node-mongoose/commit/e94e6aa))

### ❤️ Contributors

- kiki-kanri

## v5.2.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v5.1.6...v5.2.0)

### 🚀 Enhancements

- Enable deep registration of `normalizePlugin` for all schemas (including sub-schemas) in `buildMongooseModel` by default; add option to disable ([09068f0](https://github.com/kikiutils/node-mongoose/commit/09068f0))

### ❤️ Contributors

- kiki-kanri

## v5.1.6

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v5.1.5...v5.1.6)

### 🩹 Fixes

- Ensure tsdown `customExports` returns after deleting keys containing internals ([7324bab](https://github.com/kikiutils/node-mongoose/commit/7324bab))

### 💅 Refactors

- Revert all import paths back to relative paths instead of using aliases ([0f6c1ae](https://github.com/kikiutils/node-mongoose/commit/0f6c1ae))

### 📖 Documentation

- Update README ([63ba464](https://github.com/kikiutils/node-mongoose/commit/63ba464))

### 📦 Build

- Clean up js files under `dist/types` after tsdown build and update exports config ([6fa1d2b](https://github.com/kikiutils/node-mongoose/commit/6fa1d2b))
- Update tsdown config to treat all dependencies as external ([f5e4f7a](https://github.com/kikiutils/node-mongoose/commit/f5e4f7a))
- Update tsdown customExports to remove entries with keys containing "internals" ([59b1622](https://github.com/kikiutils/node-mongoose/commit/59b1622))
- Update tsdown entry ([2e67d6b](https://github.com/kikiutils/node-mongoose/commit/2e67d6b))
- Set tsdown external from package.json instead of using wildcard * ([7dc5f28](https://github.com/kikiutils/node-mongoose/commit/7dc5f28))
- Update `customExports` rules to enable IDE import hints for package usage ([e4111c0](https://github.com/kikiutils/node-mongoose/commit/e4111c0))
- Update `customExports` rules to enable IDE import hints for package usage ([fa88888](https://github.com/kikiutils/node-mongoose/commit/fa88888))

### 🏡 Chore

- Set minimum supported version to 22.12.0 ([76e8cc1](https://github.com/kikiutils/node-mongoose/commit/76e8cc1))

### ❤️ Contributors

- kiki-kanri

## v5.1.5

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v5.1.4...v5.1.5)

### 🩹 Fixes

- Explicitly type `buildMongooseModel` to avoid losing return type after build ([628053d](https://github.com/kikiutils/node-mongoose/commit/628053d))

### ❤️ Contributors

- kiki-kanri

## v5.1.4

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v5.1.3...v5.1.4)

### 🩹 Fixes

- Remove tsdown remove-types-js plugin and custom exports configuration ([735a3a9](https://github.com/kikiutils/node-mongoose/commit/735a3a9))

### ❤️ Contributors

- kiki-kanri

## v5.1.3

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v5.1.2...v5.1.3)

### 🩹 Fixes

- Ensure types are properly loaded during usage ([4020d02](https://github.com/kikiutils/node-mongoose/commit/4020d02))

### 📦 Build

- Clean up js files under `dist/types` after tsdown build and update exports config ([299e647](https://github.com/kikiutils/node-mongoose/commit/299e647))

### ❤️ Contributors

- kiki-kanri

## v5.1.2

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v5.1.1...v5.1.2)

### 🩹 Fixes

- Remove custom exports configuration from tsdown ([efb18bc](https://github.com/kikiutils/node-mongoose/commit/efb18bc))
- Remove tsdown `remove-types-js` plugin ([6922c2f](https://github.com/kikiutils/node-mongoose/commit/6922c2f))

### ❤️ Contributors

- kiki-kanri

## v5.1.1

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v5.1.0...v5.1.1)

### 📦 Build

- Clean up js files under `dist/types` after tsdown build and update exports config ([2affd31](https://github.com/kikiutils/node-mongoose/commit/2affd31))

### ❤️ Contributors

- kiki-kanri

## v5.1.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v5.0.1...v5.1.0)

### 🚀 Enhancements

- Add `update-peer-dependencies-meta.ts` ([643c006](https://github.com/kikiutils/node-mongoose/commit/643c006))

### 🩹 Fixes

- Resolve alias configuration error in tsdown setup ([656e2e0](https://github.com/kikiutils/node-mongoose/commit/656e2e0))
- Add missing -b flag to typecheck command ([cf0c795](https://github.com/kikiutils/node-mongoose/commit/cf0c795))

### 💅 Refactors

- Remove unnecessary code and update some import paths to use `@/` (paths alias) ([cefc865](https://github.com/kikiutils/node-mongoose/commit/cefc865))
- Update method of loading global types related to pagination ([41d0e64](https://github.com/kikiutils/node-mongoose/commit/41d0e64))

### 🏡 Chore

- Update tsdown entry ([9cbb6bb](https://github.com/kikiutils/node-mongoose/commit/9cbb6bb))
- Disable `isolatedDeclarations` ([85f066e](https://github.com/kikiutils/node-mongoose/commit/85f066e))
- Update eslint config ([09d584b](https://github.com/kikiutils/node-mongoose/commit/09d584b))
- Update all scripts ([fa5e797](https://github.com/kikiutils/node-mongoose/commit/fa5e797))
- Upgrade dependencies ([865f6ec](https://github.com/kikiutils/node-mongoose/commit/865f6ec))

### ❤️ Contributors

- kiki-kanri

## v5.0.1

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v5.0.0...v5.0.1)

### 🩹 Fixes

- Ensure types are properly loaded during usage ([c22ef96](https://github.com/kikiutils/node-mongoose/commit/c22ef96))

### ❤️ Contributors

- kiki-kanri

## v5.0.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v4.0.1...v5.0.0)

### 🩹 Fixes

- Fix all lint errors ([1e87145](https://github.com/kikiutils/node-mongoose/commit/1e87145))

### 💅 Refactors

- **tsconfig:** Separate references so src and tests use different settings ([df472e2](https://github.com/kikiutils/node-mongoose/commit/df472e2))
- Replace `lodash` with `es-toolkit` ([344f33e](https://github.com/kikiutils/node-mongoose/commit/344f33e))

### 📦 Build

- ⚠️ Switch builder to tsdown and convert package to pure ESM ([d307be4](https://github.com/kikiutils/node-mongoose/commit/d307be4))

### 🏡 Chore

- **ci:** Remove pnpm cache configure in workflow ([abc0801](https://github.com/kikiutils/node-mongoose/commit/abc0801))
- ⚠️ Drop support for Node.js 20, set minimum supported version to 22 ([3319820](https://github.com/kikiutils/node-mongoose/commit/3319820))
- Upgrade devDependencies ([57244a0](https://github.com/kikiutils/node-mongoose/commit/57244a0))
- Set tsdown alias and tsconfig paths ([be49779](https://github.com/kikiutils/node-mongoose/commit/be49779))
- Update tsdown config ([fc9e7cb](https://github.com/kikiutils/node-mongoose/commit/fc9e7cb))
- Add `tsconfig.base.json` ([f6ba6dd](https://github.com/kikiutils/node-mongoose/commit/f6ba6dd))
- Update eslint config ([99cd82e](https://github.com/kikiutils/node-mongoose/commit/99cd82e))
- Update tsdown entry config ([4cbeb50](https://github.com/kikiutils/node-mongoose/commit/4cbeb50))

### ✅ Tests

- Fix vitest config to correctly load tsconfig and aliases ([0522f79](https://github.com/kikiutils/node-mongoose/commit/0522f79))

#### ⚠️ Breaking Changes

- ⚠️ Switch builder to tsdown and convert package to pure ESM ([d307be4](https://github.com/kikiutils/node-mongoose/commit/d307be4))
- ⚠️ Drop support for Node.js 20, set minimum supported version to 22 ([3319820](https://github.com/kikiutils/node-mongoose/commit/3319820))

### ❤️ Contributors

- kiki-kanri

## v4.0.1

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v4.0.0...v4.0.1)

### 🩹 Fixes

- Prevent `mongooseNormalizePlugin` from assigning id: undefined when input _id is undefined ([d68e729](https://github.com/kikiutils/node-mongoose/commit/d68e729))

### 🏡 Chore

- Bump tsconfig target to es2023 ([b9185b7](https://github.com/kikiutils/node-mongoose/commit/b9185b7))
- Update `.gitignore` ([1465997](https://github.com/kikiutils/node-mongoose/commit/1465997))
- **ci:** Configure pnpm cache in workflow ([79e2264](https://github.com/kikiutils/node-mongoose/commit/79e2264))
- Upgrade dependencies ([8d29a5e](https://github.com/kikiutils/node-mongoose/commit/8d29a5e))

### ❤️ Contributors

- kiki-kanri

## v4.0.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v3.3.0...v4.0.0)

### 🚀 Enhancements

- Add `toObjectIdHexString` utils and test unit ([be3c948](https://github.com/kikiutils/node-mongoose/commit/be3c948))

### 💅 Refactors

- Replace `ObjectIdFields` setting in `DataToBaseMongooseDocType` with direct use of `SetFieldsToObjectId` ([1335c51](https://github.com/kikiutils/node-mongoose/commit/1335c51))

### 🏡 Chore

- ⚠️ Drop support for Node.js 18.12.1, set minimum supported version to 20 ([32c6ad3](https://github.com/kikiutils/node-mongoose/commit/32c6ad3))
- Upgrade dependencies ([a752987](https://github.com/kikiutils/node-mongoose/commit/a752987))

#### ⚠️ Breaking Changes

- ⚠️ Drop support for Node.js 18.12.1, set minimum supported version to 20 ([32c6ad3](https://github.com/kikiutils/node-mongoose/commit/32c6ad3))

### ❤️ Contributors

- kiki-kanri

## v3.3.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v3.2.0...v3.3.0)

### 🚀 Enhancements

- Add `DataToBaseMongooseDocType` global type ([6054967](https://github.com/kikiutils/node-mongoose/commit/6054967))

### 💅 Refactors

- Rename generic parameter `OT` to `K` ([731ca7d](https://github.com/kikiutils/node-mongoose/commit/731ca7d))

### ❤️ Contributors

- kiki-kanri

## v3.2.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v3.1.2...v3.2.0)

### 🚀 Enhancements

- Add `SetFieldsToObjectId` global type ([91f32f4](https://github.com/kikiutils/node-mongoose/commit/91f32f4))

### ❤️ Contributors

- kiki-kanri

## v3.1.2

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v3.1.1...v3.1.2)

### 🩹 Fixes

- Fix type error ([bfb939f](https://github.com/kikiutils/node-mongoose/commit/bfb939f))

### 🏡 Chore

- Upgrade dependencies ([dc6c114](https://github.com/kikiutils/node-mongoose/commit/dc6c114))
- Update dependencies and modify scripts ([374cc56](https://github.com/kikiutils/node-mongoose/commit/374cc56))
- Clean up logger and error messages by removing periods and other punctuation ([ffd934a](https://github.com/kikiutils/node-mongoose/commit/ffd934a))
- Format code ([f51dc13](https://github.com/kikiutils/node-mongoose/commit/f51dc13))

### ✅ Tests

- Change vitest config file to mjs ([5c3bc1f](https://github.com/kikiutils/node-mongoose/commit/5c3bc1f))
- Update `tests/schema-builders/string.test.ts` unit ([16b469e](https://github.com/kikiutils/node-mongoose/commit/16b469e))

### ❤️ Contributors

- kiki-kanri

## v3.1.1

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v3.1.0...v3.1.1)

### 💅 Refactors

- Remove unnecessary type annotations from some parameters ([60bf3b4](https://github.com/kikiutils/node-mongoose/commit/60bf3b4))

### 📖 Documentation

- Update README badges urls ([499bc71](https://github.com/kikiutils/node-mongoose/commit/499bc71))
- Replace `%2F` with `/` in badge URLs in README ([4aaf916](https://github.com/kikiutils/node-mongoose/commit/4aaf916))

### 🏡 Chore

- Format script ([16ca049](https://github.com/kikiutils/node-mongoose/commit/16ca049))
- Update file permissions after installing or updating dependencies ([d141f76](https://github.com/kikiutils/node-mongoose/commit/d141f76))
- Add `--hideAuthorEmail` flag to bumplog command ([382091b](https://github.com/kikiutils/node-mongoose/commit/382091b))
- Add typecheck command to package.json scripts ([2a1f7e0](https://github.com/kikiutils/node-mongoose/commit/2a1f7e0))
- Rename `jest.config.js` to `jest.config.mjs` ([76371a1](https://github.com/kikiutils/node-mongoose/commit/76371a1))
- Reorder lint, test, and build steps in release command ([b63dcb4](https://github.com/kikiutils/node-mongoose/commit/b63dcb4))
- Disable `isolatedDeclarations` in tsconfig ([ed1636f](https://github.com/kikiutils/node-mongoose/commit/ed1636f))
- Update `modify-files-permissions.sh` ([89f72e3](https://github.com/kikiutils/node-mongoose/commit/89f72e3))
- Add option to `upgrade-dependencies.sh` to clean `node_modules` and `pnpm-lock.yaml` before upgrading ([e542b14](https://github.com/kikiutils/node-mongoose/commit/e542b14))
- Upgrade dependencies ([d3ee5a7](https://github.com/kikiutils/node-mongoose/commit/d3ee5a7))
- Ensure all scripts change to their own directory before execution ([9be5fbf](https://github.com/kikiutils/node-mongoose/commit/9be5fbf))
- Update ignore files ([c81c294](https://github.com/kikiutils/node-mongoose/commit/c81c294))
- **scripts:** Ensure all scripts `cd` to their current directory correctly ([5362c3b](https://github.com/kikiutils/node-mongoose/commit/5362c3b))
- Set `--max-warnings=0` for `lint` and `lint:fix` ([bffe476](https://github.com/kikiutils/node-mongoose/commit/bffe476))
- Set eslint config to enable `lib` mode ([59e03e4](https://github.com/kikiutils/node-mongoose/commit/59e03e4))
- Disable `ts/explicit-function-return-type` eslint rule ([5190f6b](https://github.com/kikiutils/node-mongoose/commit/5190f6b))
- Lint code ([f8f0974](https://github.com/kikiutils/node-mongoose/commit/f8f0974))
- **test:** Migrate from `jest` to `vitest` ([9a9d869](https://github.com/kikiutils/node-mongoose/commit/9a9d869))
- Split `tsconfig` and create build-specific config for production builds ([564b6d2](https://github.com/kikiutils/node-mongoose/commit/564b6d2))
- **vitest:** Configure coverage to collect files only under `src/` ([e2c7f65](https://github.com/kikiutils/node-mongoose/commit/e2c7f65))
- Upgrade dependencies and remove `@types/node` ([32aaf31](https://github.com/kikiutils/node-mongoose/commit/32aaf31))
- Wrap all variable expansions in scripts with `${}` ([82c47c9](https://github.com/kikiutils/node-mongoose/commit/82c47c9))
- Remove Jest-related files, examples, and update README ([08c1abd](https://github.com/kikiutils/node-mongoose/commit/08c1abd))
- Lint codes ([805f4ab](https://github.com/kikiutils/node-mongoose/commit/805f4ab))

### ✅ Tests

- Add pass test unit ([d7b98bd](https://github.com/kikiutils/node-mongoose/commit/d7b98bd))
- Migrate test to vitest ([a6fc90c](https://github.com/kikiutils/node-mongoose/commit/a6fc90c))

### 🤖 CI

- Add test github workflow config file ([dd421d1](https://github.com/kikiutils/node-mongoose/commit/dd421d1))
- Update test workflow ([1519e46](https://github.com/kikiutils/node-mongoose/commit/1519e46))
- Update condition for uploading to Codecov in workflow job ([39851ac](https://github.com/kikiutils/node-mongoose/commit/39851ac))
- Set `--prod=false` when install dependencies ([93d7945](https://github.com/kikiutils/node-mongoose/commit/93d7945))
- Remove `--prod=false` flag when install dependencies ([249def0](https://github.com/kikiutils/node-mongoose/commit/249def0))

### ❤️ Contributors

- kiki-kanri

## v3.1.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v3.0.4...v3.1.0)

### 🚀 Enhancements

- Add option to normalize plugin to control _id conversion and to hex id ([a6f5442](https://github.com/kikiutils/node-mongoose/commit/a6f5442))

### ❤️ Contributors

- kiki-kanri

## v3.0.4

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v3.0.3...v3.0.4)

### 🩹 Fixes

- Handle non-ObjectId values when converting _id to id in normalize plugin ([d1c4b4a](https://github.com/kikiutils/node-mongoose/commit/d1c4b4a))
- Use `@ts-expect-error` to suppress TypeScript errors when importing lodash functions ([59c659b](https://github.com/kikiutils/node-mongoose/commit/59c659b))

### 💅 Refactors

- Change `Decimal` import to named import ([aa4a9b8](https://github.com/kikiutils/node-mongoose/commit/aa4a9b8))

### 🏡 Chore

- Upgrade dependencies ([b4277f7](https://github.com/kikiutils/node-mongoose/commit/b4277f7))

### ❤️ Contributors

- kiki-kanri

## v3.0.3

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v3.0.2...v3.0.3)

### 🩹 Fixes

- Correct `createConnection` import to resolve runtime error ([6b000c7](https://github.com/kikiutils/node-mongoose/commit/6b000c7))

### ❤️ Contributors

- kiki-kanri

## v3.0.2

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v3.0.1...v3.0.2)

### 💅 Refactors

- Update import style for `Decimal` ([20da030](https://github.com/kikiutils/node-mongoose/commit/20da030))
- Simplify type definitions for `BaseMongooseModelData`, `WithMongooseTimestampFieldsData`, and `BaseMongooseDocType` than change some IfElse fallback types to unknown ([1295231](https://github.com/kikiutils/node-mongoose/commit/1295231))
- Remove explicit return type from `mongooseDocumentOrObjectIdToDocument` ([62b4cf4](https://github.com/kikiutils/node-mongoose/commit/62b4cf4))

### 🏡 Chore

- Remove `tslib` devDependency ([9b888fa](https://github.com/kikiutils/node-mongoose/commit/9b888fa))
- Set sideEffects to false in package.json ([52b1e01](https://github.com/kikiutils/node-mongoose/commit/52b1e01))

### ❤️ Contributors

- kiki-kanri

## v3.0.1

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v3.0.0...v3.0.1)

### 🩹 Fixes

- Add missing file extensions in lodash import paths ([b2d04d7](https://github.com/kikiutils/node-mongoose/commit/b2d04d7))

### 💅 Refactors

- Update some imports to avoid importing entire modules ([eb4b394](https://github.com/kikiutils/node-mongoose/commit/eb4b394))

### ❤️ Contributors

- kiki-kanri

## v3.0.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v2.3.1...v3.0.0)

### 💅 Refactors

- ⚠️ Update imports and exports ([86dbc5d](https://github.com/kikiutils/node-mongoose/commit/86dbc5d))

### 🏡 Chore

- Upgrade dependencies ([52bf666](https://github.com/kikiutils/node-mongoose/commit/52bf666))
- Format code ([2e72af4](https://github.com/kikiutils/node-mongoose/commit/2e72af4))
- Upgrade dependencies ([70fa459](https://github.com/kikiutils/node-mongoose/commit/70fa459))

#### ⚠️ Breaking Changes

- ⚠️ Update imports and exports ([86dbc5d](https://github.com/kikiutils/node-mongoose/commit/86dbc5d))

### ❤️ Contributors

- kiki-kanri

## v2.3.1

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v2.3.0...v2.3.1)

### 💅 Refactors

- Rename `ensureUpdateSuccess` to `assertMongooseUpdateSuccess` ([17a576d](https://github.com/kikiutils/node-mongoose/commit/17a576d))

### ❤️ Contributors

- kiki-kanri

## v2.3.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v2.2.0...v2.3.0)

### 🚀 Enhancements

- Add `ensureUpdateSuccess` utils ([4302b77](https://github.com/kikiutils/node-mongoose/commit/4302b77))

### 🏡 Chore

- Upgrade dependencies ([3af6e01](https://github.com/kikiutils/node-mongoose/commit/3af6e01))
- Upgrade examples dependencies ([4c1a7b1](https://github.com/kikiutils/node-mongoose/commit/4c1a7b1))

### ❤️ Contributors

- kiki-kanri

## v2.2.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v2.1.8...v2.2.0)

### 🚀 Enhancements

- Enhance `buildMongooseModel` to configure `schema.timestamps` ([17f5124](https://github.com/kikiutils/node-mongoose/commit/17f5124))

### 🏡 Chore

- Upgrade dependencies ([a0c4ff2](https://github.com/kikiutils/node-mongoose/commit/a0c4ff2))
- Format and lint codes ([55a1743](https://github.com/kikiutils/node-mongoose/commit/55a1743))

### ❤️ Contributors

- kiki-kanri

## v2.1.8

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v2.1.7...v2.1.8)

### 🏡 Chore

- Upgrade dependencies ([c4cd6b0](https://github.com/kikiutils/node-mongoose/commit/c4cd6b0))
- Update repository URL ([2204dc8](https://github.com/kikiutils/node-mongoose/commit/2204dc8))
- Set `hideAuthorEmail` arg in changelogen command ([f8413d3](https://github.com/kikiutils/node-mongoose/commit/f8413d3))

### ❤️ Contributors

- kiki-kanri

## v2.1.7

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v2.1.6...v2.1.7)

### 🩹 Fixes

- Resolve issue in `decimal128SchemaBuilder` where `undefined` values cause errors after using `setRoundAndToFixedSetter` ([e861db2](https://github.com/kikiutils/node-mongoose/commit/e861db2))

### 💅 Refactors

- Enforce camelCase naming for all variables, classes, methods, types, etc., ignoring abbreviations ([29698c5](https://github.com/kikiutils/node-mongoose/commit/29698c5))

### 🏡 Chore

- Upgrade dependencies ([6edcf10](https://github.com/kikiutils/node-mongoose/commit/6edcf10))

### ❤️ Contributors

- kiki-kanri

## v2.1.6

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v2.1.5...v2.1.6)

### 🏡 Chore

- Upgrade dependencies ([ca0b34d](https://github.com/kikiutils/node-mongoose/commit/ca0b34d))
- Update aggregate-paginate related types ([208dabf](https://github.com/kikiutils/node-mongoose/commit/208dabf))

### ❤️ Contributors

- kiki-kanri

## v2.1.5

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v2.1.4...v2.1.5)

### 🩹 Fixes

- Correct `type` types in `SchemaBuilder` ([6e554ca](https://github.com/kikiutils/node-mongoose/commit/6e554ca))

### 💅 Refactors

- Replace ternary type expressions with `IfElse` type ([2391988](https://github.com/kikiutils/node-mongoose/commit/2391988))

### 🏡 Chore

- Upgrade examples dependencies ([15b1fcb](https://github.com/kikiutils/node-mongoose/commit/15b1fcb))
- Set `tsconfig.json.moduleResolution` to bundler in examples folder ([3102c1f](https://github.com/kikiutils/node-mongoose/commit/3102c1f))
- Upgrade dependencies ([bc5892d](https://github.com/kikiutils/node-mongoose/commit/bc5892d))
- Update `paginate` type definition file ([aea186a](https://github.com/kikiutils/node-mongoose/commit/aea186a))

### ❤️ Contributors

- kiki-kanri

## v2.1.4

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v2.1.3...v2.1.4)

### 📦 Build

- Enable sourcemap output in build process ([ad9cc4e](https://github.com/kikiutils/node-mongoose/commit/ad9cc4e))

### 🏡 Chore

- Upgrade dependencies ([2061a4f](https://github.com/kikiutils/node-mongoose/commit/2061a4f))
- Modify pack file structure and update package.json.exports configuration ([a7605a8](https://github.com/kikiutils/node-mongoose/commit/a7605a8))

### ❤️ Contributors

- kiki-kanri

## v2.1.3

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v2.1.2...v2.1.3)

### 🩹 Fixes

- Resolve issue in decimal128 schema builder's `setToStringGetter` not handling undefined input ([10434c6](https://github.com/kikiutils/node-mongoose/commit/10434c6))

### 💅 Refactors

- Enforce usage of global process instead of local process ([ae1e1d2](https://github.com/kikiutils/node-mongoose/commit/ae1e1d2))

### 🏡 Chore

- Upgrade dependencies ([7ce9b4f](https://github.com/kikiutils/node-mongoose/commit/7ce9b4f))

### 🎨 Styles

- Format codes ([980a557](https://github.com/kikiutils/node-mongoose/commit/980a557))

### ❤️ Contributors

- kiki-kanri

## v2.1.2

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v2.1.1...v2.1.2)

### 🏡 Chore

- Update eslint-config and format codes ([6c60cc9](https://github.com/kikiutils/node-mongoose/commit/6c60cc9))
- Modify `eslint-disable-next-line` comment style ([0a7b15e](https://github.com/kikiutils/node-mongoose/commit/0a7b15e))
- Upgrade dependencies ([226faf1](https://github.com/kikiutils/node-mongoose/commit/226faf1))
- Upgrade dependencies ([553fc56](https://github.com/kikiutils/node-mongoose/commit/553fc56))

### 🎨 Styles

- Change all indentation to 4 spaces ([62c0f45](https://github.com/kikiutils/node-mongoose/commit/62c0f45))
- Format and lint all files ([777467a](https://github.com/kikiutils/node-mongoose/commit/777467a))

### ❤️ Contributors

- kiki-kanri

## v2.1.1

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v2.1.0...v2.1.1)

### 🏡 Chore

- Upgrade dependencies ([6d0af61](https://github.com/kikiutils/node-mongoose/commit/6d0af61))
- Replace Prettier with ESLint, add related files, and update VSCode settings ([01dcce6](https://github.com/kikiutils/node-mongoose/commit/01dcce6))
- Modify scripts in package.json ([79116cc](https://github.com/kikiutils/node-mongoose/commit/79116cc))

### 🎨 Styles

- Format and lint all files ([4db725a](https://github.com/kikiutils/node-mongoose/commit/4db725a))

### ❤️ Contributors

- kiki-kanri

## v2.1.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v2.0.2...v2.1.0)

### 🚀 Enhancements

- Add `ExceptMongooseTimestampAndOtherFields` type ([058fc3b](https://github.com/kikiutils/node-mongoose/commit/058fc3b))
- Add index method to schema builders ([c4ec43e](https://github.com/kikiutils/node-mongoose/commit/c4ec43e))

### 💅 Refactors

- **examples:** Replace `Omit` type with type-fest's `Except` type ([b5a8de0](https://github.com/kikiutils/node-mongoose/commit/b5a8de0))

### ✅ Tests

- Update unit tests for base schema builder ([a887a5a](https://github.com/kikiutils/node-mongoose/commit/a887a5a))

### ❤️ Contributors

- kiki-kanri

## v2.0.2

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v2.0.1...v2.0.2)

### 💅 Refactors

- Rename `MaybeReadonly` to `Readonlyable` ([7c98bb7](https://github.com/kikiutils/node-mongoose/commit/7c98bb7))
- Change schema builder interface type merging to use type-fest's Merge type ([e488ba4](https://github.com/kikiutils/node-mongoose/commit/e488ba4))
- Rename `DoNotUseOrRemoveThisType` to `DoNotRemoveOrUseThisType` ([5d93b8c](https://github.com/kikiutils/node-mongoose/commit/5d93b8c))

### ❤️ Contributors

- kiki-kanri

## v2.0.1

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v2.0.0...v2.0.1)

### 🏡 Chore

- Update exports field in package.json ([805d620](https://github.com/kikiutils/node-mongoose/commit/805d620))
- Upgrade dependencies ([547dba3](https://github.com/kikiutils/node-mongoose/commit/547dba3))

### ❤️ Contributors

- kiki-kanri

## v2.0.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v2.0.0-rc.1...v2.0.0)

### 🚀 Enhancements

- Export all schema builder's Extend helper types ([3d048a4](https://github.com/kikiutils/node-mongoose/commit/3d048a4))

### 💅 Refactors

- Move `mongooseConnections` to `constants.ts` ([b6d51d1](https://github.com/kikiutils/node-mongoose/commit/b6d51d1))
- Tidy up and simplify code ([2851299](https://github.com/kikiutils/node-mongoose/commit/2851299))

### 📖 Documentation

- Update CHANGELOG ([b72d87e](https://github.com/kikiutils/node-mongoose/commit/b72d87e))
- Update README and add README for examples ([da691bb](https://github.com/kikiutils/node-mongoose/commit/da691bb))

### 🏡 Chore

- Remove all deprecated code ([bce1c4f](https://github.com/kikiutils/node-mongoose/commit/bce1c4f))
- Remove all files in examples folder ([3744a68](https://github.com/kikiutils/node-mongoose/commit/3744a68))
- Add basic files to examples folder ([af25bbe](https://github.com/kikiutils/node-mongoose/commit/af25bbe))
- Add mongoose dependency to examples ([5e8a26f](https://github.com/kikiutils/node-mongoose/commit/5e8a26f))
- Add example files ([faf0b53](https://github.com/kikiutils/node-mongoose/commit/faf0b53))

### ❤️ Contributors

- kiki-kanri

## v2.0.0-rc.1

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v2.0.0-rc.0...v2.0.0-rc.1)

### 🩹 Fixes

- Resolve issue with missing options.ts export in build files ([91374cb](https://github.com/kikiutils/node-mongoose/commit/91374cb))

### 💅 Refactors

- Merge `_connections.ts` and `_options.ts` to `_internals.ts` ([3a22c73](https://github.com/kikiutils/node-mongoose/commit/3a22c73))

### 🏡 Chore

- Upgrade examples dependencies ([7a097fe](https://github.com/kikiutils/node-mongoose/commit/7a097fe))

### 🎨 Styles

- Adjust line spacing for `@param` tags in some JSDoc comments ([0153ba4](https://github.com/kikiutils/node-mongoose/commit/0153ba4))

### ❤️ Contributors

- kiki-kanri

## v2.0.0-rc.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.7.1...v2.0.0-rc.0)

### 🚀 Enhancements

- Mark `customMongooseOptions` as deprecated and add new corresponding functionality ([97eecae](https://github.com/kikiutils/node-mongoose/commit/97eecae))

### 📖 Documentation

- Add codecov badge to README ([4e84017](https://github.com/kikiutils/node-mongoose/commit/4e84017))
- Add deprecation tag to certain types ([292de7b](https://github.com/kikiutils/node-mongoose/commit/292de7b))

### ✅ Tests

- Add unit tests for objectId and number schema builders ([7c83695](https://github.com/kikiutils/node-mongoose/commit/7c83695))
- Add unit tests for decimal128 schema builder ([d6927bf](https://github.com/kikiutils/node-mongoose/commit/d6927bf))

### ❤️ Contributors

- kiki-kanri

## v1.7.1

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.7.0...v1.7.1)

### 💅 Refactors

- **schema-builder:** Remove `PropsWithRequired` type parameter ([110e875](https://github.com/kikiutils/node-mongoose/commit/110e875))
- Modify Builder type in `createBaseSchemaBuilderFactory` ([ac9ef1f](https://github.com/kikiutils/node-mongoose/commit/ac9ef1f))

### 📖 Documentation

- Add comments to several schema builders ([6f074af](https://github.com/kikiutils/node-mongoose/commit/6f074af))

### 🏡 Chore

- Update release script and add test CI configuration file ([0f4e599](https://github.com/kikiutils/node-mongoose/commit/0f4e599))
- Add tsconfig.jest.json ([5d6b28c](https://github.com/kikiutils/node-mongoose/commit/5d6b28c))

### ✅ Tests

- Add unit tests for base schema-builder ([d2c455d](https://github.com/kikiutils/node-mongoose/commit/d2c455d))
- Modify base schema-builder test unit ([25b3d86](https://github.com/kikiutils/node-mongoose/commit/25b3d86))
- Add unit tests for boolean, date and number schema-builders ([96bc550](https://github.com/kikiutils/node-mongoose/commit/96bc550))
- Add unit tests for string schema-builder ([2fa5832](https://github.com/kikiutils/node-mongoose/commit/2fa5832))

### ❤️ Contributors

- kiki-kanri

## v1.7.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.6.0...v1.7.0)

### 🚀 Enhancements

- Add `objectIdSchemaBuilder` ([ecf4117](https://github.com/kikiutils/node-mongoose/commit/ecf4117))
- Add `decimal128SchemaBuilder` ([0cccf0a](https://github.com/kikiutils/node-mongoose/commit/0cccf0a))
- Add `setToStringGetter` property to `decimal128SchemaBuilder` ([7ea08e1](https://github.com/kikiutils/node-mongoose/commit/7ea08e1))
- Add `setRoundAndToFixedSetter` property to `decimal128SchemaBuilder` ([fd813a7](https://github.com/kikiutils/node-mongoose/commit/fd813a7))

### 🩹 Fixes

- Resolve missing type field issue in RefSchemaBuilder ([dc68335](https://github.com/kikiutils/node-mongoose/commit/dc68335))

### 💅 Refactors

- Use constants to define default validation messages for stringSchemaBuilder's ipv4 and ipv6 methods ([2c822ba](https://github.com/kikiutils/node-mongoose/commit/2c822ba))

### 📖 Documentation

- Add deprecation tag to `createMongooseObjectIdRefSchema` ([eb3b3d5](https://github.com/kikiutils/node-mongoose/commit/eb3b3d5))
- Add deprecation tag to certain constants, functions and properties ([c00a4f6](https://github.com/kikiutils/node-mongoose/commit/c00a4f6))

### 🏡 Chore

- Add testing dependencies and configuration files ([f327c27](https://github.com/kikiutils/node-mongoose/commit/f327c27))

### ❤️ Contributors

- kiki-kanri

## v1.6.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.5.0...v1.6.0)

### 🚀 Enhancements

- Add ipv4 and ipv6 methods to StringSchemaBuilder ([234756d](https://github.com/kikiutils/node-mongoose/commit/234756d))
- Allow passing schema to builder returned by createBaseSchemaBuilderFactory ([589c59b](https://github.com/kikiutils/node-mongoose/commit/589c59b))
- Add `refSchemaBuilder` ([44c1702](https://github.com/kikiutils/node-mongoose/commit/44c1702))

### 💅 Refactors

- Rename `createSchemaBuilder` to `createBaseSchemaBuilderFactory` and remove string-specific operations ([7f3ce35](https://github.com/kikiutils/node-mongoose/commit/7f3ce35))
- Modify stringSchemaBuilder to extend createBaseSchemaBuilderFactory ([85fc4ac](https://github.com/kikiutils/node-mongoose/commit/85fc4ac))
- Update other schema builders ([4d85342](https://github.com/kikiutils/node-mongoose/commit/4d85342))

### ❤️ Contributors

- kiki-kanri

## v1.5.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.4.1...v1.5.0)

### 🚀 Enhancements

- Add createSchemaBuilder function ([6a90caa](https://github.com/kikiutils/node-mongoose/commit/6a90caa))
- Add `stringSchemaBuilder` ([86f223c](https://github.com/kikiutils/node-mongoose/commit/86f223c))
- Add `MaybeReadonly` type and update `StringSchemaBuilder` ([46c7350](https://github.com/kikiutils/node-mongoose/commit/46c7350))
- Add `numberSchemaBuilder` ([8a314e3](https://github.com/kikiutils/node-mongoose/commit/8a314e3))
- Add `booleanSchemaBuilder` ([cd56098](https://github.com/kikiutils/node-mongoose/commit/cd56098))
- Add `dateSchemaBuilder` ([cff37b1](https://github.com/kikiutils/node-mongoose/commit/cff37b1))

### 💅 Refactors

- Remove duplicate type definitions ([d77b31f](https://github.com/kikiutils/node-mongoose/commit/d77b31f))
- Add deprecation tags to certain properties and functions ([b327aff](https://github.com/kikiutils/node-mongoose/commit/b327aff))

### 🏡 Chore

- Update exports field in package.json ([0b2f242](https://github.com/kikiutils/node-mongoose/commit/0b2f242))
- Upgrade dependencies and modify release script ([06e1c86](https://github.com/kikiutils/node-mongoose/commit/06e1c86))
- Update minimum Node.js version ([217920d](https://github.com/kikiutils/node-mongoose/commit/217920d))
- Upgrade dependencies ([c727924](https://github.com/kikiutils/node-mongoose/commit/c727924))

### ❤️ Contributors

- kiki-kanri

## v1.4.1

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.4.0...v1.4.1)

### 🩹 Fixes

- Resolve issues in code reported by gitroll ([e7103c6](https://github.com/kikiutils/node-mongoose/commit/e7103c6))

### 🏡 Chore

- Modify tsconfig.json ([7d2c147](https://github.com/kikiutils/node-mongoose/commit/7d2c147))
- Upgrade dependencies ([242b61e](https://github.com/kikiutils/node-mongoose/commit/242b61e))
- Switch changelog generation package and remove tslib ([ef4e4d0](https://github.com/kikiutils/node-mongoose/commit/ef4e4d0))
- Remove tslib ([6e35e19](https://github.com/kikiutils/node-mongoose/commit/6e35e19))
- Add release script to package.json ([0fea0dc](https://github.com/kikiutils/node-mongoose/commit/0fea0dc))

### ❤️ Contributors

- kiki-kanri

## v1.4.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.3.1...v1.4.0)

### 🚀 Enhancements

- Add `customMongooseOptions` constant ([6e4dcb3](https://github.com/kikiutils/node-mongoose/commit/6e4dcb3))
- Execute `customMongooseOptions.beforeModelBuild` during model build ([a6819ca](https://github.com/kikiutils/node-mongoose/commit/a6819ca))

### 🏡 Chore

- Upgrade examples dependencies ([1b03baa](https://github.com/kikiutils/node-mongoose/commit/1b03baa))
- Update build process for examples ([b66f554](https://github.com/kikiutils/node-mongoose/commit/b66f554))

### ❤️ Contributors

- kiki-kanri

## v1.3.1

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.3.0...v1.3.1)

### 🩹 Fixes

- Add missing `InstanceMethodsAndOverrides` parameter to `MongooseFindOneReturnType` ([f387156](https://github.com/kikiutils/node-mongoose/commit/f387156))

### 💅 Refactors

- Replace `@ts-ignore` comments with `@ts-expect-error` ([a37542b](https://github.com/kikiutils/node-mongoose/commit/a37542b))

### 🏡 Chore

- Update script ([e9146d9](https://github.com/kikiutils/node-mongoose/commit/e9146d9))
- Add tslib dev dependency ([3f7f0bd](https://github.com/kikiutils/node-mongoose/commit/3f7f0bd))
- Upgrade dependencies ([f135e7f](https://github.com/kikiutils/node-mongoose/commit/f135e7f))
- Update paginate type definition file ([7316908](https://github.com/kikiutils/node-mongoose/commit/7316908))

### ❤️ Contributors

- kiki-kanri

## v1.3.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.2.1...v1.3.0)

### 🚀 Enhancements

- Add ipv4 and ipv6 schemas to `createCommonMongooseSchemas` ([cda5483](https://github.com/kikiutils/node-mongoose/commit/cda5483))

### 🏡 Chore

- Upgrade dependencies ([8e7050c](https://github.com/kikiutils/node-mongoose/commit/8e7050c))

### ❤️ Contributors

- kiki-kanri

## v1.2.1

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.2.0...v1.2.1)

### 🩹 Fixes

- Prevent `createCommonMongooseSchemas` from overwriting non-null/undefined falsy values in options defaults ([0624efb](https://github.com/kikiutils/node-mongoose/commit/0624efb))

### 📖 Documentation

- Update README ([a7aa6c7](https://github.com/kikiutils/node-mongoose/commit/a7aa6c7))

### 🏡 Chore

- Update examples related files ([b30d046](https://github.com/kikiutils/node-mongoose/commit/b30d046))
- Remove rollup files and dependencies and switch to builder build ([363a76f](https://github.com/kikiutils/node-mongoose/commit/363a76f))
- Upgrade dependencies ([03a7935](https://github.com/kikiutils/node-mongoose/commit/03a7935))

### ❤️ Contributors

- kiki-kanri

## v1.2.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.1.0...v1.2.0)

### 🚀 Enhancements

- Add `MongooseConnections` interface ([44a8358](https://github.com/kikiutils/node-mongoose/commit/44a8358))

### 🩹 Fixes

- Correct lodash function import and usage ([3c8f9c3](https://github.com/kikiutils/node-mongoose/commit/3c8f9c3))
- Resolve circular import issue ([a520920](https://github.com/kikiutils/node-mongoose/commit/a520920))

### 📖 Documentation

- Update CHANGELOG ([0faecd9](https://github.com/kikiutils/node-mongoose/commit/0faecd9))

### 🏡 Chore

- Add dev script, add README, and update comments in examples folder ([7743e30](https://github.com/kikiutils/node-mongoose/commit/7743e30))

### ❤️ Contributors

- kiki-kanri

## v1.1.0

> [!IMPORTANT]
> Deprecated.

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.0.5...v1.1.0)

### 💅 Refactors

- Update dependencies and modify build script ([170c966](https://github.com/kikiutils/node-mongoose/commit/170c966))
- Update dependency list and build script for examples ([973ef15](https://github.com/kikiutils/node-mongoose/commit/973ef15))

### 📖 Documentation

- Update README and package.json ([a78c80c](https://github.com/kikiutils/node-mongoose/commit/a78c80c))

### 📦 Build

- Switch to rollup and update related configurations ([5c2e3c5](https://github.com/kikiutils/node-mongoose/commit/5c2e3c5))

### 🏡 Chore

- Update .gitignore ([bf6a68d](https://github.com/kikiutils/node-mongoose/commit/bf6a68d))
- Replace lodash-es with lodash ([d407b71](https://github.com/kikiutils/node-mongoose/commit/d407b71))
- Upgrade dependencies ([9b6858e](https://github.com/kikiutils/node-mongoose/commit/9b6858e))

### ❤️ Contributors

- kiki-kanri

## v1.0.5

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.0.4...v1.0.5)

### 📖 Documentation

- Fix incorrect links in README and add bun installation instructions ([3899267](https://github.com/kikiutils/node-mongoose/commit/3899267))

### 🏡 Chore

- Upgrade dependencies ([8538c26](https://github.com/kikiutils/node-mongoose/commit/8538c26))

### ❤️ Contributors

- kiki-kanri

## v1.0.4

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.0.3...v1.0.4)

### 🩹 Fixes

- Correct incorrect type export method ([9ff7bc0](https://github.com/kikiutils/node-mongoose/commit/9ff7bc0))

### 🏡 Chore

- Upgrade dependencies ([48e0d96](https://github.com/kikiutils/node-mongoose/commit/48e0d96))

### ❤️ Contributors

- kiki-kanri

## v1.0.3

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.0.2...v1.0.3)

### 🩹 Fixes

- Ensure all relevant types are exported ([a03b33f](https://github.com/kikiutils/node-mongoose/commit/a03b33f))

### ❤️ Contributors

- kiki-kanri

## v1.0.2

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.0.1...v1.0.2)

### 💅 Refactors

- Modify type definitions for `mongoose-aggregate-paginate-v2` ([396db5c](https://github.com/kikiutils/node-mongoose/commit/396db5c))

### 🏡 Chore

- Upgrade dependencies ([c05d677](https://github.com/kikiutils/node-mongoose/commit/c05d677))

### ❤️ Contributors

- kiki-kanri

## v1.0.1

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.0.0...v1.0.1)

### 📖 Documentation

- Update README and add description field to package.json ([7a1fe77](https://github.com/kikiutils/node-mongoose/commit/7a1fe77))

### 🏡 Chore

- Upgrade dependencies ([4c6f790](https://github.com/kikiutils/node-mongoose/commit/4c6f790))

### ❤️ Contributors

- kiki-kanri

## v1.0.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.0.0-rc.3...v1.0.0)

### 🚀 Enhancements

- Add example code and related files ([466a95b](https://github.com/kikiutils/node-mongoose/commit/466a95b))

### 📖 Documentation

- Edit readme ([30f3ccc](https://github.com/kikiutils/node-mongoose/commit/30f3ccc))

### ❤️ Contributors

- kiki-kanri

## v1.0.0-rc.3

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.0.0-rc.2...v1.0.0-rc.3)

### 🩹 Fixes

- Modify function definition to resolve issues ([44a5b93](https://github.com/kikiutils/node-mongoose/commit/44a5b93))

### ❤️ Contributors

- kiki-kanri

## v1.0.0-rc.2

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.0.0-rc.1...v1.0.0-rc.2)

### 🩹 Fixes

- Correct keyword list in package.json ([005ab15](https://github.com/kikiutils/node-mongoose/commit/005ab15))

### 💅 Refactors

- Change file location of paginate type definitions ([74d18e4](https://github.com/kikiutils/node-mongoose/commit/74d18e4))

### 📖 Documentation

- Add comments to functions and types ([9439b01](https://github.com/kikiutils/node-mongoose/commit/9439b01))
- Edit readme ([940dc84](https://github.com/kikiutils/node-mongoose/commit/940dc84))
- Update comment for `buildMongooseModel` function ([179da14](https://github.com/kikiutils/node-mongoose/commit/179da14))

### ❤️ Contributors

- kiki-kanri

## v1.0.0-rc.1

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v1.0.0-rc.0...v1.0.0-rc.1)

### 🚀 Enhancements

- Update `AggregatePaginateModel` interface to support `QueryHelpers` and `InstanceMethodsAndOverrides` ([1cc3e99](https://github.com/kikiutils/node-mongoose/commit/1cc3e99))
- Extend `BaseMongoosePaginateModel` to include `AggregatePaginateModel` ([a72e682](https://github.com/kikiutils/node-mongoose/commit/a72e682))

### ❤️ Contributors

- kiki-kanri

## v1.0.0-rc.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v0.6.0...v1.0.0-rc.0)

### 🚀 Enhancements

- Add type definitions for mongoose-aggregate-paginate-v2 ([f0b5db3](https://github.com/kikiutils/node-mongoose/commit/f0b5db3))
- Add mongoose-aggregate-paginate-v2 plugin to mongoose schema ([af4ef3f](https://github.com/kikiutils/node-mongoose/commit/af4ef3f))

### 💅 Refactors

- Replace all mongoose-paginate-v2 types with custom definitions and rename some types ([608fb46](https://github.com/kikiutils/node-mongoose/commit/608fb46))
- Remove explicit undefined from mongoose-paginate-v2 type definitions ([31cebf8](https://github.com/kikiutils/node-mongoose/commit/31cebf8))

### 📖 Documentation

- Add comments to specific types ([faa826c](https://github.com/kikiutils/node-mongoose/commit/faa826c))
- Edit readme ([9ab49eb](https://github.com/kikiutils/node-mongoose/commit/9ab49eb))

### 🏡 Chore

- Upgrade dependencies ([7172259](https://github.com/kikiutils/node-mongoose/commit/7172259))
- Add `mongoose-aggregate-paginate-v2` dependency ([b9c7c55](https://github.com/kikiutils/node-mongoose/commit/b9c7c55))

### ❤️ Contributors

- kiki-kanri

## v0.6.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v0.5.0...v0.6.0)

### 🚀 Enhancements

- Add `mongooseDocumentOrObjectIdToDocument` utils ([555b70e](https://github.com/kikiutils/node-mongoose/commit/555b70e))

### 🏡 Chore

- Copy LICENSE into dist folder during build ([06d4a5e](https://github.com/kikiutils/node-mongoose/commit/06d4a5e))
- Modify keywords field in package.json ([f69c5ad](https://github.com/kikiutils/node-mongoose/commit/f69c5ad))
- Upgrade dependencies ([f7476c9](https://github.com/kikiutils/node-mongoose/commit/f7476c9))

### ❤️ Contributors

- kiki-kanri

## v0.5.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v0.4.1...v0.5.0)

### 💅 Refactors

- ⚠️ Convert paginate plugin to a universally registered plugin ([2d4a7d6](https://github.com/kikiutils/node-mongoose/commit/2d4a7d6))
- ⚠️ Remove beforeBuild attribute from options in buildMongooseModel ([1817898](https://github.com/kikiutils/node-mongoose/commit/1817898))

### 🏡 Chore

- Change declaration method of buildMongooseModel ([3e03996](https://github.com/kikiutils/node-mongoose/commit/3e03996))

#### ⚠️ Breaking Changes

- ⚠️ Convert paginate plugin to a universally registered plugin ([2d4a7d6](https://github.com/kikiutils/node-mongoose/commit/2d4a7d6))
- ⚠️ Remove beforeBuild attribute from options in buildMongooseModel ([1817898](https://github.com/kikiutils/node-mongoose/commit/1817898))

### ❤️ Contributors

- kiki-kanri

## v0.4.1

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v0.4.0...v0.4.1)

### 🩹 Fixes

- Change import method for mongoose functions in utils file to resolve issues ([0bae4b2](https://github.com/kikiutils/node-mongoose/commit/0bae4b2))

### ❤️ Contributors

- kiki-kanri

## v0.4.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v0.3.0...v0.4.0)

### 💅 Refactors

- ⚠️ Modify parameter order and passing method for `setupDecimal128FieldsToStringGetter` utils ([f62d43b](https://github.com/kikiutils/node-mongoose/commit/f62d43b))

#### ⚠️ Breaking Changes

- ⚠️ Modify parameter order and passing method for `setupDecimal128FieldsToStringGetter` utils ([f62d43b](https://github.com/kikiutils/node-mongoose/commit/f62d43b))

### ❤️ Contributors

- kiki-kanri

## v0.3.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v0.2.1...v0.3.0)

### 🚀 Enhancements

- Add global data utils types ([fd75b2c](https://github.com/kikiutils/node-mongoose/commit/fd75b2c))

### 🩹 Fixes

- Correct schema type errors ([229ea2c](https://github.com/kikiutils/node-mongoose/commit/229ea2c))

### 💅 Refactors

- Rename type generic parameter names ([d183367](https://github.com/kikiutils/node-mongoose/commit/d183367))
- Change default connection creation and usage ([50d05b1](https://github.com/kikiutils/node-mongoose/commit/50d05b1))

### ❤️ Contributors

- kiki-kanri

## v0.2.1

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v0.2.0...v0.2.1)

### 💅 Refactors

- Switch package to ESM and set 'type' to 'module' in package.json ([9c50dfd](https://github.com/kikiutils/node-mongoose/commit/9c50dfd))

### ❤️ Contributors

- kiki-kanri

## v0.2.0

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v0.1.1...v0.2.0)

### 🚀 Enhancements

- Add `createMongooseObjectIdRefSchema` utils and related types ([0abd723](https://github.com/kikiutils/node-mongoose/commit/0abd723))

### ❤️ Contributors

- kiki-kanri

## v0.1.1

[compare changes](https://github.com/kikiutils/node-mongoose/compare/v0.1.0...v0.1.1)

### 🩹 Fixes

- Correct type errors in some cases when using `createCommonMongooseSchemas` ([4b1a7d9](https://github.com/kikiutils/node-mongoose/commit/4b1a7d9))

### ❤️ Contributors

- kiki-kanri

## v0.1.0

### 🚀 Enhancements

- Add base files ([ff0f343](https://github.com/kikiutils/node-mongoose/commit/ff0f343))
- Add mongoose dependency ([d9935ea](https://github.com/kikiutils/node-mongoose/commit/d9935ea))
- Add `createMongooseStringSchema` utils and related types ([16ee7d7](https://github.com/kikiutils/node-mongoose/commit/16ee7d7))
- Add lodash dependency ([fa38a77](https://github.com/kikiutils/node-mongoose/commit/fa38a77))
- Add `createCommonMongooseSchemas` utils ([48fa1a8](https://github.com/kikiutils/node-mongoose/commit/48fa1a8))
- Add `commonMongooseSchemas` constant ([b316b9e](https://github.com/kikiutils/node-mongoose/commit/b316b9e))
- Add decimal.js dependency ([a09dfce](https://github.com/kikiutils/node-mongoose/commit/a09dfce))
- Add decimal128 settings to default `commonMongooseSchemas` constant ([a30cdf2](https://github.com/kikiutils/node-mongoose/commit/a30cdf2))
- Add mongoose-paginate-v2 dependency ([2f1c91e](https://github.com/kikiutils/node-mongoose/commit/2f1c91e))
- Add `setupDecimal128FieldsToStringGetter` utils ([83cb5a5](https://github.com/kikiutils/node-mongoose/commit/83cb5a5))
- Add normalize plugin file ([005aca2](https://github.com/kikiutils/node-mongoose/commit/005aca2))
- Add `defaultMongooseConnection` constant ([07a07bc](https://github.com/kikiutils/node-mongoose/commit/07a07bc))
- Add utils types ([1743779](https://github.com/kikiutils/node-mongoose/commit/1743779))
- Add `buildMongooseModel` utils and related types ([295eb0d](https://github.com/kikiutils/node-mongoose/commit/295eb0d))
- Add additional settings to exports field in package.json ([8a3f8b7](https://github.com/kikiutils/node-mongoose/commit/8a3f8b7))

### ❤️ Contributors

- kiki-kanri
