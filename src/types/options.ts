import type {
    Connection,
    Schema,
    SchemaTimestampsConfig,
} from 'mongoose';

import type { MongooseNormalizePluginOptions } from '../plugins/normalize';

import type { BaseMongoosePaginateModel } from './';

export interface BuildMongooseModelOptions {
    connection?: Connection;
    enableNormalizePlugin?: boolean;
    normalizePluginOptions?: MongooseNormalizePluginOptions;
    normalizePluginRecursive?: boolean;
    timestamps?: boolean | SchemaTimestampsConfig;
}

export interface CustomMongooseOptions {
    beforeModelBuild?: <
        DocType,
        Model extends BaseMongoosePaginateModel<DocType, InstanceMethodsAndOverrides, QueryHelpers>,
        InstanceMethodsAndOverrides = object,
        QueryHelpers = object,
    >(
        schema: Schema<
            DocType,
            Model,
            InstanceMethodsAndOverrides,
            QueryHelpers
        >
    ) => void;
}
