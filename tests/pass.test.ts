import {
    describe,
    it,
} from 'vitest';

describe.concurrent('pass', () => {
    it('should pass', ({ expect }) => expect(true).toBe(true));
});
