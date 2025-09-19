import type {
    DefaultType,
    IndexDirection,
    IndexOptions,
    NumberSchemaDefinition,
} from 'mongoose';
import type { Merge } from 'type-fest';

import type { Readonlyable } from '../types/_internals';

import { createBaseSchemaBuilderFactory } from './base';

export type ExtendNumberSchemaBuilder<
    Props extends BaseProps,
    ExtraOmitFields extends string,
> = Omit<
    NumberSchemaBuilder<Props, ExtraOmitFields>,
    ExtraOmitFields | keyof Props
>;

interface BaseProps {
    type: NumberSchemaDefinition;
}

export interface NumberSchemaBuilder<
    Props extends { type: NumberSchemaDefinition } = { type: NumberSchemaDefinition },
    ExtraOmitFields extends string = never,
> {
    default: <
        T extends ((this: any, doc: any) => DefaultType<D>) | DefaultType<D> | null,
        D extends number,
    >(value: T) => ExtendNumberSchemaBuilder<
        Merge<Props, { default: T }>,
        ExtraOmitFields
    >;

    enum: <
        T extends
        | Readonlyable<Array<N | null>>
        | { [path: string]: N | null }
        | { message?: M; values: Readonlyable<Array<N | null>> },
        M extends string,
        N extends number,
    >(value: T) => ExtendNumberSchemaBuilder<
        Merge<Props, { enum: T }>,
        ExtraOmitFields
    >;

    index: <T extends boolean | IndexDirection | IndexOptions>(value: T) => ExtendNumberSchemaBuilder<
        Merge<Props, { index: T }>,
        ExtraOmitFields
    >;

    max: <
        T extends N | Readonlyable<[N, S]>,
        N extends number,
        S extends string,
    >(value: T) => ExtendNumberSchemaBuilder<
        Merge<Props, { max: T }>,
        ExtraOmitFields
    >;

    min: <
        T extends N | Readonlyable<[N, S]>,
        N extends number,
        S extends string,
    >(value: T) => ExtendNumberSchemaBuilder<
        Merge<Props, { min: T }>,
        ExtraOmitFields
    >;

    nonRequired: Props;
    private: ExtendNumberSchemaBuilder<Merge<Props, { private: true }>, ExtraOmitFields>;
    required: Merge<Props, { required: true }>;
    sparse: ExtendNumberSchemaBuilder<Merge<Props, { sparse: true }>, ExtraOmitFields>;
    unique: ExtendNumberSchemaBuilder<Merge<Props, { unique: true }>, ExtraOmitFields>;
}

export const numberSchemaBuilder = createBaseSchemaBuilderFactory<NumberSchemaBuilder>(Number);
