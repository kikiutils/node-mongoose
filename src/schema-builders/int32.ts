import { Schema } from 'mongoose';
import type {
    DefaultType,
    IndexDirection,
    IndexOptions,
} from 'mongoose';
import type { Merge } from 'type-fest';

import type { Readonlyable } from '../types/_internals';

import { createBaseSchemaBuilderFactory } from './base';

type ExtendSchemaBuilder<
    Props extends BaseProps,
    ExtraOmitFields extends string,
> = Omit<
    Int32SchemaBuilder<Props, ExtraOmitFields>,
    ExtraOmitFields | keyof Props
>;

type Int32Limit = number;

interface BaseProps {
    type: typeof Schema.Types.Int32;
}

interface Int32LimitValidator {
    max?: number;
    message: string;
    min?: number;
    type: 'max' | 'min';
    validator: (value: null | number | undefined) => boolean;
}

export interface Int32SchemaBuilder<Props extends BaseProps = BaseProps, ExtraOmitFields extends string = never> {
    default: <
        T extends ((this: any, doc: any) => DefaultType<D> | null | undefined) | DefaultType<D> | null | undefined,
        D extends number,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, { default: T }>,
        ExtraOmitFields
    >;

    immutable: ExtendSchemaBuilder<Merge<Props, { immutable: true }>, ExtraOmitFields>;
    index: <T extends boolean | IndexDirection | IndexOptions>(value: T) => ExtendSchemaBuilder<
        Merge<Props, { index: T }>,
        ExtraOmitFields
    >;

    max: <
        T extends L | Readonlyable<[L, S]>,
        L extends Int32Limit,
        S extends string,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, Int32ValidationSchema>,
        'max' | ExtraOmitFields
    >;

    min: <
        T extends L | Readonlyable<[L, S]>,
        L extends Int32Limit,
        S extends string,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, Int32ValidationSchema>,
        'min' | ExtraOmitFields
    >;

    nonRequired: Props;
    private: ExtendSchemaBuilder<Merge<Props, { private: true }>, ExtraOmitFields>;
    required: Merge<Props, { required: true }>;
    sparse: ExtendSchemaBuilder<Merge<Props, { sparse: true }>, ExtraOmitFields>;
    unique: ExtendSchemaBuilder<Merge<Props, { unique: true }>, ExtraOmitFields>;
}

interface Int32ValidationSchema {
    validate: Int32LimitValidator[];
}

// Constants/Variables
const defaultMinValidateMessage = 'Path `{PATH}` ({VALUE}) is less than minimum allowed value ({MIN}).';
const defaultMaxValidateMessage = 'Path `{PATH}` ({VALUE}) is more than maximum allowed value ({MAX}).';

// Functions
const baseBuilderFactory = createBaseSchemaBuilderFactory(Schema.Types.Int32);

function createLimitValidator(
    type: 'max' | 'min',
    value: Int32Limit | Readonlyable<[Int32Limit, string]>,
): Int32LimitValidator {
    const [numericLimit, message] = Array.isArray(value)
        ? value as Readonly<[Int32Limit, string]>
        : [
            value as Int32Limit,
            undefined,
        ];

    if (!Number.isFinite(numericLimit)) throw new RangeError(`Int32 ${type} limit must be finite`);

    return {
        message: message ?? (type === 'min' ? defaultMinValidateMessage : defaultMaxValidateMessage),
        [type]: numericLimit,
        type,
        validator: (value) => {
            if (value === null || value === undefined) return true;

            return type === 'min' ? value >= numericLimit : value <= numericLimit;
        },
    };
}

export function int32SchemaBuilder() {
    const schema: Record<string, any> = {};
    const baseBuilder = baseBuilderFactory(schema);
    return new Proxy(
        baseBuilder,
        {
            get(target, key, receiver) {
                if (key === 'max' || key === 'min') {
                    return (value: Int32Limit | Readonlyable<[Int32Limit, string]>) => {
                        const validator = createLimitValidator(key, value);
                        const validators = Array.isArray(schema.validate) ? schema.validate : [];
                        schema.validate = [
                            ...validators.filter(({ type }) => type !== key),
                            validator,
                        ];

                        return receiver;
                    };
                }

                return Reflect.get(target, key, receiver);
            },
        },
    ) as Int32SchemaBuilder;
}
