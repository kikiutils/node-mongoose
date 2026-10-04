import type {
    HydratedDocument,
    QueryWithHelpers,
    Types,
} from 'mongoose';
import type { SetFieldType } from 'type-fest';

import type { AggregatePaginateModel } from './aggregate-paginate';
import type { PaginateModel } from './paginate';

export type BaseMongooseDocType<T, CreatedAtField extends boolean = true, UpdatedAtField extends boolean = true> =
  & (CreatedAtField extends true ? { createdAt: Date } : unknown)
  & Omit<T, 'createdAt' | 'id' | 'updatedAt'>
  & (UpdatedAtField extends true ? { updatedAt: Date } : unknown);

export type BaseMongoosePaginateModel<RawDocType, InstanceMethodsAndOverrides = object, QueryHelpers = object> =
  & AggregatePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>
  & BaseMongooseModelStatics<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>
  & PaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>;

export type ExceptMongooseTimestampAndOtherFields<T, K extends keyof T> = Omit<T, 'createdAt' | 'updatedAt' | K>;
export type MongooseDocumentOrObjectId<D> = D | string | Types.ObjectId;
export type MongooseFindOneReturnType<
    RawDocType,
    DocType,
    QueryHelpers = object,
    InstanceMethodsAndOverrides = object,
> = QueryWithHelpers<
        DocType | null,
        DocType,
        QueryHelpers,
        RawDocType,
        'findOne',
        InstanceMethodsAndOverrides
>;

export type MongooseHydratedDocument<
    DocType,
    InstanceMethodsAndOverrides = object,
    QueryHelpers = object,
> = HydratedDocument<
    DocType,
    InstanceMethodsAndOverrides,
    QueryHelpers
>;

export type OmitMongooseTimestampAndOtherFields<T, K extends number | string | symbol = never> = Omit<
    T,
    'createdAt' | 'updatedAt' | K
>;

export type SetFieldsToObjectId<T, K extends keyof T> = SetFieldType<T, K, Types.ObjectId>;

// @ts-expect-error Ignore this error.
// eslint-disable-next-line unused-imports/no-unused-vars
export interface BaseMongooseModelStatics<RawDocType, InstanceMethodsAndOverrides = object, QueryHelpers = object> {}
