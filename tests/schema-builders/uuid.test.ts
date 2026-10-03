import { randomUUID } from 'node:crypto';

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
    uuid,
    uuidSchemaBuilder,
} from '../../src/schema-builders';

const uuidString = '09190f70-3d30-11e5-8814-0f4df9a59c41';

describe.concurrent('uuidSchemaBuilder', () => {
    it('should export an alias and create required or optional UUID paths', ({ expect }) => {
        expect(uuid).toBe(uuidSchemaBuilder);
        expect(uuid().nonRequired).toEqual({ type: Schema.Types.UUID });
        expect(uuid().required).toEqual({
            required: true,
            type: Schema.Types.UUID,
        });
    });

    it('should preserve defaults and common options', ({ expect }) => {
        const definition = uuid().default(uuidString).immutable.index(1).private.sparse.unique.required;
        expect(definition).toEqual({
            default: uuidString,
            immutable: true,
            index: 1,
            private: true,
            required: true,
            sparse: true,
            type: Schema.Types.UUID,
            unique: true,
        });

        expectTypeOf(definition.default).toBeString();
        expectTypeOf(definition.type).toEqualTypeOf<typeof Schema.Types.UUID>();
    });

    it('should cast string and BSON UUID defaults to subtype 4 UUID values', async ({ expect }) => {
        const TestModel = model(
            'BuilderUuidDefaults',
            new Schema({
                bson: uuid().default(new Types.UUID(uuidString)).required,
                callback: uuid().default(() => new Types.UUID(uuidString)).required,
                literal: uuid().default(uuidString).required,
            }),
        );

        const doc = new TestModel();
        for (
            const value of [
                doc.bson,
                doc.callback,
                doc.literal,
            ]
        ) {
            expect(value).toBeInstanceOf(Types.UUID);
            expect(value.toString()).toBe(uuidString);
            expect(value.sub_type).toBe(4);
        }

        await expect(doc.validate()).resolves.toBeUndefined();
    });

    it('should support randomUUID as a per-document default factory', async ({ expect }) => {
        const TestModel = model('BuilderUuidRandom', new Schema({ value: uuid().default(randomUUID).required }));
        const first = new TestModel();
        const second = new TestModel();
        expect(first.value).toBeInstanceOf(Types.UUID);
        expect(first.value.toString()).not.toBe(second.value.toString());
        await expect(first.validate()).resolves.toBeUndefined();
        await expect(second.validate()).resolves.toBeUndefined();
    });

    it('should delegate UUID casting and rejection to Mongoose', async ({ expect }) => {
        const TestModel = model('BuilderUuidCasting', new Schema({ value: uuid().required }));
        const valid = new TestModel({ value: uuidString });
        expect(valid.value.toString()).toBe(uuidString);
        await expect(valid.validate()).resolves.toBeUndefined();
        for (
            const value of [
                'not-a-uuid',
                42,
                {},
            ]
        ) {
            const doc = new TestModel({ value });
            await expect(doc.validate()).rejects.toMatchObject({ errors: { value: { name: 'CastError' } } });
        }
    });

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

    it('should omit configured methods and unsupported validators', () => {
        const builder = uuid().default(uuidString);
        expectTypeOf(builder).not.toHaveProperty('default');
        expectTypeOf(builder).not.toHaveProperty('min');
        expectTypeOf(builder).not.toHaveProperty('max');
        expectTypeOf(builder).not.toHaveProperty('enum');
    });
});

function checkDefaultTypes() {
    // @ts-expect-error UUID defaults cannot be numbers.
    uuid().default(42);
    // @ts-expect-error UUID defaults cannot be arbitrary objects.
    uuid().default({});
    // @ts-expect-error UUID callback defaults must return a supported UUID value.
    uuid().default(() => 42);
}

void checkDefaultTypes;
