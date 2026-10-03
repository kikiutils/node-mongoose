import {
    model,
    Schema,
    Types,
} from 'mongoose';
import {
    describe,
    expectTypeOf,
    it,
} from 'vitest';

import {
    double,
    doubleSchemaBuilder,
} from '../../src/schema-builders';

describe.concurrent('doubleSchemaBuilder', () => {
    it('should export an alias and use the correct SchemaType', ({ expect }) => {
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

    it('should require a value for required paths', async ({ expect }) => {
        const schema = new Schema<{ value: Types.Double }>({ value: double().required });
        const TestModel = model('BuilderDoubleRequired', schema);
        await expect(new TestModel().validate()).rejects.toMatchObject({ errors: { value: { kind: 'required' } } });
    });

    it('should enforce inclusive limits without losing precision', async ({ expect }) => {
        const definition = double().min(1.5).max(3.5).required;
        const TestModel = model('BuilderDoubleLimits', new Schema<{ value: Types.Double }>({ value: definition }));
        expect(definition.validate.map((validator) => validator.type)).toEqual([
            'min',
            'max',
        ]);

        for (
            const value of [
                1.5,
                2.5,
                3.5,
            ]
        ) await expect(new TestModel({ value }).validate()).resolves.toBeUndefined();

        await expect(new TestModel({ value: 1.4 }).validate()).rejects.toMatchObject({
            errors: {
                value: {
                    kind: 'min',
                    message: 'Path `value` (1.4) is less than minimum allowed value (1.5).',
                },
            },
        });

        await expect(new TestModel({ value: 3.6 }).validate()).rejects.toMatchObject({
            errors: {
                value: {
                    kind: 'max',
                    message: 'Path `value` (3.6) is more than maximum allowed value (3.5).',
                },
            },
        });
    });

    it('should support readonly limit tuples and custom messages in either order', async ({ expect }) => {
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

        const testModelSchema = new Schema<{ value: Types.Double }>({ value: definition });
        const TestModel = model('BuilderDoubleLimitMessages', testModelSchema);
        await expect(new TestModel({ value: 1.4 }).validate()).rejects.toMatchObject({
            errors: {
                value: {
                    kind: 'min',
                    message: 'too low',
                },
            },
        });

        await expect(new TestModel({ value: 3.6 }).validate()).rejects.toMatchObject({
            errors: {
                value: {
                    kind: 'max',
                    message: 'too high',
                },
            },
        });
    });

    it('should skip nullish values and preserve defaults and required behavior', async ({ expect }) => {
        const definition = double().min(1.5).max(3.5).nonRequired;
        for (const validator of definition.validate) {
            expect(validator.validator(null)).toBe(true);
            expect(validator.validator(undefined)).toBe(true);
        }

        const testModelSchema = new Schema<{ value: Types.Double }>({ value: definition });
        const TestModel = model('BuilderDoubleOptionalLimits', testModelSchema);
        await expect(new TestModel().validate()).resolves.toBeUndefined();
        await expect(new TestModel({ value: null }).validate()).resolves.toBeUndefined();
        const required = double().min(1.5).max(3.5).required;
        const requiredModelSchema = new Schema<{ value: Types.Double }>({ value: required });
        const RequiredModel = model('BuilderDoubleRequiredLimits', requiredModelSchema);
        await expect(new RequiredModel().validate()).rejects.toMatchObject({ errors: { value: { kind: 'required' } } });
        const withDefault = double().min(1.5).default(new Types.Double(2.5)).max(3.5).required;
        const defaultModelSchema = new Schema<{ value: Types.Double }>({ value: withDefault });
        const DefaultModel = model('BuilderDoubleDefaultLimits', defaultModelSchema);
        await expect(new DefaultModel().validate()).resolves.toBeUndefined();
    });

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

    it('should reject non-finite limits', ({ expect }) => {
        for (
            const value of [
                Number.NaN,
                Number.POSITIVE_INFINITY,
                Number.NEGATIVE_INFINITY,
            ]
        ) {
            expect(() => double().min(value)).toThrow(RangeError);
            expect(
                () => double().max([
                    value,
                    'invalid',
                ]),
            ).toThrow(RangeError);
        }
    });

    it('should accept BSON Double limits and reject NaN document values', async ({ expect }) => {
        const definition = double()
            .min(new Types.Double(1.5))
            .max([
                new Types.Double(3.5),
                'too high',
            ])
            .required;

        const TestModel = model('BuilderDoubleBsonLimits', new Schema<{ value: Types.Double }>({ value: definition }));
        await expect(new TestModel({ value: new Types.Double(2.5) }).validate()).resolves.toBeUndefined();
        await expect(new TestModel({ value: new Types.Double(4) }).validate()).rejects.toMatchObject({
            errors: {
                value: {
                    kind: 'max',
                    message: 'too high',
                },
            },
        });

        const nanDoc = new TestModel({ value: Number.NaN });
        await expect(nanDoc.validate()).rejects.toMatchObject({ errors: { value: { kind: 'min' } } });
        expect(() => double().min(new Types.Double(Number.NaN))).toThrow(RangeError);
        expect(() => double().max(new Types.Double(Number.POSITIVE_INFINITY))).toThrow(RangeError);
    });

    it('should expose custom limits and omit already configured methods', () => {
        const builder = double();
        expectTypeOf<typeof builder>().toHaveProperty('min');
        expectTypeOf<typeof builder>().toHaveProperty('max');
        expectTypeOf<typeof builder>().not.toHaveProperty('enum');
        const withDefault = builder.default(new Types.Double(4.2));
        expectTypeOf(withDefault).not.toHaveProperty('default');
        expectTypeOf<typeof Schema.Types.Double.prototype>().not.toHaveProperty('min');
        expectTypeOf<typeof Schema.Types.Double.prototype>().not.toHaveProperty('max');
        expectTypeOf<typeof Schema.Types.Double.prototype>().not.toHaveProperty('enum');
    });
});

// Checked by the project's TypeScript validation, not executed at runtime.
function checkDefaultTypes() {
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

void checkDefaultTypes;
