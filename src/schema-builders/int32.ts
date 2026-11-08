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

type ExtendSchemaBuilder<
    Props extends BaseProps,
    ExtraOmitFields extends string,
> = Omit<
    Int32SchemaBuilder<Props, ExtraOmitFields>,
    ExtraOmitFields | keyof Props
>;

type Int32Limit = number;

type Int32ValidationSchema = ValidationSchema<EnumValidator<number> | LimitValidator<number>>;

interface BaseProps {
    type: typeof Schema.Types.Int32;
}

export interface Int32SchemaBuilder<Props extends BaseProps = BaseProps, ExtraOmitFields extends string = never> {
    default: <
        T extends ((this: any, doc: any) => DefaultType<D> | null | undefined) | DefaultType<D> | null | undefined,
        D extends number,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, { default: T }>,
        ExtraOmitFields
    >;

    enum: <
        T extends EnumInput<N | null, M>,
        M extends string,
        N extends number,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, Int32ValidationSchema>,
        'enum' | ExtraOmitFields
    >;

    immutable: ExtendSchemaBuilder<Merge<Props, { immutable: true }>, ExtraOmitFields>;
    index: <T extends boolean | IndexDirection | IndexOptions>(value: T) => ExtendSchemaBuilder<
        Merge<Props, { index: T }>,
        ExtraOmitFields
    >;

    max: <
        T extends ValueWithMessage<L, S>,
        L extends Int32Limit,
        S extends string,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, Int32ValidationSchema>,
        'max' | ExtraOmitFields
    >;

    min: <
        T extends ValueWithMessage<L, S>,
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

// Functions
const baseBuilderFactory = createBaseSchemaBuilderFactory(Schema.Types.Int32);

function createLimitValidator(
    type: 'max' | 'min',
    value: ValueWithMessage<Int32Limit>,
): LimitValidator<number> {
    const [numericLimit, message] = normalizeValueWithMessage(value);

    if (!Number.isFinite(numericLimit)) throw new RangeError(`Int32 ${type} limit must be finite`);

    return {
        message: message ?? defaultLimitValidateMessages[type],
        [type]: numericLimit,
        type,
        validator: (value) => {
            if (value === null || value === undefined) return true;

            return type === 'min' ? value >= numericLimit : value <= numericLimit;
        },
    };
}

export function int32SchemaBuilder() {
    const schema: Partial<Int32ValidationSchema> & Record<string, any> = {};
    const baseBuilder = baseBuilderFactory(schema);
    return new Proxy(
        baseBuilder,
        {
            get(target, key, receiver) {
                if (key === 'enum') {
                    if (hasSchemaValidator(schema, 'enum')) {
                        throw new Error('Duplicate schema attribute: enum');
                    }

                    return (value: EnumInput<null | number>) => {
                        const { enumValues, message } = normalizeEnumValues(value);

                        const allowedValues = new Set(enumValues);
                        const validator: EnumValidator<number> = {
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
                    return (value: ValueWithMessage<Int32Limit>) => {
                        const validator = createLimitValidator(key, value);
                        setSchemaValidator(schema, validator);

                        return receiver;
                    };
                }

                return Reflect.get(target, key, receiver);
            },
        },
    ) as Int32SchemaBuilder;
}
