import {
    deleteModel,
    model,
    Schema,
    Types,
} from 'mongoose';
import {
    afterEach,
    describe,
    expectTypeOf,
    it,
} from 'vitest';

import {
    double,
    doubleSchemaBuilder,
} from '../../src/schema-builders';

// Checked by the project's TypeScript validation, not executed at runtime.
function checkBuilderTypes() {
    // @ts-expect-error Limits must match the supported bound type.
    double().min(1n);
    const invalidLimit = [
        1n,
        'invalid',
    ] as const;

    // @ts-expect-error Limit tuples must use the supported bound type.
    double().max(invalidLimit);
    // @ts-expect-error Defaults must match the SchemaType's value type.
    double().default(42);
    // @ts-expect-error Default callbacks must return the SchemaType's value type.
    double().default(() => 42);
    // @ts-expect-error Strings are not the SchemaType's value type.
    double().default('42');
}

void checkBuilderTypes;

describe('doubleSchemaBuilder', () => {
    afterEach(() => deleteModel(/^BuilderDouble/));

    describe('schema definitions', () => {
        it('should expose the alias and required or optional schema definitions', ({ expect }) => {
            expect(double).toBe(doubleSchemaBuilder);
            expect(double().nonRequired).toEqual({ type: Schema.Types.Double });
            expect(double().required).toEqual({
                required: true,
                type: Schema.Types.Double,
            });
        });

        it('should preserve defaults and common chained options', ({ expect }) => {
            const value = new Types.Double(4.2);
            const definition = double().default(value).immutable.index(1).private.sparse.unique.required;

            expect(definition).toEqual({
                default: value,
                immutable: true,
                index: 1,
                private: true,
                required: true,
                sparse: true,
                type: Schema.Types.Double,
                unique: true,
            });

            expectTypeOf(definition.default).toExtend<Types.Double>();
            expectTypeOf(definition.type).toEqualTypeOf<typeof Schema.Types.Double>();
        });
    });

    describe('defaults and casting', () => {
        it('should apply literal and function defaults in Mongoose', async ({ expect }) => {
            const value = new Types.Double(4.2);
            const TestModel = model(
                'BuilderDoubleDefaults',
                new Schema({
                    callback: double().default(() => value).required,
                    literal: double().default(value).required,
                }),
            );

            const doc = new TestModel();

            expect(doc.literal).toEqual(value);
            expect(doc.callback).toEqual(value);
            await expect(doc.validate()).resolves.toBeUndefined();
        });

        it('should support nullish defaults and callback return values', async ({ expect }) => {
            const TestModel = model(
                'BuilderDoubleNullishDefaults',
                new Schema({
                    callbackNull: double().default(() => null).nonRequired,
                    callbackUndefined: double().default(() => undefined).nonRequired,
                    literalNull: double().default(null).nonRequired,
                    literalUndefined: double().default(undefined).nonRequired,
                }),
            );

            const doc = new TestModel();

            expect(doc.callbackNull).toBeNull();
            expect(doc.callbackUndefined).toBeUndefined();
            expect(doc.literalNull).toBeNull();
            expect(doc.literalUndefined).toBeUndefined();
            await expect(doc.validate()).resolves.toBeUndefined();
        });

        it('should cast numeric document input to BSON Double', async ({ expect }) => {
            const schema = new Schema<{ value: Types.Double }>({ value: double().required });
            const TestModel = model('BuilderDoubleCasting', schema);
            const doc = new TestModel({ value: 4.2 });

            expect(doc.value).toBeInstanceOf(Types.Double);

            if (!(doc.value instanceof Types.Double)) throw new TypeError('Expected BSON Double');

            expect(doc.value.valueOf()).toBe(4.2);
            await expect(doc.validate()).resolves.toBeUndefined();
        });
    });

    describe('range validation', () => {
        it('should apply a default configured between range limits', async ({ expect }) => {
            const definition = double().min(1.5).default(new Types.Double(2.5)).max(3.5).required;
            const TestModel = model(
                'BuilderDoubleDefaultLimits',
                new Schema<{ value: Types.Double }>({ value: definition }),
            );

            const doc = new TestModel();

            expect(doc.value.valueOf()).toBe(2.5);
            await expect(doc.validate()).resolves.toBeUndefined();
        });

        it.for([
            1.5,
            2.5,
            3.5,
        ])(
            'should accept %s within inclusive limits',
            async (value, { expect }) => {
                const definition = double().min(1.5).max(3.5).required;
                const TestModel = model(
                    'BuilderDoubleLimits',
                    new Schema<{ value: Types.Double }>({ value: definition }),
                );

                await expect(new TestModel({ value }).validate()).resolves.toBeUndefined();
            },
        );

        it('should apply BSON Double bounds and preserve a custom maximum message', async ({ expect }) => {
            const definition = double()
                .min(new Types.Double(1.5))
                .max([
                    new Types.Double(3.5),
                    'too high',
                ])
                .required;

            const TestModel = model(
                'BuilderDoubleBsonLimits',
                new Schema<{ value: Types.Double }>({ value: definition }),
            );

            await expect(new TestModel({ value: new Types.Double(2.5) }).validate()).resolves.toBeUndefined();
            await expect(new TestModel({ value: new Types.Double(4) }).validate()).rejects.toMatchObject({
                errors: {
                    value: {
                        kind: 'max',
                        message: 'too high',
                    },
                },
            });
        });

        it.for([
            {
                kind: 'min',
                message: 'too low',
                name: 'minimum',
                value: 1.4,
            },
            {
                kind: 'max',
                message: 'too high',
                name: 'maximum',
                value: 3.6,
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
                const definition = double()
                    .max([
                        3.5,
                        'too high',
                    ] as const)
                    .min([
                        1.5,
                        'too low',
                    ] as const)
                    .nonRequired;

                const TestModel = model(
                    'BuilderDoubleLimitMessages',
                    new Schema<{ value: Types.Double }>({ value: definition }),
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
            const builder = double();
            builder.min(1.5).max(3.5);
            const definition = builder
                .min([
                    2.5,
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
                min: 2.5,
            });
        });

        it.for([
            undefined,
            null,
        ])(
            'should skip optional range validation for %s',
            async (value, { expect }) => {
                const definition = double().min(1.5).max(3.5).nonRequired;
                const TestModel = model(
                    'BuilderDoubleOptionalLimits',
                    new Schema<{ value: Types.Double }>({ value: definition }),
                );

                for (const validator of definition.validate) expect(validator.validator(value)).toBe(true);
                await expect(new TestModel({ value }).validate()).resolves.toBeUndefined();
            },
        );

        it('should retain required validation on a range-constrained path', async ({ expect }) => {
            const definition = double().min(1.5).max(3.5).required;
            const TestModel = model(
                'BuilderDoubleRequiredLimits',
                new Schema<{ value: Types.Double }>({ value: definition }),
            );

            await expect(new TestModel().validate()).rejects.toMatchObject({ errors: { value: { kind: 'required' } } });
        });

        it.for([
            {
                kind: 'min',
                message: 'Path `value` (1.4) is less than minimum allowed value (1.5).',
                name: 'minimum',
                value: 1.4,
            },
            {
                kind: 'max',
                message: 'Path `value` (3.6) is more than maximum allowed value (3.5).',
                name: 'maximum',
                value: 3.6,
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
                const definition = double().min(1.5).max(3.5).required;
                const TestModel = model(
                    'BuilderDoubleLimits',
                    new Schema<{ value: Types.Double }>({ value: definition }),
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

        it('should reject NaN document values during range validation', async ({ expect }) => {
            const definition = double().min(1.5).max(3.5).required;
            const TestModel = model('BuilderDoubleNaN', new Schema<{ value: Types.Double }>({ value: definition }));

            await expect(new TestModel({ value: Number.NaN }).validate())
                .rejects
                .toMatchObject({ errors: { value: { kind: 'min' } } });
        });

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
                expect(() => double().min(value)).toThrow(RangeError);
                expect(
                    () => double().max([
                        value,
                        'invalid',
                    ]),
                ).toThrow(RangeError);
            },
        );

        it('should reject non-finite BSON Double bounds', ({ expect }) => {
            expect(() => double().min(new Types.Double(Number.NaN))).toThrow(RangeError);
            expect(() => double().max(new Types.Double(Number.POSITIVE_INFINITY))).toThrow(RangeError);
        });
    });

    describe('builder types', () => {
        it('should expose custom limits and omit already configured methods', () => {
            const builder = double();

            expectTypeOf<typeof builder>().toHaveProperty('min');
            expectTypeOf<typeof builder>().toHaveProperty('max');
            expectTypeOf<typeof builder>().not.toHaveProperty('enum');

            const withDefault = builder.default(new Types.Double(4.2));

            expectTypeOf(withDefault).not.toHaveProperty('default');
        });

        it('should omit configured limit methods while keeping the other options', () => {
            const withMin = double().min(1.5);

            expectTypeOf(withMin).not.toHaveProperty('min');
            expectTypeOf(withMin).toHaveProperty('max');

            const withMax = withMin.max(3.5);

            expectTypeOf(withMax).not.toHaveProperty('min');
            expectTypeOf(withMax).not.toHaveProperty('max');
            expectTypeOf(withMax).toHaveProperty('default');
            expectTypeOf(withMax.nonRequired.validate).toBeArray();
        });
    });
});
