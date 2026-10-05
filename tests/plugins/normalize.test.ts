import {
    deleteModel,
    model,
    Schema,
    Types,
} from 'mongoose';
import {
    afterEach,
    describe,
    it,
    vi,
} from 'vitest';

import { mongooseNormalizePlugin } from '../../src/plugins/normalize';

describe('mongooseNormalizePlugin', () => {
    afterEach(() => deleteModel(/^Normalize/));

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

        // Capture the error to verify reference identity rather than only its type or message.
        let caught: unknown;
        try {
            new TestModel().toJSON();
        } catch (originalError) {
            caught = originalError;
        }

        expect(caught).toBe(error);
    });

    for (
        const recursive of [
            undefined,
            true,
            false,
        ]
    ) {
        it(`supports direct recursive=${recursive} registration`, ({ expect }) => {
            const leaf = new Schema({
                amount: Schema.Types.Decimal128,
                secret: {
                    private: true,
                    type: String,
                },
            });

            const child = new Schema({ leaf });
            const schema = new Schema({
                child,
                children: [child],
                dictionary: {
                    of: child,
                    type: Map,
                },
            });

            schema.plugin(
                mongooseNormalizePlugin,
                {
                    convertIdField: false,
                    recursive,
                },
            );

            const TestModel = model(`NormalizeRecursive${recursive}`, schema);
            const value = {
                leaf: {
                    amount: '1.23',
                    secret: 'hidden',
                },
            };

            const result = new TestModel({
                child: value,
                children: [value],
                dictionary: { first: value },
            }).toJSON<Record<string, any>>();

            const children = [
                result.child,
                result.children?.[0],
                result.dictionary?.first,
            ];

            for (const entry of children) {
                if (recursive === false) {
                    expect(entry?.leaf?.secret).toBe('hidden');
                    expect(entry?.leaf?.amount).toBeInstanceOf(Types.Decimal128);
                    expect(entry?.leaf?._id).toBeInstanceOf(Types.ObjectId);
                } else {
                    expect(entry?.leaf).not.toHaveProperty('secret');
                    expect(entry?.leaf?.amount).toBe('1.23');
                    expect(typeof entry?.leaf?._id).toBe('string');
                    expect(entry?.leaf).not.toHaveProperty('id');
                }
            }
        });
    }

    it('does not rewrap shared child schemas or overwrite their first options', ({ expect }) => {
        const originalTransform = vi.fn((_doc, ret) => ret);
        const child = new Schema({}, { toJSON: { transform: originalTransform } });
        child.plugin(mongooseNormalizePlugin, { convertIdField: false });
        const transform = child.get('toJSON')?.transform;
        const schema = new Schema({
            left: child,
            right: child,
        });

        schema.plugin(mongooseNormalizePlugin);
        const rootTransform = schema.get('toJSON')?.transform;
        schema.plugin(mongooseNormalizePlugin, { convertIdField: false });
        expect(schema.get('toJSON')?.transform).toBe(rootTransform);
        expect(child.get('toJSON')?.transform).toBe(transform);
        const TestModel = model('NormalizeSharedChildren', schema);
        const result = new TestModel({
            left: {},
            right: {},
        }).toJSON<Record<string, any>>();

        expect(typeof result.left?._id).toBe('string');
        expect(typeof result.right?._id).toBe('string');
        expect(result.left).not.toHaveProperty('id');
        expect(result.right).not.toHaveProperty('id');
        expect(originalTransform).toHaveBeenCalledTimes(2);
    });
});
