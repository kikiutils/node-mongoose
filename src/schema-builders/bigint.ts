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

interface BigIntEnumValidator {
    enumValues: Array<bigint | null>;
    message: string;
    type: 'enum';
    validator: (value: bigint | null | undefined) => boolean;
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

    enum: <
        T extends
        | Readonlyable<Array<N | null>>
        | { [path: string]: N | null }
        | { message?: M; values: Readonlyable<Array<N | null>> },
        M extends string,
        N extends bigint,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, BigIntValidationSchema>,
        'enum' | ExtraOmitFields
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
    validate: Array<BigIntEnumValidator | BigIntLimitValidator>;
}

// Constants/Variables
const defaultEnumValidateMessage = 'Path `{PATH}` ({VALUE}) is not a valid enum value.';
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
                if (key === 'enum') {
                    if (schema.validate?.some(({ type }: { type: string }) => type === 'enum')) {
                        throw new Error('Duplicate schema attribute: enum');
                    }

                    return (
                        value: Readonlyable<Array<bigint | null>>
                          | { [path: string]: bigint | null }
                          | { message?: string; values: Readonlyable<Array<bigint | null>> },
                    ) => {
                        let enumValues: Array<bigint | null>;
                        let message: string | undefined;

                        if (Array.isArray(value)) enumValues = [...value];
                        else if ('values' in value && Array.isArray(value.values)) {
                            enumValues = [...value.values];
                            if ('message' in value && typeof value.message === 'string') message = value.message;
                        } else enumValues = Object.values(value);

                        const allowedValues = new Set(enumValues);
                        const validator: BigIntEnumValidator = {
                            enumValues,
                            message: message ?? defaultEnumValidateMessage,
                            type: 'enum',
                            validator: (value) => value === null || value === undefined || allowedValues.has(value),
                        };

                        schema.validate = [
                            ...schema.validate ?? [],
                            validator,
                        ];

                        return receiver;
                    };
                }

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
