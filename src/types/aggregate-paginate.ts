//
// Based on type declarations for mongoose-paginate-v2 1.3.
//
// Thanks to knyuwork <https://github.com/knyuwork>
// and LiRen Tu <https://github.com/tuliren> for their contribution
// Used with mongoose-paginate, redefined and renamed here to avoid conflicts.

import type {
    Aggregate,
    Model,
    PipelineStage,
    Schema,
} from 'mongoose';

type PrePaginatePipelineStage = '__PREPAGINATE__' | PipelineStage;

export interface AggregateCustomLabels<T = boolean | string | undefined> {
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

export interface AggregatePaginateModel<
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

export interface AggregatePaginateOptions {
    allowDiskUse?: boolean;
    countQuery?: object;
    customLabels?: AggregateCustomLabels;
    limit?: number;
    offset?: number;
    page?: number;

    /**
     * Whether to apply pagination to the aggregation results.
     *
     * @remarks
     * If `false`, the pagination plugin adds no pagination `$skip` or `$limit` stages. Existing pipeline stages
     * still apply.
     *
     * @defaultValue `true`, unless overridden by plugin-wide defaults.
     */
    pagination?: boolean;
    sort?: object | string;
    useFacet?: boolean;
}

export interface AggregatePaginateQueryPopulateOptions {
    /**
     * The query conditions used to filter populated documents.
     */
    match?: any;

    /**
     * The model or model name used to populate the referenced documents.
     */
    model?: Model<any> | string;

    /**
     * The query options applied when retrieving populated documents, such as sorting and limits.
     */
    options?: any;

    /**
     * The path or space-delimited paths to populate.
     */
    path: string;

    /**
     * The nested population options applied to the populated documents.
     */
    populate?: AggregatePaginateQueryPopulateOptions | AggregatePaginateQueryPopulateOptions[];

    /**
     * The field projection used when retrieving populated documents.
     */
    select?: any;
}

export interface AggregatePaginateResult<T> {
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

declare function _(schema: Schema): void;

export default _;
