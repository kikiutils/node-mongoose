import {
    describe,
    it,
} from 'vitest';

import { stringSchemaBuilder } from '../../src/schema-builders';

describe('stringSchemaBuilder', () => {
    it('should create a schema with the correct type for String', ({ expect }) => {
        expect(stringSchemaBuilder().nonRequired).toEqual({ type: String });
    });

    it('should configure trimming and IPv4 validation', ({ expect }) => {
        const schema = stringSchemaBuilder().ipv4().nonRequired;

        expect(schema).toEqual({
            trim: true,
            type: String,
            validate: {
                message: '`{VALUE}` is not a valid IPv4 address for path `{PATH}`',
                validator: expect.any(Function),
            },
        });

        expect(schema.validate.validator('192.168.1.1')).toBe(true);
        expect(schema.validate.validator('255.255.255.255')).toBe(true);
        expect(schema.validate.validator('256.256.256.256')).toBe(false);
        expect(schema.validate.validator('invalid-ip')).toBe(false);
        expect(schema.validate.validator('')).toBe(false);
    });

    it('should configure trimming and IPv6 validation', ({ expect }) => {
        const schema = stringSchemaBuilder().ipv6().nonRequired;

        expect(schema).toEqual({
            trim: true,
            type: String,
            validate: {
                message: '`{VALUE}` is not a valid IPv6 address for path `{PATH}`',
                validator: expect.any(Function),
            },
        });

        expect(schema.validate.validator('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
        expect(schema.validate.validator('::1')).toBe(true);
        expect(schema.validate.validator('192.168.1.1')).toBe(false);
        expect(schema.validate.validator('invalid-ip')).toBe(false);
        expect(schema.validate.validator('')).toBe(false);
    });

    it('should configure WHATWG URL validation', ({ expect }) => {
        const schema = stringSchemaBuilder().url().nonRequired;

        expect(schema).toEqual({
            type: String,
            validate: {
                message: '`{VALUE}` is not a valid URL for path `{PATH}`',
                validator: expect.any(Function),
            },
        });

        expect(schema.validate.validator('https://example.com')).toBe(true);
        expect(schema.validate.validator('https://user:password@example.com')).toBe(true);
        expect(schema.validate.validator('http://localhost')).toBe(true);
        expect(schema.validate.validator('mailto:user@example.com')).toBe(true);
        expect(schema.validate.validator('/relative/path')).toBe(false);
        expect(schema.validate.validator('not a URL')).toBe(false);
    });

    it('should allow customizing the URL validation message', ({ expect }) => {
        const schema = stringSchemaBuilder().url('Invalid URL').nonRequired;

        expect(schema.validate.message).toBe('Invalid URL');
    });

    it('should preserve the match pattern', ({ expect }) => {
        const pattern = /^[a-z]+$/;
        const schema = stringSchemaBuilder().match(pattern).nonRequired;

        expect(schema).toEqual({
            match: pattern,
            type: String,
        });
    });

    it('should allow customizing the match validation message', ({ expect }) => {
        const pattern = /^[a-z]+$/;
        const schema = stringSchemaBuilder().match(pattern, 'Invalid format').nonRequired;

        expect(schema.match).toEqual([
            pattern,
            'Invalid format',
        ]);
    });

    it('should allow combining match and URL validation', ({ expect }) => {
        const pattern = /^https:/;
        const schema = stringSchemaBuilder().match(pattern).url().nonRequired;

        expect(schema.match).toBe(pattern);
        expect(schema.validate.validator('https://example.com')).toBe(true);
    });

    it('should set both maxlength and minlength to the specified length', ({ expect }) => {
        expect(stringSchemaBuilder().length(10).nonRequired).toEqual({
            maxlength: 10,
            minlength: 10,
            type: String,
        });
    });
});
