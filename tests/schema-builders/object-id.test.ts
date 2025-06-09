import { Schema } from 'mongoose';
import {
    describe,
    it,
} from 'vitest';

import { objectIdSchemaBuilder } from '../../src/schema-builders';

describe.concurrent('objectIdSchemaBuilder', () => {
    it('should create a schema with the correct type for ObjectId', ({ expect }) => {
        expect(objectIdSchemaBuilder().nonRequired).toEqual({ type: Schema.Types.ObjectId });
    });
});
