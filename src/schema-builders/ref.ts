import { Schema } from 'mongoose';
import type {
    DefaultType,
    IndexDirection,
    IndexOptions,
    Model,
    Types,
} from 'mongoose';
import type { Merge } from 'type-fest';

import type { Readonlyable } from '../types/utils';

import { createBaseSchemaBuilderFactory } from './base';

export type ExtendRefSchemaBuilder<
    Props extends BaseProps,
    ExtraOmitFields extends string,
> = Omit<
    RefSchemaBuilder<Props, ExtraOmitFields>,
    ExtraOmitFields | keyof Props
>;

interface BaseProps {
    type: typeof Schema.Types.ObjectId;
}

export interface RefSchemaBuilder<
    Props extends { type: typeof Schema.Types.ObjectId } = { type: typeof Schema.Types.ObjectId },
    ExtraOmitFields extends string = never,
> {
    default: <
        T extends ((this: any, doc: any) => DefaultType<D>) | DefaultType<D> | null,
        D extends Types.ObjectId,
    >(value: T) => ExtendRefSchemaBuilder<
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
    >(value: T) => ExtendRefSchemaBuilder<
        Merge<Props, { enum: T }>,
        ExtraOmitFields
    >;

    index: <T extends boolean | IndexDirection | IndexOptions>(value: T) => ExtendRefSchemaBuilder<
        Merge<Props, { index: T }>,
        ExtraOmitFields
    >;

    nonRequired: Props;
    private: ExtendRefSchemaBuilder<Merge<Props, { private: true }>, ExtraOmitFields>;
    required: Merge<Props, { required: true }>;
    sparse: ExtendRefSchemaBuilder<Merge<Props, { sparse: true }>, ExtraOmitFields>;
    unique: ExtendRefSchemaBuilder<Merge<Props, { unique: true }>, ExtraOmitFields>;
}

const baseBuilderFactory = createBaseSchemaBuilderFactory(Schema.Types.ObjectId);

export function refSchemaBuilder<T extends ((this: any, doc: any) => Model<any> | string) | Model<any> | string>(
    ref: T,
): RefSchemaBuilder<{ ref: T; type: typeof Schema.Types.ObjectId }> {
    return baseBuilderFactory({ ref }) as RefSchemaBuilder<{ ref: T; type: typeof Schema.Types.ObjectId }>;
}
