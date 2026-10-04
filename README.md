<!-- TODO: Update -->

# @kikiutils/mongoose

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

Provides Mongoose schema builders and utilities for connections, pagination, JSON normalization, and update checks.

- [✨ Release Notes](./CHANGELOG.md)

## Features

- ✨ Supports custom connections and reuses an automatically created default connection with configurable creation options.
- 🔌 Registers `mongoose-aggregate-paginate-v2`, `mongoose-paginate-v2`, and update-result assertion plugins, with optional recursive JSON normalization.
- 🛠 Provides chainable schema builders for `bigint`, `boolean`, `date`, `decimal128`, `double`, `int32`, `mixed`, `number`, `objectId`, `ref`, `string`, and `uuid`, with field options tailored to each schema type.
- 🧮 Provides `Decimal128` rounding, fixed-decimal formatting, string getters, and inclusive range validation.
- 🔄 Normalizes JSON output by default: adds `id`, removes `_id`, `__v`, and private fields, and serializes `Decimal128` values as strings.
- 🔗 Defines ObjectId reference fields using model names, model constructors, or callbacks.
- 🔧 Checks update acknowledgment and a minimum modified-document count through function, model, and document APIs.

## Requirements

- **Mongoose** `>=9`
- **Node.js** `>=22.12.0`

## Installation

Using [pnpm](https://pnpm.io):

```bash
pnpm add @kikiutils/mongoose mongoose
```

You can also use `yarn`, `npm`, or `bun`.

## Usage

<!-- TODO: Full doc. -->
To be completed.

## License

[MIT License](./LICENSE)

<!-- Badges -->
[npm-version-href]: https://npmjs.com/package/@kikiutils/mongoose
[npm-version-src]: https://img.shields.io/npm/v/@kikiutils/mongoose/latest.svg?colorA=18181b&colorB=28cf8d&style=flat

[npm-downloads-href]: https://npmjs.com/package/@kikiutils/mongoose
[npm-downloads-src]: https://img.shields.io/npm/dm/@kikiutils/mongoose.svg?colorA=18181b&colorB=28cf8d&style=flat

[codecov-href]: https://codecov.io/gh/kikiutils/node-mongoose
[codecov-src]: https://codecov.io/gh/kikiutils/node-mongoose/graph/badge.svg?token=DM89MM6FPK

[license-href]: https://github.com/kikiutils/node-mongoose/blob/main/LICENSE
[license-src]: https://img.shields.io/github/license/kikiutils/node-mongoose?colorA=18181b&colorB=28cf8d&style=flat
