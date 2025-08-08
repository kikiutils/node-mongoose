<!-- TODO: Update -->

# @kikiutils/mongoose

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

A Mongoose plugin for enhanced JSON normalization and common schema creation, with built-in support for pagination and automatic Decimal128 conversion.

- [✨ Release Notes](./CHANGELOG.md)

## Features

- ✨ Flexible Connections: Supports both default and custom connections, automatically creating connections when none are provided
- 🔌 Plugin Integration: Automatically integrates `mongoose-aggregate-paginate-v2`, `mongoose-paginate-v2`, and custom normalization for cleaner JSON outputs
- 🛠 Predefined & Customizable Schemas: Provides common schemas (boolean, date, decimal128, number, objectId, string) with the flexibility to customize attributes such as `private`, `required`, `unique`, `default`, and more
- 🧮 Decimal Precision: Supports `Decimal128` fields with options for automatic rounding and fixed decimal precision
- 🔄 Optimized JSON Output: Adds an `id` field, removes `_id` and `__v`, hides private fields, and converts `Decimal128` fields to strings in JSON responses
- 🔄 Reference Management: Enables easy conversion of ObjectId references to fully populated documents with field selection and population options
- 🔧 Utility Functions: Includes helper functions for converting and normalizing documents, handling ObjectId transformations, and processing schema fields

## Requirements

- **Mongoose** `>= 8`
- **Node.js** `>= 20.0.0`

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
