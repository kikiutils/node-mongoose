import type {
    Connection,
    Schema,
    SchemaTimestampsConfig,
} from 'mongoose';

import type { MongooseNormalizePluginOptions } from '../plugins/normalize';
import type { buildMongooseModel } from '../utils';

export type DoNotRemoveOrUseThisType = typeof buildMongooseModel;

/**
 * Interface for options used when building a Mongoose model.
 *
 * This interface defines the optional configuration settings that can be provided
 * when creating a Mongoose model. It includes options for specifying the database
 * connection, enabling the normalize plugin, and configuring timestamp fields.
 */
export interface BuildMongooseModelOptions {
    /**
     * The Mongoose connection to be used for the model.
     *
     * This is an optional setting that allows specifying a custom connection
     * for the model.
     */
    connection?: Connection;

    /**
     * Flag to enable or disable the normalize plugin.
     *
     * This flag indicates whether the normalize plugin should be enabled.
     * The default value is `true`.
     *
     * @default true
     */
    enableNormalizePlugin?: boolean;

    /**
     * Options for the normalize plugin.
     */
    normalizePluginOptions?: MongooseNormalizePluginOptions;

    /**
     * Whether to recursively register the normalize plugin on child schemas.
     *
     * If `true`, the plugin will be automatically applied to all nested schemas.
     * If `false`, only the root schema will be affected.
     *
     * @default true
     */
    normalizePluginRecursive?: boolean;

    /**
     * Configures Mongoose timestamps.
     *
     * This option enables or disables timestamps, or allows specifying a
     * custom timestamp configuration via {@link SchemaTimestampsConfig}.
     *
     * - If `timestamps` is explicitly set, it will be used.
     * - If `timestamps` is not provided, the schema's existing setting is used.
     * - If the schema has no existing setting, `true` is the default value.
     *
     * @default true
     */
    timestamps?: boolean | SchemaTimestampsConfig;
}

export interface CustomMongooseOptions {
    /**
     * A function that will be executed before the final build when using {@link buildMongooseModel}.
     */
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
