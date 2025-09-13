import mongoose, { Types } from 'mongoose';
import type {
    mongo,
    Schema,
} from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import mongoosePaginate from 'mongoose-paginate-v2';

import { customMongooseOptions } from './_internals';
import { mongooseConnections } from './constants';
import type { setCustomMongooseOptions } from './options';
import { mongooseNormalizePlugin } from './plugins/normalize';
import type { BuildMongooseModelOptions } from './types/options';

export type DoNotRemoveOrUseThisType = typeof setCustomMongooseOptions;

/**
 * Asserts that a Mongoose update operation was successful by checking that it was acknowledged
 * and that at least the expected number of documents were modified.
 *
 * This function is intended for use with `updateOne`, `updateMany`, or any update operation
 * that returns a MongoDB `UpdateResult`.
 *
 * @template T - The shape of the document being updated.
 * @param updatePromise - A promise returned from a Mongoose update operation.
 * @param expectedModifiedCount - The minimum number of documents expected to be modified. Defaults to 1.
 * @throws Will throw an error if:
 *   - The operation was not acknowledged by MongoDB,
 *   - Fewer documents were modified than expected.
 */
export async function assertMongooseUpdateSuccess<T extends mongo.BSON.Document>(
    updatePromise: Promise<mongo.UpdateResult<T>>,
    expectedModifiedCount = 1,
): Promise<void> {
    const updateResult = await updatePromise;
    if (!updateResult.acknowledged) throw new Error('Update was not acknowledged');
    if (updateResult.modifiedCount < expectedModifiedCount) {
        // eslint-disable-next-line style/max-len
        throw new Error(`Expected to modify at least ${expectedModifiedCount} document(s), but modified ${updateResult.modifiedCount}`);
    }
}

/**
 * Builds and returns a Mongoose model with specified schema and options.
 *
 * This function sets up a Mongoose model with optional plugins and timestamp settings.
 * It can optionally use a specified connection or the default connection.
 *
 * Determine the connection to use:
 * 1. Use the connection provided in the options, if available.
 * 2. Otherwise, use the default connection stored in `mongooseConnections`.
 * 3. If there's no default connection, create one using the MongoDB URI from the environment variables,
 *    or fallback to a local MongoDB instance.
 *
 * You can set a function to be executed before the final build by using {@link setCustomMongooseOptions}.
 * However, ensure that this option is configured before calling {@link buildMongooseModel}.
 *
 * @template DocType - The type of the document.
 * @template Model - The type of the model, which extends `BaseMongoosePaginateModel`.
 * @template InstanceMethodsAndOverrides - The type for instance methods and overrides.
 * @template QueryHelpers - The type for additional query helpers.
 *
 * @param collection - The name of the collection.
 * @param name - The name of the model.
 * @param schema - The Mongoose schema to use for the model.
 * @param options - Optional settings for building the model.
 *
 * @returns The created Mongoose model.
 */
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
        schema.plugin(mongooseNormalizePlugin, options?.normalizePluginOptions);
    }

    schema.plugin(mongooseAggregatePaginate);
    schema.plugin(mongoosePaginate);
    schema.set('timestamps', options?.timestamps ?? schema.get('timestamps') ?? true);
    customMongooseOptions.beforeModelBuild?.(schema);
    // eslint-disable-next-line style/max-len
    const connection = options?.connection || (mongooseConnections.default ||= mongoose.createConnection(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'));
    return connection.model<DocType, Model, QueryHelpers>(name, schema, collection);
}

/**
 * Converts a document or ObjectId to a document using the specified model.
 *
 * This function takes a document or ObjectId and returns the corresponding document
 * from the database using the specified model. Optionally, specific fields can be selected.
 *
 * @template D - The type of the hydrated document.
 * @template DocType - The type of the document.
 * @template InstanceMethodsAndOverrides - The type for instance methods and overrides.
 * @template QueryHelpers - The type for additional query helpers.
 *
 * @param documentOrObjectId - The document or ObjectId to convert.
 * @param model - The Mongoose model to use for the conversion.
 * @param selectFields - Optional fields to select from the document.
 *
 * @returns The corresponding document or null if not found.
 */
export async function mongooseDocumentOrObjectIdToDocument<
    D extends MongooseHydratedDocument<DocType, InstanceMethodsAndOverrides, QueryHelpers>,
    DocType,
    InstanceMethodsAndOverrides,
    QueryHelpers,
>(
    documentOrObjectId: MongooseDocumentOrObjectId<D>,
    model: BaseMongoosePaginateModel<DocType, InstanceMethodsAndOverrides, QueryHelpers>,
    selectFields?: string[],
): Promise<D | null> {
    if (typeof documentOrObjectId === 'string' || documentOrObjectId instanceof Types.ObjectId) {
        return (await model.findById(documentOrObjectId).select(selectFields || [])) as D | null;
    }

    return documentOrObjectId;
}

/**
 * Converts the input, which can be a MongoDB ObjectId or a string,
 * into a 24-character hexadecimal string representation of the ObjectId.
 *
 * @param {string | Types.ObjectId} id - The ObjectId instance or its string representation
 *
 * @returns {string} The hexadecimal string representation of the ObjectId
 */
export function toObjectIdHexString(id: string | Types.ObjectId): string {
    return id instanceof Types.ObjectId ? id.toHexString() : id;
}
