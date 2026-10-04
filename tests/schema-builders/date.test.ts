import {
    describe,
    it,
} from 'vitest';

import { dateSchemaBuilder } from '../../src/schema-builders';

describe('dateSchemaBuilder', () => {
    it('should create a schema with the correct type for Date', ({ expect }) => {
        expect(dateSchemaBuilder().nonRequired).toEqual({ type: Date });
    });
});
