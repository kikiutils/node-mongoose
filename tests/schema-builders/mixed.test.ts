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
    mixed,
    mixedSchemaBuilder,
} from '../../src/schema-builders';

describe.concurrent('mixedSchemaBuilder', () => {
    it('should export an alias and create required or optional Mixed paths', ({ expect }) => {
        expect(mixed).toBe(mixedSchemaBuilder);
        expect(mixed().nonRequired).toEqual({ type: Schema.Types.Mixed });
        expect(mixed().required).toEqual({
            required: true,
            type: Schema.Types.Mixed,
        });
    });

    it('should behave like an empty schema definition without casting values', async ({ expect }) => {
        const schema = new Schema({
            explicit: mixed().nonRequired,
            implicit: {},
        });

        const TestModel = model('BuilderMixedUncast', schema);
        expect(schema.path('explicit')).toBeInstanceOf(Schema.Types.Mixed);
        expect(schema.path('implicit')).toBeInstanceOf(Schema.Types.Mixed);
        for (
            const value of [
                { nested: { enabled: true } },
                [
                    1,
                    'two',
                ],
                '42',
                42,
                false,
                null,
                undefined,
            ]
        ) {
            const doc = new TestModel({
                explicit: value,
                implicit: value,
            });

            expect(doc.explicit).toEqual(value);
            expect(doc.explicit).toEqual(doc.implicit);
            await expect(doc.validate()).resolves.toBeUndefined();
        }
    });

    it('should support arbitrary defaults and common options', ({ expect }) => {
        const value = { enabled: true };
        const definition = mixed().default(value).immutable.index(1).private.sparse.unique.required;
        expect(definition).toEqual({
            default: value,
            immutable: true,
            index: 1,
            private: true,
            required: true,
            sparse: true,
            type: Schema.Types.Mixed,
            unique: true,
        });

        expectTypeOf(definition.default).toEqualTypeOf<typeof value>();
        expectTypeOf(mixed().default(42).nonRequired.default).toBeNumber();
        expectTypeOf(mixed().default('text').nonRequired.default).toBeString();
    });

    it('should apply object and callback defaults independently for each document', async ({ expect }) => {
        const TestModel = model(
            'BuilderMixedDefaults',
            new Schema({
                callback: mixed().default(() => ({ values: [] })).required,
                literal: mixed().default({ values: [] }).required,
            }),
        );

        const first = new TestModel();
        const second = new TestModel();
        expect(first.literal).toEqual({ values: [] });
        expect(first.callback).toEqual({ values: [] });
        expect(first.literal).not.toBe(second.literal);
        expect(first.callback).not.toBe(second.callback);
        await expect(first.validate()).resolves.toBeUndefined();
    });

    it('should allow nullish defaults on optional paths', async ({ expect }) => {
        const TestModel = model(
            'BuilderMixedNullish',
            new Schema({
                callbackNull: mixed().default(() => null).nonRequired,
                callbackUndefined: mixed().default(() => undefined).nonRequired,
                literalNull: mixed().default(null).nonRequired,
                literalUndefined: mixed().default(undefined).nonRequired,
            }),
        );

        const doc = new TestModel();
        expect(doc.callbackNull).toBeNull();
        expect(doc.literalNull).toBeNull();
        expect(doc.callbackUndefined).toBeUndefined();
        expect(doc.literalUndefined).toBeUndefined();
        await expect(doc.validate()).resolves.toBeUndefined();
    });

    it('should require presence rather than a specific value type', async ({ expect }) => {
        const TestModel = model('BuilderMixedRequired', new Schema({ value: mixed().required }));
        for (
            const value of [
                undefined,
                null,
            ]
        ) {
            const doc = new TestModel({ value });
            await expect(doc.validate()).rejects.toMatchObject({ errors: { value: { kind: 'required' } } });
        }

        for (
            const value of [
                {},
                [],
                false,
                0,
                '',
            ]
        ) await expect(new TestModel({ value }).validate()).resolves.toBeUndefined();
    });

    it('should omit configured methods and unsupported validators', () => {
        const builder = mixed().default({});
        expectTypeOf(builder).not.toHaveProperty('default');
        expectTypeOf(builder).not.toHaveProperty('min');
        expectTypeOf(builder).not.toHaveProperty('max');
        expectTypeOf(builder).not.toHaveProperty('enum');
        expectTypeOf(builder.nonRequired.type).toEqualTypeOf<typeof Schema.Types.Mixed>();
    });
});
