import type {
    Connection,
    ConnectOptions,
    Schema,
    SchemaTimestampsConfig,
} from 'mongoose';

import type { MongooseLeanDecimal128ToStringPluginOptions } from '../plugins/lean-decimal128-to-string';
import type { MongooseNormalizePluginOptions } from '../plugins/normalize';

import type { BaseMongoosePaginateModel } from './';

export interface BuildMongooseModelOptions {
    connection?: Connection;
    plugins?: {
        /** Register lean conversion for marked Decimal128 fields. Defaults to true. */
        leanDecimal128ToString?: boolean | MongooseLeanDecimal128ToStringPluginOptions;

        /** Register JSON normalization. Defaults to true; an object enables it with custom options. */
        normalize?: boolean | MongooseNormalizePluginOptions;
    };

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
        >,
    ) => void;

    defaultConnectionOptions?: ConnectOptions;
}
