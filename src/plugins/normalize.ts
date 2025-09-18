import {
    get as getProp,
    set as setProp,
    unset as unsetProp,
} from 'es-toolkit/compat';
import { Types } from 'mongoose';
import type { Schema } from 'mongoose';

export interface MongooseNormalizePluginOptions {
    /**
     * Whether to convert `_id` field to `id`.
     * If true, the `_id` field will be replaced with `id`.
     *
     * @default true
     */
    convertIdField?: boolean;

    /**
     * Whether to convert the `_id` field to a hex string if it's an ObjectId.
     *
     * @default true
     */
    toHexIdIfObjectId?: boolean;
}

/**
 * Mongoose plugin to normalize the JSON output of documents.
 *
 * This plugin modifies the `toJSON` method of Mongoose schemas to:
 * - Add an `id` field equal to the string representation of `_id`
 * - Remove the `_id` field
 * - Exclude fields marked as `private` from the JSON output
 * - Convert `Decimal128` fields to strings
 * - Remove the `__v` version key
 *
 * @template S - The type of the schema.
 *
 * @param schema - The Mongoose schema to apply the plugin to.
 */
export function mongooseNormalizePlugin<S extends Schema>(
    schema: S,
    pluginOptions?: MongooseNormalizePluginOptions,
) {
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
                    return toJsonTransform(doc as any, copiedRet as any, options as any);
                }

                // Return normalized object
                return copiedRet;
            },
        },
    );
}
