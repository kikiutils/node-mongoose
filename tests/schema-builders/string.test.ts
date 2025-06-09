import {
    describe,
    it,
} from 'vitest';

import { stringSchemaBuilder } from '../../src/schema-builders';

describe.concurrent('stringSchemaBuilder', () => {
    it('should create a schema with the correct type for String', ({ expect }) => {
        expect(stringSchemaBuilder().nonRequired).toEqual({ type: String });
    });

    it('should correctly set IPv4 validator and validate IPv4 addresses', ({ expect }) => {
        const schema = stringSchemaBuilder().ipv4().nonRequired;
        expect(schema).toEqual({
            trim: true,
            type: String,
            validate: {
                message: '`{VALUE}` is not a valid IPv4 address for path `{PATH}`.',
                validator: expect.any(Function),
            },
        });

        expect(schema.validate.validator('192.168.1.1')).toBe(true);
        expect(schema.validate.validator('255.255.255.255')).toBe(true);
        expect(schema.validate.validator('256.256.256.256')).toBe(false);
        expect(schema.validate.validator('invalid-ip')).toBe(false);
        expect(schema.validate.validator('')).toBe(false);
    });

    it('should correctly set IPv6 validator and validate IPv6 addresses', ({ expect }) => {
        const schema = stringSchemaBuilder().ipv6().nonRequired;
        expect(schema).toEqual({
            trim: true,
            type: String,
            validate: {
                message: '`{VALUE}` is not a valid IPv6 address for path `{PATH}`.',
                validator: expect.any(Function),
            },
        });

        expect(schema.validate.validator('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
        expect(schema.validate.validator('::1')).toBe(true);
        expect(schema.validate.validator('192.168.1.1')).toBe(false);
        expect(schema.validate.validator('invalid-ip')).toBe(false);
        expect(schema.validate.validator('')).toBe(false);
    });

    it('should set both maxlength and minlength to the specified length', ({ expect }) => {
        expect(stringSchemaBuilder().length(10).nonRequired).toEqual({
            maxlength: 10,
            minlength: 10,
            type: String,
        });
    });
});
