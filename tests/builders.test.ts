import {
    connection,
    deleteModel,
    Schema,
    Types,
} from 'mongoose';
import {
    afterEach,
    describe,
    it,
} from 'vitest';

import { buildMongooseModel } from '../src/builders';
import type { BaseMongoosePaginateModel } from '../src/types';

let modelIndex = 0;

describe('buildMongooseModel plugin options', () => {
    afterEach(() => deleteModel(/^PluginOptions/));

    for (
        const normalizePlugin of [
            undefined,
            true,
            false,
            {},
            { convertIdField: false },
        ]
    ) {
        it(`accepts normalizePlugin=${JSON.stringify(normalizePlugin)}`, ({ expect }) => {
            const schema = new Schema<any, BaseMongoosePaginateModel<any>>(
                { name: String },
                {
                    autoCreate: false,
                    autoIndex: false,
                    bufferCommands: false,
                },
            );

            const TestModel = buildMongooseModel(
                'plugin_options',
                `PluginOptions${modelIndex++}`,
                schema,
                {
                    connection,
                    plugins: { normalize: normalizePlugin },
                    timestamps: false,
                },
            );

            const _id = new Types.ObjectId();
            const result = new TestModel({
                _id,
                name: 'name',
            }).toJSON();

            if (normalizePlugin === false) {
                expect(result._id).toEqual(_id);
                expect(result).not.toHaveProperty('id');
            } else if (typeof normalizePlugin === 'object' && normalizePlugin.convertIdField === false) {
                expect(result._id).toBe(_id.toHexString());
                expect(result).not.toHaveProperty('id');
            } else {
                expect(result.id).toBe(_id.toHexString());
                expect(result).not.toHaveProperty('_id');
            }
        });
    }

    for (
        const recursive of [
            undefined,
            true,
            false,
        ]
    ) {
        it(`preserves plugins.normalize.recursive=${recursive}`, ({ expect }) => {
            const child = new Schema({ name: String });
            const schema = new Schema<any, BaseMongoosePaginateModel<any>>(
                { child },
                {
                    autoCreate: false,
                    autoIndex: false,
                    bufferCommands: false,
                },
            );

            const TestModel = buildMongooseModel(
                'plugin_options',
                `PluginOptions${modelIndex++}`,
                schema,
                {
                    connection,
                    plugins: {
                        normalize: {
                            recursive,
                            toHexIdIfObjectId: false,
                        },
                    },
                    timestamps: false,
                },
            );

            const _id = new Types.ObjectId();
            const result = new TestModel({ child: { _id } }).toJSON();
            if (recursive === false) expect(result.child._id).toEqual(_id);
            else {
                expect(result.child.id).toEqual(_id);
                expect(result.child).not.toHaveProperty('_id');
            }
        });
    }
});
