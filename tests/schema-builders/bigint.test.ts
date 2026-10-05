import {
    deleteModel,
    model,
    Schema,
} from 'mongoose';
import {
    afterEach,
    describe,
    expectTypeOf,
    it,
} from 'vitest';

import {
    bigint,
    bigintSchemaBuilder,
} from '../../src/schema-builders';

// Checked by the project's TypeScript validation, not executed at runtime.
function checkBuilderTypes() {
    // @ts-expect-error Enum values must match the supported numeric type.
    bigint().enum([1]);
    // @ts-expect-error Enum values must match the supported value type.
    bigint().enum(['invalid']);
    // @ts-expect-error Enum configuration must match the supported value type.
    bigint().enum({ values: ['invalid'] });
    // @ts-expect-error Enum record values must match the supported value type.
    bigint().enum({ invalid: 'invalid' });
    // @ts-expect-error Enum can only be configured once.
    bigint().enum([9007199254740993n]).enum([9007199254740994n]);
    // @ts-expect-error Limits must match the supported bound type.
    bigint().min(1);
    const invalidLimit = [
        1,
        'invalid',
    ] as const;

    // @ts-expect-error Limit tuples must use the supported bound type.
    bigint().max(invalidLimit);
    // @ts-expect-error Defaults must match the SchemaType's value type.
    bigint().default(42);
    // @ts-expect-error Default callbacks must return the SchemaType's value type.
    bigint().default(() => 42);
    // @ts-expect-error Strings are not the SchemaType's value type.
    bigint().default('42');
}

void checkBuilderTypes;

describe('bigintSchemaBuilder', () => {
    afterEach(() => deleteModel(/^BuilderBigInt/));

    describe('schema definitions', () => {
        it('should expose the alias and required or optional schema definitions', ({ expect }) => {
            expect(bigint).toBe(bigintSchemaBuilder);
            expect(bigint().nonRequired).toEqual({ type: Schema.Types.BigInt });
            expect(bigint().required).toEqual({
                required: true,
                type: Schema.Types.BigInt,
            });
        });

        it('should preserve defaults and common chained options', ({ expect }) => {
            const value = 42n;
            const definition = bigint().default(value).immutable.index(1).private.sparse.unique.required;

            expect(definition).toEqual({
                default: value,
                immutable: true,
                index: 1,
                private: true,
                required: true,
                sparse: true,
                type: Schema.Types.BigInt,
                unique: true,
            });

            expectTypeOf(definition.default).toExtend<bigint>();
            expectTypeOf(definition.type).toEqualTypeOf<typeof Schema.Types.BigInt>();
        });
    });

    describe('defaults and casting', () => {
        it('should apply literal and function defaults in Mongoose', async ({ expect }) => {
            const value = 42n;
            const TestModel = model(
                'BuilderBigIntDefaults',
                new Schema({
                    callback: bigint().default(() => value).required,
                    literal: bigint().default(value).required,
                }),
            );

            const doc = new TestModel();

            expect(doc.literal).toBe(value);
            expect(doc.callback).toBe(value);
            await expect(doc.validate()).resolves.toBeUndefined();
        });

        it('should support nullish defaults and callback return values', async ({ expect }) => {
            const TestModel = model(
                'BuilderBigIntNullishDefaults',
                new Schema({
                    callbackNull: bigint().default(() => null).nonRequired,
                    callbackUndefined: bigint().default(() => undefined).nonRequired,
                    literalNull: bigint().default(null).nonRequired,
                    literalUndefined: bigint().default(undefined).nonRequired,
                }),
            );

            const doc = new TestModel();

            expect(doc.callbackNull).toBeNull();
            expect(doc.callbackUndefined).toBeUndefined();
            expect(doc.literalNull).toBeNull();
            expect(doc.literalUndefined).toBeUndefined();
            await expect(doc.validate()).resolves.toBeUndefined();
        });

        it.for([
            -9223372036854775808n,
            9223372036854775807n,
        ])(
            'should preserve a representable BigInt value of %s',
            async (value, { expect }) => {
                const TestModel = model(
                    'BuilderBigIntCasting',
                    new Schema<{ value: bigint }>({ value: bigint().required }),
                );

                const doc = new TestModel({ value });

                expect(doc.value).toBe(value);
                await expect(doc.validate()).resolves.toBeUndefined();
            },
        );

        it.for([
            -9223372036854775809n,
            9223372036854775808n,
        ])(
            'should reject an unrepresentable BigInt value of %s',
            async (value, { expect }) => {
                const TestModel = model(
                    'BuilderBigIntCasting',
                    new Schema<{ value: bigint }>({ value: bigint().required }),
                );

                await expect(new TestModel({ value }).validate())
                    .rejects
                    .toMatchObject({ errors: { value: { name: 'CastError' } } });
            },
        );
    });

    describe('enum validation', () => {
        it('should accept arrays, records and custom-message configurations', async ({ expect }) => {
            const values = [
                9007199254740993n,
                9007199254740995n,
                null,
            ] as const;

            const definitions = [
                bigint().enum(values).nonRequired,
                bigint()
                    .enum({
                        first: 9007199254740993n,
                        last: 9007199254740995n,
                    })
                    .nonRequired,
                bigint()
                    .enum({
                        message: 'not allowed',
                        values,
                    })
                    .nonRequired,
            ];

            for (const [index, definition] of definitions.entries()) {
                const TestModel = model(`BuilderBigIntEnum${index}`, new Schema({ value: definition }));

                for (const value of [
                    9007199254740993n,
                    9007199254740995n,
                    null,
                    undefined,
                ]) await expect(new TestModel({ value }).validate()).resolves.toBeUndefined();

                await expect(new TestModel({ value: 9007199254740994n }).validate()).rejects.toMatchObject({
                    errors: {
                        value: {
                            kind: 'enum',
                            message: index === 2
                                ? 'not allowed'
                                : 'Path `value` (9007199254740994) is not a valid enum value.',
                        },
                    },
                });
            }

            expectTypeOf(bigint().enum(values)).not.toHaveProperty('enum');
        });

        it('should coexist with range, default and required validation in either order', async ({ expect }) => {
            const values = [
                9007199254740993n,
                9007199254740995n,
            ] as const;

            const definitions = [
                bigint().enum(values).min(9007199254740994n).max(9007199254740995n).default(9007199254740995n).required,
                bigint().min(9007199254740994n).max(9007199254740995n).enum(values).required,
            ];

            for (const [index, definition] of definitions.entries()) {
                const TestModel = model(`BuilderBigIntEnumRange${index}`, new Schema({ value: definition }));

                expect(definition.validate.map((validator) => validator.type).sort()).toEqual([
                    'enum',
                    'max',
                    'min',
                ]);

                await expect(new TestModel({ value: 9007199254740995n }).validate()).resolves.toBeUndefined();
                await expect(new TestModel({ value: 9007199254740993n }).validate())
                    .rejects
                    .toMatchObject({ errors: { value: { kind: 'min' } } });

                await expect(new TestModel({ value: 9007199254740994n }).validate())
                    .rejects
                    .toMatchObject({ errors: { value: { kind: 'enum' } } });

                await expect(new TestModel({ value: null }).validate())
                    .rejects
                    .toMatchObject({ errors: { value: { kind: 'required' } } });
            }
        });

        it('should reject duplicate enum configuration at runtime', ({ expect }) => {
            const builder = bigint();
            builder.enum([9007199254740993n]);

            expect(() => builder.enum([9007199254740995n])).toThrow('Duplicate schema attribute: enum');
        });
    });

    describe('range validation', () => {
        it('should apply a default configured between range limits', async ({ expect }) => {
            const definition = bigint()
                .min(9007199254740993n)
                .default(9007199254740994n)
                .max(9007199254740995n)
                .required;

            const TestModel = model('BuilderBigIntDefaultLimits', new Schema<{ value: bigint }>({ value: definition }));
            const doc = new TestModel();

            expect(doc.value).toBe(9007199254740994n);
            await expect(doc.validate()).resolves.toBeUndefined();
        });

        it.for([
            9007199254740993n,
            9007199254740994n,
            9007199254740995n,
        ])(
            'should accept %s within inclusive limits',
            async (value, { expect }) => {
                const definition = bigint().min(9007199254740993n).max(9007199254740995n).required;
                const TestModel = model('BuilderBigIntLimits', new Schema<{ value: bigint }>({ value: definition }));

                await expect(new TestModel({ value }).validate()).resolves.toBeUndefined();
            },
        );

        it.for([
            {
                kind: 'min',
                message: 'too low',
                name: 'minimum',
                value: 9007199254740992n,
            },
            {
                kind: 'max',
                message: 'too high',
                name: 'maximum',
                value: 9007199254740996n,
            },
        ])(
            'should preserve the custom $name message when maximum is configured first',
            async (
                {
                    kind,
                    message,
                    value,
                },
                { expect },
            ) => {
                const definition = bigint()
                    .max([
                        9007199254740995n,
                        'too high',
                    ] as const)
                    .min([
                        9007199254740993n,
                        'too low',
                    ] as const)
                    .nonRequired;

                const TestModel = model(
                    'BuilderBigIntLimitMessages',
                    new Schema<{ value: bigint }>({ value: definition }),
                );

                await expect(new TestModel({ value }).validate()).rejects.toMatchObject({
                    errors: {
                        value: {
                            kind,
                            message,
                        },
                    },
                });
            },
        );

        it('should replace repeated runtime limits without dropping the opposite limit', ({ expect }) => {
            const builder = bigint();
            builder.min(9007199254740993n).max(9007199254740995n);
            const definition = builder
                .min([
                    9007199254740994n,
                    'updated min',
                ])
                .nonRequired;

            expect(definition.validate).toHaveLength(2);
            expect(definition.validate.map((validator) => validator.type)).toEqual([
                'max',
                'min',
            ]);

            expect(definition.validate[1]).toMatchObject({
                message: 'updated min',
                min: 9007199254740994n,
            });
        });

        it.for([
            undefined,
            null,
        ])(
            'should skip optional range validation for %s',
            async (value, { expect }) => {
                const definition = bigint().min(9007199254740993n).max(9007199254740995n).nonRequired;
                const TestModel = model(
                    'BuilderBigIntOptionalLimits',
                    new Schema<{ value: bigint }>({ value: definition }),
                );

                for (const validator of definition.validate) expect(validator.validator(value)).toBe(true);
                await expect(new TestModel({ value }).validate()).resolves.toBeUndefined();
            },
        );

        it('should retain required validation on a range-constrained path', async ({ expect }) => {
            const definition = bigint().min(9007199254740993n).max(9007199254740995n).required;
            const TestModel = model(
                'BuilderBigIntRequiredLimits',
                new Schema<{ value: bigint }>({ value: definition }),
            );

            await expect(new TestModel().validate()).rejects.toMatchObject({ errors: { value: { kind: 'required' } } });
        });

        it.for([
            {
                kind: 'min',
                message: 'Path `value` (9007199254740992) is less than minimum allowed value (9007199254740993).',
                name: 'minimum',
                value: 9007199254740992n,
            },
            {
                kind: 'max',
                message: 'Path `value` (9007199254740996) is more than maximum allowed value (9007199254740995).',
                name: 'maximum',
                value: 9007199254740996n,
            },
        ])(
            'should reject values outside the $name with the default message',
            async (
                {
                    kind,
                    message,
                    value,
                },
                { expect },
            ) => {
                const definition = bigint().min(9007199254740993n).max(9007199254740995n).required;
                const TestModel = model('BuilderBigIntLimits', new Schema<{ value: bigint }>({ value: definition }));

                await expect(new TestModel({ value }).validate()).rejects.toMatchObject({
                    errors: {
                        value: {
                            kind,
                            message,
                        },
                    },
                });
            },
        );
    });

    describe('builder types', () => {
        it('should expose custom limits and omit already configured methods', () => {
            const builder = bigint();

            expectTypeOf<typeof builder>().toHaveProperty('min');
            expectTypeOf<typeof builder>().toHaveProperty('max');
            expectTypeOf<typeof builder>().toHaveProperty('enum');

            const withDefault = builder.default(42n);

            expectTypeOf(withDefault).not.toHaveProperty('default');
        });

        it('should omit configured limit methods while keeping the other options', () => {
            const withMin = bigint().min(9007199254740993n);

            expectTypeOf(withMin).not.toHaveProperty('min');
            expectTypeOf(withMin).toHaveProperty('max');

            const withMax = withMin.max(9007199254740995n);

            expectTypeOf(withMax).not.toHaveProperty('min');
            expectTypeOf(withMax).not.toHaveProperty('max');
            expectTypeOf(withMax).toHaveProperty('default');
            expectTypeOf(withMax.nonRequired.validate).toBeArray();
        });
    });
});
