import { Schema } from 'mongoose';
import {
    describe,
    it,
} from 'vitest';

import { createBaseSchemaBuilderFactory } from '../../src/schema-builders/base';

describe('createBaseSchemaBuilderFactory', () => {
    it.for([
        {
            name: 'Boolean',
            type: Boolean,
        },
        {
            name: 'Date',
            type: Date,
        },
        {
            name: 'Number',
            type: Number,
        },
        {
            name: 'ObjectId',
            type: Schema.Types.ObjectId,
        },
        {
            name: 'String',
            type: String,
        },
    ])(
        'should preserve the $name constructor in the schema definition',
        ({ type }, { expect }) => {
            expect(createBaseSchemaBuilderFactory(type)().nonRequired).toEqual({ type });
        },
    );

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
            return new Date('2026-01-01T00:00:00.000Z');
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

    it.for([
        {
            index: 1,
            name: 'numeric direction',
        },
        {
            index: 'asc',
            name: 'named direction',
        },
        {
            index: {
                sparse: true,
                unique: true,
            },
            name: 'index options',
        },
    ])(
        'should preserve $name in the index attribute',
        ({ index }, { expect }) => {
            expect(createBaseSchemaBuilderFactory(Number)().index(index).nonRequired).toEqual({
                index,
                type: Number,
            });
        },
    );

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
        expect(
            createBaseSchemaBuilderFactory(Number)()
                .min([
                    0,
                    'min',
                ])
                .nonRequired,
        ).toEqual({
            min: [
                0,
                'min',
            ],
            type: Number,
        });
    });

    it('should set minlength attribute in the schema', ({ expect }) => {
        expect(
            createBaseSchemaBuilderFactory(String)()
                .minlength([
                    0,
                    'minlength',
                ])
                .nonRequired,
        ).toEqual({
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

        // @ts-expect-error A symbol key deliberately bypasses the builder attribute type.
        expect(() => schemaBuilder[Symbol('test')]).toThrow('Cannot use symbol as a schema attribute');
    });
});
