import type {
    QueryOptions,
    Schema,
    UpdateQuery,
    UpdateWithAggregationPipeline,
} from 'mongoose';

import { assertMongooseUpdateSuccess } from '../assertions';

declare module 'mongoose' {
    export interface Document<
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
}
