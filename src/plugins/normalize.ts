import {
    get as getProp,
    set as setProp,
    unset as unsetProp,
} from 'es-toolkit/compat';
import { Types } from 'mongoose';
import type { Schema } from 'mongoose';

export interface MongooseNormalizePluginOptions {
    /**
     * Whether to move the serialized `_id` value to `id`.
     *
     * @remarks
     * If `false`, preserves the value under `_id` instead. Only values other than `undefined` are copied.
     *
     * @defaultValue `true`.
     */
    convertIdField?: boolean;

    /** Register normalization on child schemas too. Defaults to true. */
    recursive?: boolean;

    /**
     * Whether to convert a serialized `ObjectId` identifier to its hexadecimal string.
     *
     * @remarks
     * Applies before choosing the `id` or `_id` output key. Identifiers of other types are unchanged.
     *
     * @defaultValue `true`.
     */
    toHexIdIfObjectId?: boolean;
}

// Constants/Variables
const registeredSchemas = new WeakSet<Schema>();

// Functions

/**
 * Registers JSON normalization on a Mongoose schema.
 *
 * @remarks
 * Mutates the schema's `toJSON` configuration while preserving its other options. The transform removes `__v`,
 * normalizes `_id` according to the plugin options, removes schema paths marked `private`, and converts
 * truthy serialized values at registered `Decimal128` paths to strings.
 *
 * If an existing transform is a function, invokes it after normalization. If it returns `undefined`,
 * preserves the normalized output and any mutations made by that transform; otherwise, uses its return value.
 * That transform can change the normalized output, and its errors propagate during serialization.
 * Registers itself on child schemas unless `recursive` is false. Does not configure `toObject`.
 * Registration is idempotent per schema; the first registration's options take precedence.
 *
 * @param schema - The schema whose JSON serialization configuration is modified.
 * @param pluginOptions - The normalization and registration options; omitted options use their documented defaults.
 */
export function mongooseNormalizePlugin<S extends Schema>(
    schema: S,
    pluginOptions?: MongooseNormalizePluginOptions,
) {
    if (registeredSchemas.has(schema)) return;
    registeredSchemas.add(schema);

    // Collect special paths (Decimal128 & private)
    const decimalPaths: string[] = [];
    const privatePaths: string[] = [];
    for (const [path, schemaType] of Object.entries(schema.paths)) {
        if (schemaType?.options?.private) privatePaths.push(path);
        else if (schemaType?.instance === 'Decimal128') decimalPaths.push(path);
    }

    // Get original toJSON configuration
    const toJson = schema.get('toJSON');
    const toJsonTransform = toJson?.transform;

    // Override toJSON with custom transform
    schema.set(
        'toJSON',
        {
            ...toJson,
            transform(doc, ret, options) {
                // Copy object and remove __v
                const copiedRet = { ...ret };
                // @ts-expect-error Ignore this error
                delete copiedRet.__v;

                // Normalize _id (convert to hex and/or move to id)
                let _id = copiedRet._id;
                delete copiedRet._id;
                if (pluginOptions?.toHexIdIfObjectId !== false && _id instanceof Types.ObjectId) {
                    _id = _id.toHexString();
                }

                if (_id !== undefined) {
                    if (pluginOptions?.convertIdField !== false) copiedRet.id = _id;
                    else copiedRet._id = _id;
                }

                // Remove private fields
                for (const path of privatePaths) unsetProp(copiedRet, path);

                // Convert Decimal128 fields to string
                for (const path of decimalPaths) {
                    const value = getProp(copiedRet, path) as Types.Decimal128 | undefined;
                    if (value) setProp(copiedRet, path, value.toString());
                }

                // Run original toJSON transform
                if (toJsonTransform && typeof toJsonTransform !== 'boolean') {
                    const transformed = toJsonTransform(doc as any, copiedRet as any, options as any);
                    return transformed === undefined ? copiedRet : transformed;
                }

                // Return normalized object
                return copiedRet;
            },
        },
    );

    if (pluginOptions?.recursive !== false) {
        schema.childSchemas.forEach(({ schema: child }) => child.plugin(mongooseNormalizePlugin, pluginOptions));
    }
}
