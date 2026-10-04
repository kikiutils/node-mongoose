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
    uuid,
    uuidSchemaBuilder,
} from '../../src/schema-builders';

const uuidString = '09190f70-3d30-11e5-8814-0f4df9a59c41';

function checkDefaultTypes() {
    // @ts-expect-error UUID defaults cannot be numbers.
    uuid().default(42);
    // @ts-expect-error UUID defaults cannot be arbitrary objects.
    uuid().default({});
    // @ts-expect-error UUID callback defaults must return a supported UUID value.
    uuid().default(() => 42);
}

void checkDefaultTypes;

describe('uuidSchemaBuilder', () => {
    afterEach(() => deleteModel(/^BuilderUuid/));

    describe('schema definitions', () => {
        it('should export an alias and create required or optional UUID paths', ({ expect }) => {
            expect(uuid).toBe(uuidSchemaBuilder);
            expect(uuid().nonRequired).toEqual({ type: Schema.Types.UUID });
            expect(uuid().required).toEqual({
                required: true,
                type: Schema.Types.UUID,
            });
        });
    });

    describe('defaults and casting', () => {
        it('should apply string, BSON and callback defaults as subtype 4 UUID values', async ({ expect }) => {
            const TestModel = model(
                'BuilderUuidDefaults',
                new Schema({
                    bson: uuid().default(new Types.UUID(uuidString)).required,
                    callback: uuid().default(() => new Types.UUID(uuidString)).required,
                    literal: uuid().default(uuidString).required,
                }),
            );

            const doc = new TestModel();

            for (const value of [
                doc.literal,
                doc.bson,
                doc.callback,
            ]) {
                expect(value).toBeInstanceOf(Types.UUID);
                expect(value.toString()).toBe(uuidString);
                expect(value.sub_type).toBe(4);
            }

            await expect(doc.validate()).resolves.toBeUndefined();
        });

        it('should evaluate the default factory separately for each document', async ({ expect }) => {
            const values = [
                uuidString,
                '09190f70-3d30-11e5-8814-0f4df9a59c42',
            ];

            let index = 0;
            const TestModel = model(
                'BuilderUuidFactory',
                new Schema({ value: uuid().default(() => values[index++]).required }),
            );

            const original = new TestModel();
            const copy = new TestModel();

            expect(original.value).toBeInstanceOf(Types.UUID);
            expect(original.value.toString()).toBe(values[0]);
            expect(copy.value.toString()).toBe(values[1]);
            await expect(original.validate()).resolves.toBeUndefined();
            await expect(copy.validate()).resolves.toBeUndefined();
        });

        it('should cast a string value through the UUID schema definition', async ({ expect }) => {
            const TestModel = model('BuilderUuidCasting', new Schema({ value: uuid().required }));

            const doc = new TestModel({ value: uuidString });

            expect(doc.value.toString()).toBe(uuidString);
            await expect(doc.validate()).resolves.toBeUndefined();
        });

        it.for([
            {
                name: 'malformed string',
                value: 'not-a-uuid',
            },
            {
                name: 'number',
                value: 42,
            },
            {
                name: 'object',
                value: {},
            },
        ])(
            'should reject a $name on a UUID path',
            async ({ value }, { expect }) => {
                const TestModel = model('BuilderUuidCasting', new Schema({ value: uuid().required }));

                await expect(new TestModel({ value }).validate())
                    .rejects
                    .toMatchObject({ errors: { value: { name: 'CastError' } } });
            },
        );

        it('should support nullish defaults for optional paths', async ({ expect }) => {
            const TestModel = model(
                'BuilderUuidNullish',
                new Schema({
                    callbackNull: uuid().default(() => null).nonRequired,
                    callbackUndefined: uuid().default(() => undefined).nonRequired,
                    literalNull: uuid().default(null).nonRequired,
                    literalUndefined: uuid().default(undefined).nonRequired,
                }),
            );

            const doc = new TestModel();

            expect(doc.callbackNull).toBeNull();
            expect(doc.literalNull).toBeNull();
            expect(doc.callbackUndefined).toBeUndefined();
            expect(doc.literalUndefined).toBeUndefined();
            await expect(doc.validate()).resolves.toBeUndefined();
        });

        it('should require a value for required paths', async ({ expect }) => {
            const TestModel = model('BuilderUuidRequired', new Schema({ value: uuid().required }));

            await expect(new TestModel().validate()).rejects.toMatchObject({ errors: { value: { kind: 'required' } } });
        });
    });

    describe('builder types', () => {
        it('should preserve default types through common option chaining', () => {
            const definition = uuid().default(uuidString).immutable.index(1).private.sparse.unique.required;

            expectTypeOf(definition.default).toBeString();
            expectTypeOf(definition.type).toEqualTypeOf<typeof Schema.Types.UUID>();
        });

        it('should omit configured methods and unsupported validators', () => {
            const builder = uuid().default(uuidString);

            expectTypeOf(builder).not.toHaveProperty('default');
            expectTypeOf(builder).not.toHaveProperty('min');
            expectTypeOf(builder).not.toHaveProperty('max');
            expectTypeOf(builder).not.toHaveProperty('enum');
        });
    });
});
