import {
    model,
    Schema,
} from 'mongoose';
import {
    describe,
    it,
} from 'vitest';

import { refSchemaBuilder } from '../../src/schema-builders';

describe.concurrent('refSchemaBuilder', () => {
    it('should create a schema with the correct ref for a function returning a model', ({ expect }) => {
        const schema = new Schema({ name: { type: String } });
        const getModelFunction = () => model('Model', schema);
        expect(refSchemaBuilder(getModelFunction).nonRequired).toEqual({
            ref: getModelFunction,
            type: Schema.Types.ObjectId,
        });
    });

    it('should create a schema with the correct ref for a function returning a model name', ({ expect }) => {
        const getModelNameFunction = () => 'Model';
        expect(refSchemaBuilder(getModelNameFunction).nonRequired).toEqual({
            ref: getModelNameFunction,
            type: Schema.Types.ObjectId,
        });
    });

    it('should create a schema with the correct ref for a model reference', ({ expect }) => {
        const schema = new Schema({ name: { type: String } });
        const Model = model('Model', schema);
        expect(refSchemaBuilder(Model).nonRequired).toEqual({
            ref: Model,
            type: Schema.Types.ObjectId,
        });
    });

    it('should create a schema with the correct ref for a string reference', ({ expect }) => {
        expect(refSchemaBuilder('Admin').nonRequired).toEqual({
            ref: 'Admin',
            type: Schema.Types.ObjectId,
        });
    });
});
