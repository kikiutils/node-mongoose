import {
    describe,
    it,
} from 'vitest';

import { numberSchemaBuilder } from '../../src/schema-builders';

describe.concurrent('numberSchemaBuilder', () => {
    it('should create a schema with the correct type for Number', ({ expect }) => {
        expect(numberSchemaBuilder().nonRequired).toEqual({ type: Number });
    });
});
