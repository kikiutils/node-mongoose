import type {
    DateSchemaDefinition,
    DefaultType,
    IndexDirection,
    IndexOptions,
} from 'mongoose';
import type { Merge } from 'type-fest';

import type { Readonlyable } from '../types/_internals';

import { createBaseSchemaBuilderFactory } from './base';

export type ExtendDateSchemaBuilder<
    Props extends BaseProps,
    ExtraOmitFields extends string,
> = Omit<
    DateSchemaBuilder<Props, ExtraOmitFields>,
    ExtraOmitFields | keyof Props
>;

interface BaseProps {
    type: DateSchemaDefinition;
}

export interface DateSchemaBuilder<
    Props extends { type: DateSchemaDefinition } = { type: DateSchemaDefinition },
    ExtraOmitFields extends string = never,
> {
    default: <
        T extends ((this: any, doc: any) => DefaultType<D>) | DefaultType<D> | null,
        D extends NativeDate,
    >(value: T) => ExtendDateSchemaBuilder<
        Merge<Props, { default: T }>,
        ExtraOmitFields
    >;

    enum: <
        T extends
        | Readonlyable<Array<D | null>>
        | { [path: string]: D | null }
        | { message?: M; values: Readonlyable<Array<D | null>> },
        D extends NativeDate,
        M extends string,
    >(value: T) => ExtendDateSchemaBuilder<
        Merge<Props, { enum: T }>,
        ExtraOmitFields
    >;

    immutable: ExtendDateSchemaBuilder<Merge<Props, { immutable: true }>, ExtraOmitFields>;
    index: <T extends boolean | IndexDirection | IndexOptions>(value: T) => ExtendDateSchemaBuilder<
        Merge<Props, { index: T }>,
        ExtraOmitFields
    >;

    max: <
        T extends D | Readonlyable<[D, S]>,
        D extends NativeDate,
        S extends string,
    >(value: T) => ExtendDateSchemaBuilder<
        Merge<Props, { max: T }>,
        ExtraOmitFields
    >;

    min: <
        T extends D | Readonlyable<[D, S]>,
        D extends NativeDate,
        S extends string,
    >(value: T) => ExtendDateSchemaBuilder<
        Merge<Props, { min: T }>,
        ExtraOmitFields
    >;

    nonRequired: Props;
    private: ExtendDateSchemaBuilder<Merge<Props, { private: true }>, ExtraOmitFields>;
    required: Merge<Props, { required: true }>;
    sparse: ExtendDateSchemaBuilder<Merge<Props, { sparse: true }>, ExtraOmitFields>;
    unique: ExtendDateSchemaBuilder<Merge<Props, { unique: true }>, ExtraOmitFields>;
}

export const dateSchemaBuilder = createBaseSchemaBuilderFactory<DateSchemaBuilder>(Date);
