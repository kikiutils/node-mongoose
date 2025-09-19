import { Schema } from 'mongoose';
import type {
    DefaultType,
    IndexDirection,
    IndexOptions,
    Types,
} from 'mongoose';
import type { Merge } from 'type-fest';

import type { Readonlyable } from '../types/_internals';

import { createBaseSchemaBuilderFactory } from './base';

export type ExtendObjectIdSchemaBuilder<
    Props extends BaseProps,
    ExtraOmitFields extends string,
> = Omit<
    ObjectIdSchemaBuilder<Props, ExtraOmitFields>,
    ExtraOmitFields | keyof Props
>;

interface BaseProps {
    type: typeof Schema.Types.ObjectId;
}

export interface ObjectIdSchemaBuilder<
    Props extends { type: typeof Schema.Types.ObjectId } = { type: typeof Schema.Types.ObjectId },
    ExtraOmitFields extends string = never,
> {
    default: <
        T extends ((this: any, doc: any) => DefaultType<D>) | DefaultType<D> | null,
        D extends Types.ObjectId,
    >(value: T) => ExtendObjectIdSchemaBuilder<
        Merge<Props, { default: T }>,
        ExtraOmitFields
    >;

    enum: <
        T extends
        | Readonlyable<Array<null | O>>
        | { [path: string]: null | O }
        | { message?: M; values: Readonlyable<Array<null | O>> },
        M extends string,
        O extends Types.ObjectId,
    >(value: T) => ExtendObjectIdSchemaBuilder<
        Merge<Props, { enum: T }>,
        ExtraOmitFields
    >;

    index: <T extends boolean | IndexDirection | IndexOptions>(value: T) => ExtendObjectIdSchemaBuilder<
        Merge<Props, { index: T }>,
        ExtraOmitFields
    >;

    nonRequired: Props;
    private: ExtendObjectIdSchemaBuilder<Merge<Props, { private: true }>, ExtraOmitFields>;
    required: Merge<Props, { required: true }>;
    sparse: ExtendObjectIdSchemaBuilder<Merge<Props, { sparse: true }>, ExtraOmitFields>;
    unique: ExtendObjectIdSchemaBuilder<Merge<Props, { unique: true }>, ExtraOmitFields>;
}

export const objectIdSchemaBuilder = createBaseSchemaBuilderFactory<ObjectIdSchemaBuilder>(Schema.Types.ObjectId);
