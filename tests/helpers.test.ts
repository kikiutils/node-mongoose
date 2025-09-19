import { Types } from 'mongoose';
import {
    describe,
    it,
} from 'vitest';

import { toObjectIdHexString } from '../src/helpers';

describe.concurrent('toObjectIdHexString', () => {
    it('should return the hex string when input is ObjectId', ({ expect }) => {
        const input = new Types.ObjectId();

        const result = toObjectIdHexString(input);
        expect(typeof result).toBe('string');
        expect(result).toHaveLength(24);
        expect(result).toBe(input.toHexString());
    });

    it('should return the same string when input is a string', ({ expect }) => {
        const input = '507f1f77bcf86cd799439011';

        const result = toObjectIdHexString(input);
        expect(result).toBe(input);
    });

    it('should return the same string even if input string is not a valid ObjectId', ({ expect }) => {
        const input = 'notanobjectidstring';

        const result = toObjectIdHexString(input);
        expect(result).toBe(input);
    });
});
