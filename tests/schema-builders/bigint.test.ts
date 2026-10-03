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
    bigint,
    bigintSchemaBuilder,
} from '../../src/schema-builders';

describe.concurrent('bigintSchemaBuilder', () => {
    it('should export an alias and use the correct SchemaType', ({ expect }) => {
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
        expect(doc.literal).toEqual(value);
        expect(doc.callback).toEqual(value);
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

    it('should preserve precision and enforce BSON signed 64-bit bounds', async ({ expect }) => {
        const TestModel = model('BuilderBigIntCasting', new Schema({ value: bigint().required }));
        for (
            const value of [
                -9223372036854775808n,
                9223372036854775807n,
            ]
        ) {
            const doc = new TestModel({ value });
            expect(doc.value).toBe(value);
            await expect(doc.validate()).resolves.toBeUndefined();
        }

        for (
            const value of [
                -9223372036854775809n,
                9223372036854775808n,
            ]
        ) {
            const doc = new TestModel({ value });
            await expect(doc.validate()).rejects.toMatchObject({ errors: { value: { name: 'CastError' } } });
        }
    });

    it('should require a value for required paths', async ({ expect }) => {
        const TestModel = model('BuilderBigIntRequired', new Schema({ value: bigint().required }));
        await expect(new TestModel().validate()).rejects.toMatchObject({ errors: { value: { kind: 'required' } } });
    });

    it('should enforce inclusive limits without losing precision', async ({ expect }) => {
        const definition = bigint().min(9007199254740993n).max(9007199254740995n).required;
        const TestModel = model('BuilderBigIntLimits', new Schema<{ value: bigint }>({ value: definition }));
        expect(definition.validate.map((validator) => validator.type)).toEqual([
            'min',
            'max',
        ]);

        for (
            const value of [
                9007199254740993n,
                9007199254740994n,
                9007199254740995n,
            ]
        ) await expect(new TestModel({ value }).validate()).resolves.toBeUndefined();

        await expect(new TestModel({ value: 9007199254740992n }).validate()).rejects.toMatchObject({
            errors: {
                value: {
                    kind: 'min',
                    message: 'Path `value` (9007199254740992) is less than minimum allowed value (9007199254740993).',
                },
            },
        });

        await expect(new TestModel({ value: 9007199254740996n }).validate()).rejects.toMatchObject({
            errors: {
                value: {
                    kind: 'max',
                    message: 'Path `value` (9007199254740996) is more than maximum allowed value (9007199254740995).',
                },
            },
        });
    });

    it('should support readonly limit tuples and custom messages in either order', async ({ expect }) => {
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

        const TestModel = model('BuilderBigIntLimitMessages', new Schema<{ value: bigint }>({ value: definition }));
        await expect(new TestModel({ value: 9007199254740992n }).validate()).rejects.toMatchObject({
            errors: {
                value: {
                    kind: 'min',
                    message: 'too low',
                },
            },
        });

        await expect(new TestModel({ value: 9007199254740996n }).validate()).rejects.toMatchObject({
            errors: {
                value: {
                    kind: 'max',
                    message: 'too high',
                },
            },
        });
    });

    it('should skip nullish values and preserve defaults and required behavior', async ({ expect }) => {
        const definition = bigint().min(9007199254740993n).max(9007199254740995n).nonRequired;
        for (const validator of definition.validate) {
            expect(validator.validator(null)).toBe(true);
            expect(validator.validator(undefined)).toBe(true);
        }

        const TestModel = model('BuilderBigIntOptionalLimits', new Schema<{ value: bigint }>({ value: definition }));
        await expect(new TestModel().validate()).resolves.toBeUndefined();
        await expect(new TestModel({ value: null }).validate()).resolves.toBeUndefined();
        const required = bigint().min(9007199254740993n).max(9007199254740995n).required;
        const RequiredModel = model('BuilderBigIntRequiredLimits', new Schema<{ value: bigint }>({ value: required }));
        await expect(new RequiredModel().validate()).rejects.toMatchObject({ errors: { value: { kind: 'required' } } });
        const withDefault = bigint().min(9007199254740993n).default(9007199254740994n).max(9007199254740995n).required;
        const DefaultModel = model('BuilderBigIntDefaultLimits', new Schema<{ value: bigint }>({ value: withDefault }));
        await expect(new DefaultModel().validate()).resolves.toBeUndefined();
    });

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

    it('should expose custom limits and omit already configured methods', () => {
        const builder = bigint();
        expectTypeOf<typeof builder>().toHaveProperty('min');
        expectTypeOf<typeof builder>().toHaveProperty('max');
        expectTypeOf<typeof builder>().not.toHaveProperty('enum');
        const withDefault = builder.default(42n);
        expectTypeOf(withDefault).not.toHaveProperty('default');
        expectTypeOf<typeof Schema.Types.BigInt.prototype>().not.toHaveProperty('min');
        expectTypeOf<typeof Schema.Types.BigInt.prototype>().not.toHaveProperty('max');
        expectTypeOf<typeof Schema.Types.BigInt.prototype>().not.toHaveProperty('enum');
    });
});

// Checked by the project's TypeScript validation, not executed at runtime.
function checkDefaultTypes() {
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

void checkDefaultTypes;
