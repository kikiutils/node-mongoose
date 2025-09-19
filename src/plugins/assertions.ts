import type {
    mongo,
    MongooseUpdateQueryOptions,
    QueryOptions,
    RootFilterQuery,
    Schema,
    UpdateQuery,
    UpdateWithAggregationPipeline,
} from 'mongoose';

import { assertMongooseUpdateSuccess } from '../assertions';

declare module 'mongoose' {
    interface Document<
        T = unknown,
        TQueryHelpers = any,
        DocType = any,
        TVirtuals = Record<string, any>,
        // eslint-disable-next-line ts/no-empty-object-type
        TSchemaOptions = {},
    > {
        assertUpdateSuccess: (
            update?:
              | UpdateQuery<Document<T, TQueryHelpers, DocType, TVirtuals, TSchemaOptions>>
              | UpdateWithAggregationPipeline,
            options?: null | QueryOptions,
            expectedModifiedCount?: number,
        ) => Promise<void>;
    }

    interface Model<
        TRawDocType,
        // eslint-disable-next-line ts/no-empty-object-type
        TQueryHelpers = {},
        // eslint-disable-next-line ts/no-empty-object-type
        TInstanceMethods = {},
        // eslint-disable-next-line ts/no-empty-object-type
        TVirtuals = {},
        // eslint-disable-next-line unused-imports/no-unused-vars
        THydratedDocumentType = HydratedDocument<TRawDocType, TInstanceMethods & TVirtuals, TQueryHelpers, TVirtuals>,
        // eslint-disable-next-line unused-imports/no-unused-vars
        TSchema = any,
    > {
        assertUpdateSuccess: (
            filter: RootFilterQuery<TRawDocType>,
            update: UpdateQuery<TRawDocType> | UpdateWithAggregationPipeline,
            options?: (mongo.UpdateOptions & MongooseUpdateQueryOptions<TRawDocType>) | null,
            expectedModifiedCount?: number,
        ) => Promise<void>;
    }
}

export function mongooseAssertionsPlugin<S extends Schema>(schema: S) {
    schema.method(
        'assertUpdateSuccess',
        function (
            update?: UpdateQuery<any> | UpdateWithAggregationPipeline,
            options?: null | QueryOptions,
            expectedModifiedCount?: number,
        ) {
            return assertMongooseUpdateSuccess(this.updateOne(update, options), expectedModifiedCount);
        },
    );

    schema.static(
        'assertUpdateSuccess',
        function (
            filter: RootFilterQuery<any>,
            update: UpdateQuery<any> | UpdateWithAggregationPipeline,
            options?: (mongo.UpdateOptions & MongooseUpdateQueryOptions<any>) | null,
            expectedModifiedCount: number = 1,
        ) {
            return assertMongooseUpdateSuccess(
                expectedModifiedCount === 1
                    ? this.updateOne(filter, update, options)
                    : this.updateMany(filter, update, options),
                expectedModifiedCount,
            );
        },
    );
}
