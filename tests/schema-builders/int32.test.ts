import {
    model,
    Schema,
} from 'mongoose';
import {
    describe,
    expectTypeOf,
    it,
} from 'vitest';

import {
    int32,
    int32SchemaBuilder,
} from '../../src/schema-builders';

describe.concurrent('int32SchemaBuilder', () => {
    it('should export an alias and use the correct SchemaType', ({ expect }) => {
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
        expect(doc.literal).toEqual(value);
        expect(doc.callback).toEqual(value);
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

    it('should defer integer and range validation to Mongoose', async ({ expect }) => {
        const TestModel = model('BuilderInt32Casting', new Schema({ value: int32().required }));
        for (
            const value of [
                -2147483648,
                2147483647,
            ]
        ) await expect(new TestModel({ value }).validate()).resolves.toBeUndefined();

        for (
            const value of [
                -2147483649,
                2147483648,
                1.5,
            ]
        ) {
            const doc = new TestModel({ value });
            await expect(doc.validate()).rejects.toMatchObject({ errors: { value: { name: 'CastError' } } });
        }
    });

    it('should require a value for required paths', async ({ expect }) => {
        const TestModel = model('BuilderInt32Required', new Schema({ value: int32().required }));
        await expect(new TestModel().validate()).rejects.toMatchObject({ errors: { value: { kind: 'required' } } });
    });

    it('should enforce inclusive limits without losing precision', async ({ expect }) => {
        const definition = int32().min(1).max(3).required;
        const TestModel = model('BuilderInt32Limits', new Schema({ value: definition }));
        expect(definition.validate.map((validator) => validator.type)).toEqual([
            'min',
            'max',
        ]);

        for (
            const value of [
                1,
                2,
                3,
            ]
        ) await expect(new TestModel({ value }).validate()).resolves.toBeUndefined();

        await expect(new TestModel({ value: 0 }).validate()).rejects.toMatchObject({
            errors: {
                value: {
                    kind: 'min',
                    message: 'Path `value` (0) is less than minimum allowed value (1).',
                },
            },
        });

        await expect(new TestModel({ value: 4 }).validate()).rejects.toMatchObject({
            errors: {
                value: {
                    kind: 'max',
                    message: 'Path `value` (4) is more than maximum allowed value (3).',
                },
            },
        });
    });

    it('should support readonly limit tuples and custom messages in either order', async ({ expect }) => {
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

        const TestModel = model('BuilderInt32LimitMessages', new Schema({ value: definition }));
        await expect(new TestModel({ value: 0 }).validate()).rejects.toMatchObject({
            errors: {
                value: {
                    kind: 'min',
                    message: 'too low',
                },
            },
        });

        await expect(new TestModel({ value: 4 }).validate()).rejects.toMatchObject({
            errors: {
                value: {
                    kind: 'max',
                    message: 'too high',
                },
            },
        });
    });

    it('should skip nullish values and preserve defaults and required behavior', async ({ expect }) => {
        const definition = int32().min(1).max(3).nonRequired;
        for (const validator of definition.validate) {
            expect(validator.validator(null)).toBe(true);
            expect(validator.validator(undefined)).toBe(true);
        }

        const TestModel = model('BuilderInt32OptionalLimits', new Schema({ value: definition }));
        await expect(new TestModel().validate()).resolves.toBeUndefined();
        await expect(new TestModel({ value: null }).validate()).resolves.toBeUndefined();
        const required = int32().min(1).max(3).required;
        const RequiredModel = model('BuilderInt32RequiredLimits', new Schema({ value: required }));
        await expect(new RequiredModel().validate()).rejects.toMatchObject({ errors: { value: { kind: 'required' } } });
        const withDefault = int32().min(1).default(2).max(3).required;
        const DefaultModel = model('BuilderInt32DefaultLimits', new Schema({ value: withDefault }));
        await expect(new DefaultModel().validate()).resolves.toBeUndefined();
    });

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

    it('should reject non-finite limits', ({ expect }) => {
        for (
            const value of [
                Number.NaN,
                Number.POSITIVE_INFINITY,
                Number.NEGATIVE_INFINITY,
            ]
        ) {
            expect(() => int32().min(value)).toThrow(RangeError);
            expect(
                () => int32().max([
                    value,
                    'invalid',
                ]),
            ).toThrow(RangeError);
        }
    });

    it('should expose custom limits and omit already configured methods', () => {
        const builder = int32();
        expectTypeOf<typeof builder>().toHaveProperty('min');
        expectTypeOf<typeof builder>().toHaveProperty('max');
        expectTypeOf<typeof builder>().not.toHaveProperty('enum');
        const withDefault = builder.default(42);
        expectTypeOf(withDefault).not.toHaveProperty('default');
        expectTypeOf<typeof Schema.Types.Int32.prototype>().not.toHaveProperty('min');
        expectTypeOf<typeof Schema.Types.Int32.prototype>().not.toHaveProperty('max');
        expectTypeOf<typeof Schema.Types.Int32.prototype>().not.toHaveProperty('enum');
    });
});

// Checked by the project's TypeScript validation, not executed at runtime.
function checkDefaultTypes() {
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

void checkDefaultTypes;
