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
    const toJson = schema.get('toJSON');
    const toJsonTransform = toJson?.transform;
    schema.set(
        'toJSON',
        {
            ...toJson,
            transform(doc, ret, options) {
                // eslint-disable-next-line style/object-curly-newline
                let { __v, _id, ...copiedRet } = ret;
                if (pluginOptions?.toHexIdIfObjectId !== false) {
                    _id = _id instanceof Types.ObjectId ? _id.toHexString() : _id;
                }

                if (_id !== undefined) {
                    if (pluginOptions?.convertIdField !== false) copiedRet.id = _id;
                    else copiedRet._id = _id;
                }

                // console.log(schema.childSchemas[0]?.schema.childSchemas);
                for (const path in schema.paths) {
                    if (schema.paths[path]?.options?.private) {
                        unsetProp(copiedRet, path);
                        continue;
                    }

                    if (schema.paths[path]?.instance === 'Decimal128') {
                        const value = getProp(copiedRet, path) as Types.Decimal128 | undefined;
                        if (value) setProp(copiedRet, path, value.toString());
                    }
                }

                if (toJsonTransform && typeof toJsonTransform !== 'boolean') {
                    return toJsonTransform(doc as any, copiedRet as any, options as any);
                }

                return copiedRet;
            },
        },
    );
}
