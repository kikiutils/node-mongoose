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
    mixed,
    mixedSchemaBuilder,
} from '../../src/schema-builders';

describe('mixedSchemaBuilder', () => {
    afterEach(() => deleteModel(/^BuilderMixed/));

    describe('schema definitions', () => {
        it('should export an alias and create required or optional Mixed paths', ({ expect }) => {
            expect(mixed).toBe(mixedSchemaBuilder);
            expect(mixed().nonRequired).toEqual({ type: Schema.Types.Mixed });
            expect(mixed().required).toEqual({
                required: true,
                type: Schema.Types.Mixed,
            });
        });
    });

    describe('defaults and casting', () => {
        it.for([
            {
                name: 'object',
                value: { nested: { enabled: true } },
            },
            {
                name: 'array',
                value: [
                    1,
                    'two',
                ],
            },
            {
                name: 'string',
                value: '42',
            },
            {
                name: 'number',
                value: 42,
            },
            {
                name: 'boolean',
                value: false,
            },
            {
                name: 'null',
                value: null,
            },
            {
                name: 'undefined',
                value: undefined,
            },
        ])(
            'should preserve a $name value like an empty schema definition',
            async ({ value }, { expect }) => {
                const schema = new Schema({
                    explicit: mixed().nonRequired,
                    implicit: {},
                });

                const TestModel = model('BuilderMixedUncast', schema);

                const doc = new TestModel({
                    explicit: value,
                    implicit: value,
                });

                expect(schema.path('explicit')).toBeInstanceOf(Schema.Types.Mixed);
                expect(doc.explicit).toEqual(value);
                expect(doc.explicit).toEqual(doc.implicit);
                await expect(doc.validate()).resolves.toBeUndefined();
            },
        );

        it('should apply object and callback defaults independently for each document', async ({ expect }) => {
            const TestModel = model(
                'BuilderMixedDefaults',
                new Schema({
                    callback: mixed().default(() => ({ values: [] })).required,
                    literal: mixed().default({ values: [] }).required,
                }),
            );

            const original = new TestModel();
            const copy = new TestModel();

            expect(original.literal).toEqual({ values: [] });
            expect(original.callback).toEqual({ values: [] });
            expect(original.literal).not.toBe(copy.literal);
            expect(original.callback).not.toBe(copy.callback);
            await expect(original.validate()).resolves.toBeUndefined();
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

        it.for([
            undefined,
            null,
        ])(
            'should reject %s on a required Mixed path',
            async (value, { expect }) => {
                const TestModel = model('BuilderMixedRequired', new Schema({ value: mixed().required }));

                await expect(new TestModel({ value }).validate())
                    .rejects
                    .toMatchObject({ errors: { value: { kind: 'required' } } });
            },
        );

        it.for([
            {
                name: 'empty object',
                value: {},
            },
            {
                name: 'empty array',
                value: [],
            },
            {
                name: 'false',
                value: false,
            },
            {
                name: 'zero',
                value: 0,
            },
            {
                name: 'empty string',
                value: '',
            },
        ])(
            'should accept $name on a required Mixed path',
            async ({ value }, { expect }) => {
                const TestModel = model('BuilderMixedRequired', new Schema({ value: mixed().required }));

                await expect(new TestModel({ value }).validate()).resolves.toBeUndefined();
            },
        );
    });

    describe('builder types', () => {
        it('should preserve default types through common option chaining', () => {
            const value = { enabled: true };

            const definition = mixed().default(value).immutable.index(1).private.sparse.unique.required;

            expectTypeOf(definition.default).toEqualTypeOf<typeof value>();
            expectTypeOf(mixed().default(42).nonRequired.default).toBeNumber();
            expectTypeOf(mixed().default('text').nonRequired.default).toBeString();
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
});
