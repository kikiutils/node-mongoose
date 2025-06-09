import { Schema } from 'mongoose';
import {
    describe,
    it,
} from 'vitest';

import { createBaseSchemaBuilderFactory } from '../../src/schema-builders/base';

describe.concurrent('createBaseSchemaBuilderFactory', () => {
    it('should create a schema with correct type for various constructors', ({ expect }) => {
        expect(createBaseSchemaBuilderFactory(Boolean)().nonRequired).toEqual({ type: Boolean });
        expect(createBaseSchemaBuilderFactory(Date)().nonRequired).toEqual({ type: Date });
        expect(createBaseSchemaBuilderFactory(Number)().nonRequired).toEqual({ type: Number });
        // eslint-disable-next-line style/max-len
        expect(createBaseSchemaBuilderFactory(Schema.Types.ObjectId)().nonRequired).toEqual({ type: Schema.Types.ObjectId });
        expect(createBaseSchemaBuilderFactory(String)().nonRequired).toEqual({ type: String });
    });

    it('should set any additional key in the schema to true', ({ expect }) => {
        expect(createBaseSchemaBuilderFactory(String)().private.unique.nonRequired).toEqual({
            private: true,
            type: String,
            unique: true,
        });
    });

    it('should set default attribute in the schema', ({ expect }) => {
        expect(createBaseSchemaBuilderFactory(Number)().default(1).nonRequired).toEqual({
            default: 1,
            type: Number,
        });
    });

    it('should set default attribute in the schema using a function', ({ expect }) => {
        function newDateFunction() {
            return new Date();
        }

        expect(createBaseSchemaBuilderFactory(Date)().default(newDateFunction).nonRequired).toEqual({
            default: newDateFunction,
            type: Date,
        });
    });

    it('should set enum attribute in the schema', ({ expect }) => {
        const schema = createBaseSchemaBuilderFactory(Number)().enum([
            1,
            2,
        ]).nonRequired;

        expect(schema).toEqual({
            enum: [
                1,
                2,
            ],
            type: Number,
        });
    });

    it('should set index attribute in the schema', ({ expect }) => {
        expect(createBaseSchemaBuilderFactory(Number)().index(1).nonRequired).toEqual({
            index: 1,
            type: Number,
        });

        expect(createBaseSchemaBuilderFactory(Number)().index('asc').nonRequired).toEqual({
            index: 'asc',
            type: Number,
        });

        expect(createBaseSchemaBuilderFactory(Number)().index({
            sparse: true,
            unique: true,
        }).nonRequired).toEqual({
            index: {
                sparse: true,
                unique: true,
            },
            type: Number,
        });
    });

    it('should set max attribute in the schema', ({ expect }) => {
        expect(createBaseSchemaBuilderFactory(Number)().max(1024).nonRequired).toEqual({
            max: 1024,
            type: Number,
        });
    });

    it('should set maxlength attribute in the schema', ({ expect }) => {
        expect(createBaseSchemaBuilderFactory(String)().maxlength(1024).nonRequired).toEqual({
            maxlength: 1024,
            type: String,
        });
    });

    it('should set min attribute in the schema', ({ expect }) => {
        expect(createBaseSchemaBuilderFactory(Number)().min([
            0,
            'min',
        ]).nonRequired).toEqual({
            min: [
                0,
                'min',
            ],
            type: Number,
        });
    });

    it('should set minlength attribute in the schema', ({ expect }) => {
        expect(createBaseSchemaBuilderFactory(String)().minlength([
            0,
            'minlength',
        ]).nonRequired).toEqual({
            minlength: [
                0,
                'minlength',
            ],
            type: String,
        });
    });

    it('should set required attribute in the schema', ({ expect }) => {
        expect(createBaseSchemaBuilderFactory(Boolean)().required).toEqual({
            required: true,
            type: Boolean,
        });
    });

    it('should throw an error when a duplicate schema attribute is set', ({ expect }) => {
        const schemaBuilder = createBaseSchemaBuilderFactory(Boolean)();
        expect(() => schemaBuilder.default(false).default(true)).toThrow('Duplicate schema attribute: default');
    });

    it('should throw an error when using a symbol as a schema attribute', ({ expect }) => {
        const schemaBuilder = createBaseSchemaBuilderFactory(Boolean)();
        // @ts-expect-error Ignore this error.
        expect(() => schemaBuilder[Symbol('test')]).toThrow('Cannot use symbol as a schema attribute');
    });
});
