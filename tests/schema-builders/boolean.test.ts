import {
    describe,
    it,
} from 'vitest';

import { booleanSchemaBuilder } from '../../src/schema-builders';

describe.concurrent('booleanSchemaBuilder', () => {
    it('should create a schema with the correct type for Boolean', ({ expect }) => {
        expect(booleanSchemaBuilder().nonRequired).toEqual({ type: Boolean });
    });
});
