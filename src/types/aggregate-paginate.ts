//
// Based on type declarations for mongoose-paginate-v2 1.3.
//
// Thanks to knyuwork <https://github.com/knyuwork>
// and LiRen Tu <https://github.com/tuliren> for their contribution
// Used with mongoose-paginate, redefined and renamed here to avoid conflicts.

import type {
    AggregatePaginateOptions,
    Schema,
} from 'mongoose';

declare module 'mongoose' {
    type PrePaginatePipelineStage = '__PREPAGINATE__' | PipelineStage;

    interface AggregateCustomLabels<T = boolean | string | undefined> {
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

    interface AggregatePaginateModel<
        RawDocType,
        QueryHelpers = object,
        InstanceMethodsAndOverrides = object,
    > extends Model<RawDocType, QueryHelpers, InstanceMethodsAndOverrides> {
        aggregatePaginate: <T>(
            query?: Aggregate<T[]> | PrePaginatePipelineStage[],
            options?: AggregatePaginateOptions,
            callback?: (err: any, result: AggregatePaginateResult<T>) => void,
        ) => Promise<AggregatePaginateResult<T>>;
    }

    interface AggregatePaginateOptions {
        allowDiskUse?: boolean;
        countQuery?: object;
        customLabels?: AggregateCustomLabels;
        limit?: number;
        offset?: number;
        page?: number;

        /**
         *  If pagination is set to `false`, it will return all docs without adding limit condition.
         *
         * @default true
         */
        pagination?: boolean;
        sort?: object | string;
        useFacet?: boolean;
    }

    interface AggregatePaginateQueryPopulateOptions {
        /** optional query conditions to match */
        match?: any;
        /** optional model to use for population */
        model?: Model<any> | string;
        /** optional query options like sort, limit, etc */
        options?: any;
        /** space delimited path(s) to populate */
        path: string;
        /** deep populate */
        populate?: AggregatePaginateQueryPopulateOptions | AggregatePaginateQueryPopulateOptions[];
        /** optional fields to select */
        select?: any;
    }

    interface AggregatePaginateResult<T> {
        [customLabel: string]: boolean | null | number | T[] | undefined;
        docs: T[];
        hasNextPage: boolean;
        hasPrevPage: boolean;
        limit: number;
        meta?: any;
        nextPage?: null | number;
        page?: number;
        pagingCounter: number;
        prevPage?: null | number;
        totalDocs: number;
        totalPages: number;
    }
}

declare function mongooseAggregatePaginate(schema: Schema): void;

// eslint-disable-next-line ts/no-namespace
declare namespace mongooseAggregatePaginate {
    const PREPAGINATION_PLACEHOLDER: string;
}

// eslint-disable-next-line ts/no-namespace
declare namespace _ {
    const aggregatePaginate: { options: AggregatePaginateOptions };
}

export type DoNotRemoveOrUseThisType = unknown;

export default mongooseAggregatePaginate;
