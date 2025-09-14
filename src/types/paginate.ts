import type {
    FilterQuery,
    mongo,
    PaginateOptions,
    Schema,
} from 'mongoose';

import type { IfElse } from './utils';

declare module 'mongoose' {
    type PaginateDocument<
        T,
        TMethods,
        TQueryHelpers,
        O extends PaginateOptions = object,
    > = IfElse<
        O['lean'],
        IfElse<
            O['leanWithId'],
            T & { id: string },
            IfElse<
                O['leanWithVirtuals'],
                T & { [key: string]: any },
                T
            >
        >,
        HydratedDocument<T, TMethods, TQueryHelpers>
    >;

    interface PaginateCustomLabels<T = boolean | string | undefined> {
        docs?: T;
        hasNextPage?: T;
        hasPrevPage?: T;
        limit?: T;
        meta?: T;
        nextPage?: T;
        page?: T;
        pagingCounter?: T;
        prevPage?: T;
        totalDocs?: T;
        totalPages?: T;
    }

    interface PaginateModel<T, TQueryHelpers = object, TMethods = object> extends Model<T, TQueryHelpers, TMethods> {
        paginate: {
            <O extends PaginateOptions>(
                query?: FilterQuery<T>,
                options?: O,
                callback?: (err: any, result: PaginateResult<PaginateDocument<T, TMethods, TQueryHelpers, O>>) => void
            ): Promise<PaginateResult<PaginateDocument<T, TMethods, TQueryHelpers, O>>>;

            <UserType = T, O extends PaginateOptions = PaginateOptions>(
                query?: FilterQuery<T>,
                options?: O,
                callback?: (
                    err: any,
                    result: PaginateResult<PaginateDocument<UserType, TMethods, TQueryHelpers, O>>
                ) => void
            ): Promise<PaginateResult<PaginateDocument<UserType, TMethods, TQueryHelpers, O>>>;

            <UserType = T>(
                query?: FilterQuery<T>,
                options?: PaginateOptions,
                callback?: (
                    err: any,
                    result: PaginateResult<PaginateDocument<UserType, TMethods, TQueryHelpers, PaginateOptions>>
                ) => void
            ): Promise<PaginateResult<PaginateDocument<UserType, TMethods, TQueryHelpers, PaginateOptions>>>;
        };
    }

    interface PaginateOptions {
        allowDiskUse?: boolean;
        collation?: mongo.CollationOptions;
        customLabels?: PaginateCustomLabels;
        forceCountFn?: boolean;
        lean?: boolean;
        leanWithId?: boolean;
        leanWithVirtuals?: boolean;
        limit?: number;
        offset?: number;
        options?: QueryOptions;
        page?: number;

        /**
         *  If pagination is set to `false`, it will return all docs without adding limit condition.
         *
         * @default true
         */
        pagination?: boolean;
        populate?: PopulateOptions | PopulateOptions[] | string | string[];
        projection?: any;
        read?: PaginateReadOptions;
        select?: object | string;
        sort?: object | string;
        useCustomCountFn?: () => Promise<number>;
        useEstimatedCount?: boolean;
    }

    interface PaginateReadOptions {
        pref: string;
        tags?: any[];
    }

    interface PaginateResult<T> {
        [customLabel: string]: boolean | null | number | T[] | undefined;
        docs: T[];
        hasNextPage: boolean;
        hasPrevPage: boolean;
        limit: number;
        meta?: any;
        nextPage?: null | number;
        offset: number;
        page?: number;
        pagingCounter: number;
        prevPage?: null | number;
        totalDocs: number;
        totalPages: number;
    }

    // @ts-expect-error Ignore this error.
    interface Query<
        ResultType,
        DocType,
        THelpers = NonNullable<unknown>,
        RawDocType = DocType,
        _QueryOp = 'find',
        TInstanceMethods = Record<string, never>,
    > {
        paginate: {
            <O extends PaginateOptions>(options?: O): Promise<
                PaginateResult<PaginateDocument<RawDocType, TInstanceMethods, THelpers, O>>
            >;

            <UserType = ResultType, O extends PaginateOptions = PaginateOptions>(options?: O): Promise<
                PaginateResult<PaginateDocument<UserType, TInstanceMethods, THelpers, O>>
            >;

            <UserType = ResultType>(options?: PaginateOptions): Promise<
                PaginateResult<PaginateDocument<UserType, TInstanceMethods, THelpers, PaginateOptions>>
            >;
        };
    }

    interface SubDocumentPagingOptions {
        limit?: number;
        page?: number;
        populate?: PopulateOptions | PopulateOptions[] | string | string[];
    }

    interface SubPaginateOptions {
        pagination?: boolean;
        pagingOptions?: SubDocumentPagingOptions;
        populate?: PopulateOptions | PopulateOptions[] | string | string[];
        read?: PaginateReadOptions;
        select?: object | string;
    }
}

declare function _(schema: Schema): void;

// eslint-disable-next-line ts/no-namespace
declare namespace _ {
    const paginate: { options: PaginateOptions };
    const paginateSubDocs: { options: PaginateOptions };

    class PaginationParameters<T, O extends PaginateOptions> {
        constructor(request: { query?: Record<string, any> });
        get: () => [FilterQuery<T>, O];
        getOptions: () => O;
        getQuery: () => FilterQuery<T>;
    }
}

export type _LoadPaginateTypes = unknown;

export default _;
