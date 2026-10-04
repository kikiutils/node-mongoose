import {
    model,
    Schema,
    Types,
} from 'mongoose';
import {
    describe,
    it,
} from 'vitest';

import { mongooseNormalizePlugin } from '../../src/plugins/normalize';

describe.concurrent('mongooseNormalizePlugin', () => {
    it('should preserve normalization and mutations when the original transform returns undefined', ({ expect }) => {
        const schema = new Schema(
            {
                amount: Schema.Types.Decimal128,
                extra: String,
                secret: {
                    private: true,
                    type: String,
                },
            },
            {
                toJSON: {
                    transform(_doc, ret) {
                        ret.extra = 'retained';
                    },
                },
            },
        );

        schema.plugin(mongooseNormalizePlugin);
        const TestModel = model('NormalizeUndefinedTransform', schema);
        const doc = new TestModel({
            __v: 1,
            amount: Types.Decimal128.fromString('1.23'),
            secret: 'hidden',
        });

        const result = doc.toJSON();
        expect(result).toEqual({
            amount: '1.23',
            extra: 'retained',
            id: doc._id.toHexString(),
        });

        expect(doc.secret).toBe('hidden');
        expect(doc.amount).toBeInstanceOf(Types.Decimal128);
    });

    it('should pass normalized output to the original transform and preserve its replacement', ({ expect }) => {
        const replacement = { publicValue: true };
        const schema = new Schema(
            {
                secret: {
                    private: true,
                    type: String,
                },
            },
            {
                toJSON: {
                    transform(_doc, ret) {
                        expect(ret).toHaveProperty('id');
                        expect(ret).not.toHaveProperty('_id');
                        expect(ret).not.toHaveProperty('__v');
                        expect(ret).not.toHaveProperty('secret');
                        return replacement;
                    },
                },
            },
        );

        schema.plugin(mongooseNormalizePlugin);
        const TestModel = model('NormalizeReplacementTransform', schema);
        expect(
            new TestModel({
                __v: 1,
                secret: 'hidden',
            }).toJSON(),
        ).toBe(replacement);
    });

    it.for([
        null,
        false,
        0,
        '',
    ])(
        'should preserve an explicit transform return value of %j',
        (value, { expect }) => {
            const schema = new Schema({}, { toJSON: { transform: () => value } });
            schema.plugin(mongooseNormalizePlugin);
            const TestModel = model(`NormalizeExplicitReturn${String(value)}`, schema);
            expect(new TestModel().toJSON()).toBe(value);
        },
    );

    it('should propagate errors from the original transform', ({ expect }) => {
        const error = new Error('Transform failed');
        const schema = new Schema(
            {},
            {
                toJSON: {
                    transform() {
                        throw error;
                    },
                },
            },
        );

        schema.plugin(mongooseNormalizePlugin);
        const TestModel = model('NormalizeThrowingTransform', schema);
        expect(() => new TestModel().toJSON()).toThrow(error);
    });

    it('should normalize output when no original transform exists', ({ expect }) => {
        const schema = new Schema({
            secret: {
                private: true,
                type: String,
            },
        });

        schema.plugin(mongooseNormalizePlugin);
        const TestModel = model('NormalizeWithoutTransform', schema);
        const doc = new TestModel({
            __v: 1,
            secret: 'hidden',
        });

        expect(doc.toJSON()).toEqual({ id: doc._id.toHexString() });
    });
});
