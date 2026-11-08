import { Schema } from 'mongoose';
import type {
    DefaultType,
    IndexDirection,
    IndexOptions,
} from 'mongoose';
import type { Merge } from 'type-fest';

import type {
    EnumInput,
    EnumValidator,
    LimitValidator,
    ValidationSchema,
    ValueWithMessage,
} from '../types/_internals';

import {
    defaultEnumValidateMessage,
    defaultLimitValidateMessages,
    hasSchemaValidator,
    normalizeEnumValues,
    normalizeValueWithMessage,
    setSchemaValidator,
} from './_internals';
import { createBaseSchemaBuilderFactory } from './base';

type BigIntLimit = bigint;
type BigIntValidationSchema = ValidationSchema<EnumValidator<bigint> | LimitValidator<bigint>>;

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

export interface BigIntSchemaBuilder<Props extends BaseProps = BaseProps, ExtraOmitFields extends string = never> {
    default: <
        T extends ((this: any, doc: any) => DefaultType<D> | null | undefined) | DefaultType<D> | null | undefined,
        D extends bigint,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, { default: T }>,
        ExtraOmitFields
    >;

    enum: <
        T extends EnumInput<N | null, M>,
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
        T extends ValueWithMessage<L, S>,
        L extends BigIntLimit,
        S extends string,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, BigIntValidationSchema>,
        'max' | ExtraOmitFields
    >;

    min: <
        T extends ValueWithMessage<L, S>,
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

// Functions
const baseBuilderFactory = createBaseSchemaBuilderFactory(Schema.Types.BigInt);

export function bigintSchemaBuilder() {
    const schema: Partial<BigIntValidationSchema> & Record<string, any> = {};
    const baseBuilder = baseBuilderFactory(schema);
    return new Proxy(
        baseBuilder,
        {
            get(target, key, receiver) {
                if (key === 'enum') {
                    if (hasSchemaValidator(schema, 'enum')) {
                        throw new Error('Duplicate schema attribute: enum');
                    }

                    return (value: EnumInput<bigint | null>) => {
                        const { enumValues, message } = normalizeEnumValues(value);

                        const allowedValues = new Set(enumValues);
                        const validator: EnumValidator<bigint> = {
                            enumValues,
                            message: message ?? defaultEnumValidateMessage,
                            type: 'enum',
                            validator: (value) => value === null || value === undefined || allowedValues.has(value),
                        };

                        setSchemaValidator(schema, validator);

                        return receiver;
                    };
                }

                if (key === 'max' || key === 'min') {
                    return (value: ValueWithMessage<BigIntLimit>) => {
                        const validator = createLimitValidator(key, value);
                        setSchemaValidator(schema, validator);

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
    value: ValueWithMessage<BigIntLimit>,
): LimitValidator<bigint> {
    const [limit, message] = normalizeValueWithMessage(value);

    if (typeof limit !== 'bigint') throw new TypeError(`BigInt ${type} limit must be a bigint`);

    return {
        message: message ?? defaultLimitValidateMessages[type],
        [type]: limit,
        type,
        validator: (value) => {
            if (value === null || value === undefined) return true;

            return type === 'min' ? value >= limit : value <= limit;
        },
    };
}
