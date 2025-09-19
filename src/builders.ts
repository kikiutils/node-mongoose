import mongoose from 'mongoose';
import type { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import mongoosePaginate from 'mongoose-paginate-v2';

import { customMongooseOptions } from './_internals';
import { mongooseConnections } from './constants';
import { mongooseNormalizePlugin } from './plugins/normalize';
import type { MongooseNormalizePluginOptions } from './plugins/normalize';
import type { BaseMongoosePaginateModel } from './types';
import type { BuildMongooseModelOptions } from './types/options';

export function buildMongooseModel<
    DocType,
    Model extends BaseMongoosePaginateModel<DocType, InstanceMethodsAndOverrides, QueryHelpers>,
    InstanceMethodsAndOverrides = object,
    QueryHelpers = object,
>(
    collection: string,
    name: string,
    schema: Schema<DocType, Model, InstanceMethodsAndOverrides, QueryHelpers>,
    options?: BuildMongooseModelOptions,
): Model {
    if (options?.enableNormalizePlugin !== false) {
        registerMongooseNormalizePlugin(schema, options?.normalizePluginRecursive, options?.normalizePluginOptions);
    }

    schema.plugin(mongooseAggregatePaginate);
    schema.plugin(mongoosePaginate);
    schema.set('timestamps', options?.timestamps ?? schema.get('timestamps') ?? true);
    customMongooseOptions.beforeModelBuild?.(schema);
    const connection =
        options?.connection
        || (
            mongooseConnections.default ||= mongoose.createConnection(
                process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017',
            )
        );

    return connection.model<DocType, Model, QueryHelpers>(name, schema, collection);
}
export function registerMongooseNormalizePlugin<
    DocType,
    Model extends BaseMongoosePaginateModel<DocType, InstanceMethodsAndOverrides, QueryHelpers>,
    InstanceMethodsAndOverrides = object,
    QueryHelpers = object,
>(
    schema: Schema<DocType, Model, InstanceMethodsAndOverrides, QueryHelpers>,
    recursive: boolean = true,
    options?: MongooseNormalizePluginOptions,
) {
    schema.plugin(mongooseNormalizePlugin, options);
    if (recursive) {
        schema.childSchemas.forEach(({ schema }) => registerMongooseNormalizePlugin(schema, recursive, options));
    }
}
