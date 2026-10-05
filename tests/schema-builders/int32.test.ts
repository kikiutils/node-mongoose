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
    int32,
    int32SchemaBuilder,
} from '../../src/schema-builders';

// Checked by the project's TypeScript validation, not executed at runtime.
function checkBuilderTypes() {
    // @ts-expect-error Enum values must match the supported numeric type.
    int32().enum([1n]);
    // @ts-expect-error Enum values must match the supported value type.
    int32().enum(['invalid']);
    // @ts-expect-error Enum configuration must match the supported value type.
    int32().enum({ values: ['invalid'] });
    // @ts-expect-error Enum record values must match the supported value type.
    int32().enum({ invalid: 'invalid' });
    // @ts-expect-error Enum can only be configured once.
    int32().enum([1]).enum([2]);
    // @ts-expect-error Limits must match the supported bound type.
    int32().min(1n);
    const invalidLimit = [
        1n,
        'invalid',
    ] as const;

    // @ts-expect-error Limit tuples must use the supported bound type.
    int32().max(invalidLimit);
    // @ts-expect-error Defaults must match the SchemaType's value type.
    int32().default(42n);
    // @ts-expect-error Default callbacks must return the SchemaType's value type.
    int32().default(() => 42n);
    // @ts-expect-error Strings are not the SchemaType's value type.
    int32().default('42');
}

void checkBuilderTypes;

describe('int32SchemaBuilder', () => {
    afterEach(() => deleteModel(/^BuilderInt32/));

    describe('schema definitions', () => {
        it('should expose the alias and required or optional schema definitions', ({ expect }) => {
            expect(int32).toBe(int32SchemaBuilder);
            expect(int32().nonRequired).toEqual({ type: Schema.Types.Int32 });
            expect(int32().required).toEqual({
                required: true,
                type: Schema.Types.Int32,
            });
        });

        it('should preserve defaults and common chained options', ({ expect }) => {
            const value = 42;
            const definition = int32().default(value).immutable.index(1).private.sparse.unique.required;

            expect(definition).toEqual({
                default: value,
                immutable: true,
                index: 1,
                private: true,
                required: true,
                sparse: true,
                type: Schema.Types.Int32,
                unique: true,
            });

            expectTypeOf(definition.default).toExtend<number>();
            expectTypeOf(definition.type).toEqualTypeOf<typeof Schema.Types.Int32>();
        });
    });

    describe('defaults and casting', () => {
        it('should apply literal and function defaults in Mongoose', async ({ expect }) => {
            const value = 42;
            const TestModel = model(
                'BuilderInt32Defaults',
                new Schema({
                    callback: int32().default(() => value).required,
                    literal: int32().default(value).required,
                }),
            );

            const doc = new TestModel();

            expect(doc.literal).toBe(value);
            expect(doc.callback).toBe(value);
            await expect(doc.validate()).resolves.toBeUndefined();
        });

        it('should support nullish defaults and callback return values', async ({ expect }) => {
            const TestModel = model(
                'BuilderInt32NullishDefaults',
                new Schema({
                    callbackNull: int32().default(() => null).nonRequired,
                    callbackUndefined: int32().default(() => undefined).nonRequired,
                    literalNull: int32().default(null).nonRequired,
                    literalUndefined: int32().default(undefined).nonRequired,
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
            -2147483648,
            2147483647,
        ])(
            'should preserve a representable Int32 value of %s',
            async (value, { expect }) => {
                const TestModel = model(
                    'BuilderInt32Casting',
                    new Schema({ value: int32().required }),
                );

                const doc = new TestModel({ value });

                expect(doc.value).toBe(value);
                await expect(doc.validate()).resolves.toBeUndefined();
            },
        );

        it.for([
            -2147483649,
            2147483648,
            1.5,
        ])(
            'should reject an unrepresentable Int32 value of %s',
            async (value, { expect }) => {
                const TestModel = model(
                    'BuilderInt32Casting',
                    new Schema({ value: int32().required }),
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
                1,
                3,
                null,
            ] as const;

            const definitions = [
                int32().enum(values).nonRequired,
                int32()
                    .enum({
                        first: 1,
                        last: 3,
                    })
                    .nonRequired,
                int32()
                    .enum({
                        message: 'not allowed',
                        values,
                    })
                    .nonRequired,
            ];

            for (const [index, definition] of definitions.entries()) {
                const TestModel = model(`BuilderInt32Enum${index}`, new Schema({ value: definition }));

                for (const value of [
                    1,
                    3,
                    null,
                    undefined,
                ]) await expect(new TestModel({ value }).validate()).resolves.toBeUndefined();

                await expect(new TestModel({ value: 2 }).validate()).rejects.toMatchObject({
                    errors: {
                        value: {
                            kind: 'enum',
                            message: index === 2
                                ? 'not allowed'
                                : 'Path `value` (2) is not a valid enum value.',
                        },
                    },
                });
            }

            expectTypeOf(int32().enum(values)).not.toHaveProperty('enum');
        });

        it('should coexist with range, default and required validation in either order', async ({ expect }) => {
            const values = [
                1,
                3,
            ] as const;

            const definitions = [
                int32().enum(values).min(2).max(3).default(3).required,
                int32().min(2).max(3).enum(values).required,
            ];

            for (const [index, definition] of definitions.entries()) {
                const TestModel = model(`BuilderInt32EnumRange${index}`, new Schema({ value: definition }));

                expect(definition.validate.map((validator) => validator.type).sort()).toEqual([
                    'enum',
                    'max',
                    'min',
                ]);

                await expect(new TestModel({ value: 3 }).validate()).resolves.toBeUndefined();
                await expect(new TestModel({ value: 1 }).validate())
                    .rejects
                    .toMatchObject({ errors: { value: { kind: 'min' } } });

                await expect(new TestModel({ value: 2 }).validate())
                    .rejects
                    .toMatchObject({ errors: { value: { kind: 'enum' } } });

                await expect(new TestModel({ value: null }).validate())
                    .rejects
                    .toMatchObject({ errors: { value: { kind: 'required' } } });
            }
        });

        it('should reject duplicate enum configuration at runtime', ({ expect }) => {
            const builder = int32();
            builder.enum([1]);

            expect(() => builder.enum([3])).toThrow('Duplicate schema attribute: enum');
        });
    });

    describe('range validation', () => {
        it('should apply a default configured between range limits', async ({ expect }) => {
            const definition = int32().min(1).default(2).max(3).required;
            const TestModel = model('BuilderInt32DefaultLimits', new Schema({ value: definition }));
            const doc = new TestModel();

            expect(doc.value).toBe(2);
            await expect(doc.validate()).resolves.toBeUndefined();
        });

        it.for([
            1,
            2,
            3,
        ])(
            'should accept %s within inclusive limits',
            async (value, { expect }) => {
                const definition = int32().min(1).max(3).required;
                const TestModel = model('BuilderInt32Limits', new Schema({ value: definition }));

                await expect(new TestModel({ value }).validate()).resolves.toBeUndefined();
            },
        );

        it.for([
            {
                kind: 'min',
                message: 'too low',
                name: 'minimum',
                value: 0,
            },
            {
                kind: 'max',
                message: 'too high',
                name: 'maximum',
                value: 4,
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
                const definition = int32()
                    .max([
                        3,
                        'too high',
                    ] as const)
                    .min([
                        1,
                        'too low',
                    ] as const)
                    .nonRequired;

                const TestModel = model(
                    'BuilderInt32LimitMessages',
                    new Schema({ value: definition }),
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
            const builder = int32();
            builder.min(1).max(3);
            const definition = builder
                .min([
                    2,
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
                min: 2,
            });
        });

        it.for([
            undefined,
            null,
        ])(
            'should skip optional range validation for %s',
            async (value, { expect }) => {
                const definition = int32().min(1).max(3).nonRequired;
                const TestModel = model(
                    'BuilderInt32OptionalLimits',
                    new Schema({ value: definition }),
                );

                for (const validator of definition.validate)expect(validator.validator(value)).toBe(true);
                await expect(new TestModel({ value }).validate()).resolves.toBeUndefined();
            },
        );

        it('should retain required validation on a range-constrained path', async ({ expect }) => {
            const definition = int32().min(1).max(3).required;
            const TestModel = model('BuilderInt32RequiredLimits', new Schema({ value: definition }));

            await expect(new TestModel().validate()).rejects.toMatchObject({ errors: { value: { kind: 'required' } } });
        });

        it.for([
            {
                kind: 'min',
                message: 'Path `value` (0) is less than minimum allowed value (1).',
                name: 'minimum',
                value: 0,
            },
            {
                kind: 'max',
                message: 'Path `value` (4) is more than maximum allowed value (3).',
                name: 'maximum',
                value: 4,
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
                const definition = int32().min(1).max(3).required;
                const TestModel = model('BuilderInt32Limits', new Schema({ value: definition }));

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

        it.for([
            {
                name: 'NaN',
                value: Number.NaN,
            },
            {
                name: 'positive infinity',
                value: Number.POSITIVE_INFINITY,
            },
            {
                name: 'negative infinity',
                value: Number.NEGATIVE_INFINITY,
            },
        ])(
            'should reject $name as a range limit',
            ({ value }, { expect }) => {
                expect(() => int32().min(value)).toThrow(RangeError);
                expect(
                    () => int32().max([
                        value,
                        'invalid',
                    ]),
                ).toThrow(RangeError);
            },
        );
    });

    describe('builder types', () => {
        it('should expose custom limits and omit already configured methods', () => {
            const builder = int32();

            expectTypeOf<typeof builder>().toHaveProperty('min');
            expectTypeOf<typeof builder>().toHaveProperty('max');
            expectTypeOf<typeof builder>().toHaveProperty('enum');

            const withDefault = builder.default(42);

            expectTypeOf(withDefault).not.toHaveProperty('default');
        });

        it('should omit configured limit methods while keeping the other options', () => {
            const withMin = int32().min(1);

            expectTypeOf(withMin).not.toHaveProperty('min');
            expectTypeOf(withMin).toHaveProperty('max');

            const withMax = withMin.max(3);

            expectTypeOf(withMax).not.toHaveProperty('min');
            expectTypeOf(withMax).not.toHaveProperty('max');
            expectTypeOf(withMax).toHaveProperty('default');
            expectTypeOf(withMax.nonRequired.validate).toBeArray();
        });
    });
});
