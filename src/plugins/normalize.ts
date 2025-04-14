import lodashGet from 'lodash/get.js';
import lodashSet from 'lodash/set.js';
import lodashUnset from 'lodash/unset.js';
import { Types } from 'mongoose';
import type { Schema } from 'mongoose';

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
export function mongooseNormalizePlugin<S extends Schema>(schema: S) {
    const toJson = schema.get('toJSON');
    const toJsonTransform = toJson?.transform;
    schema.set(
        'toJSON',
        {
            ...toJson,
            transform(doc: any, ret: any, options: any) {
                // eslint-disable-next-line style/object-curly-newline
                const { __v, _id, ...copiedRet } = ret;
                copiedRet.id = _id instanceof Types.ObjectId ? _id.toHexString() : _id;
                for (const path in schema.paths) {
                    if (schema.paths[path]?.options?.private) lodashUnset(copiedRet, path);
                    if (schema.paths[path]?.instance === 'Decimal128') {
                        const value: Types.Decimal128 | undefined = lodashGet(copiedRet, path);
                        if (value) lodashSet(copiedRet, path, value.toString());
                    }
                }

                if (toJsonTransform && typeof toJsonTransform !== 'boolean') {
                    return toJsonTransform(doc, copiedRet, options);
                }

                return copiedRet;
            },
        },
    );
}
