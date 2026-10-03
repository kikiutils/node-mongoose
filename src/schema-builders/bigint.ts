import { Schema } from 'mongoose';
import type {
    DefaultType,
    IndexDirection,
    IndexOptions,
} from 'mongoose';
import type { Merge } from 'type-fest';

import type { Readonlyable } from '../types/_internals';

import { createBaseSchemaBuilderFactory } from './base';

type BigIntLimit = bigint;
type ExtendSchemaBuilder<
    Props extends BaseProps,
    ExtraOmitFields extends string,
> = Omit<
    BigIntSchemaBuilder<Props, ExtraOmitFields>,
    ExtraOmitFields | keyof Props
>;

interface BaseProps {
    type: typeof Schema.Types.BigInt;
}

interface BigIntLimitValidator {
    max?: bigint;
    message: string;
    min?: bigint;
    type: 'max' | 'min';
    validator: (value: bigint | null | undefined) => boolean;
}

export interface BigIntSchemaBuilder<Props extends BaseProps = BaseProps, ExtraOmitFields extends string = never> {
    default: <
        T extends ((this: any, doc: any) => DefaultType<D> | null | undefined) | DefaultType<D> | null | undefined,
        D extends bigint,
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
        L extends BigIntLimit,
        S extends string,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, BigIntValidationSchema>,
        'max' | ExtraOmitFields
    >;

    min: <
        T extends L | Readonlyable<[L, S]>,
        L extends BigIntLimit,
        S extends string,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, BigIntValidationSchema>,
        'min' | ExtraOmitFields
    >;

    nonRequired: Props;
    private: ExtendSchemaBuilder<Merge<Props, { private: true }>, ExtraOmitFields>;
    required: Merge<Props, { required: true }>;
    sparse: ExtendSchemaBuilder<Merge<Props, { sparse: true }>, ExtraOmitFields>;
    unique: ExtendSchemaBuilder<Merge<Props, { unique: true }>, ExtraOmitFields>;
}

interface BigIntValidationSchema {
    validate: BigIntLimitValidator[];
}

// Constants/Variables
const defaultMinValidateMessage = 'Path `{PATH}` ({VALUE}) is less than minimum allowed value ({MIN}).';
const defaultMaxValidateMessage = 'Path `{PATH}` ({VALUE}) is more than maximum allowed value ({MAX}).';

// Functions
const baseBuilderFactory = createBaseSchemaBuilderFactory(Schema.Types.BigInt);

export function bigintSchemaBuilder() {
    const schema: Record<string, any> = {};
    const baseBuilder = baseBuilderFactory(schema);
    return new Proxy(
        baseBuilder,
        {
            get(target, key, receiver) {
                if (key === 'max' || key === 'min') {
                    return (value: BigIntLimit | Readonlyable<[BigIntLimit, string]>) => {
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
    ) as BigIntSchemaBuilder;
}

function createLimitValidator(
    type: 'max' | 'min',
    value: BigIntLimit | Readonlyable<[BigIntLimit, string]>,
): BigIntLimitValidator {
    const [limit, message] = Array.isArray(value)
        ? value as Readonly<[BigIntLimit, string]>
        : [
            value as BigIntLimit,
            undefined,
        ];

    if (typeof limit !== 'bigint') throw new TypeError(`BigInt ${type} limit must be a bigint`);

    return {
        message: message ?? (type === 'min' ? defaultMinValidateMessage : defaultMaxValidateMessage),
        [type]: limit,
        type,
        validator: (value) => {
            if (value === null || value === undefined) return true;

            return type === 'min' ? value >= limit : value <= limit;
        },
    };
}
