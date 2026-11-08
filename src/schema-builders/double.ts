import { Schema } from 'mongoose';
import type {
    IndexDirection,
    IndexOptions,
    Types,
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

type DoubleLimit = number | Types.Double;
type DoubleValidationSchema = ValidationSchema<
    EnumValidator<number | Types.Double, Types.Double> | LimitValidator<number, Types.Double>
>;

type ExtendSchemaBuilder<
    Props extends BaseProps,
    ExtraOmitFields extends string,
> = Omit<
    DoubleSchemaBuilder<Props, ExtraOmitFields>,
    ExtraOmitFields | keyof Props
>;

interface BaseProps {
    type: typeof Schema.Types.Double;
}

export interface DoubleSchemaBuilder<Props extends BaseProps = BaseProps, ExtraOmitFields extends string = never> {
    default: <
        T extends ((this: any, doc: any) => D | null | undefined) | D | null | undefined,
        D extends Types.Double,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, { default: T }>,
        ExtraOmitFields
    >;

    enum: <
        T extends EnumInput<N | null, M>,
        M extends string,
        N extends number | Types.Double,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, DoubleValidationSchema>,
        'enum' | ExtraOmitFields
    >;

    immutable: ExtendSchemaBuilder<Merge<Props, { immutable: true }>, ExtraOmitFields>;
    index: <T extends boolean | IndexDirection | IndexOptions>(value: T) => ExtendSchemaBuilder<
        Merge<Props, { index: T }>,
        ExtraOmitFields
    >;

    max: <
        T extends ValueWithMessage<L, S>,
        L extends DoubleLimit,
        S extends string,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, DoubleValidationSchema>,
        'max' | ExtraOmitFields
    >;

    min: <
        T extends ValueWithMessage<L, S>,
        L extends DoubleLimit,
        S extends string,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, DoubleValidationSchema>,
        'min' | ExtraOmitFields
    >;

    nonRequired: Props;
    private: ExtendSchemaBuilder<Merge<Props, { private: true }>, ExtraOmitFields>;
    required: Merge<Props, { required: true }>;
    sparse: ExtendSchemaBuilder<Merge<Props, { sparse: true }>, ExtraOmitFields>;
    unique: ExtendSchemaBuilder<Merge<Props, { unique: true }>, ExtraOmitFields>;
}

// Functions
const baseBuilderFactory = createBaseSchemaBuilderFactory(Schema.Types.Double);

function createLimitValidator(
    type: 'max' | 'min',
    value: ValueWithMessage<DoubleLimit>,
): LimitValidator<number, Types.Double> {
    const [limit, message] = normalizeValueWithMessage(value);

    const numericLimit = typeof limit === 'number' ? limit : limit.valueOf();
    if (!Number.isFinite(numericLimit)) throw new RangeError(`Double ${type} limit must be finite`);

    return {
        message: message ?? defaultLimitValidateMessages[type],
        [type]: numericLimit,
        type,
        validator: (value) => {
            if (value === null || value === undefined) return true;

            return type === 'min' ? value.valueOf() >= numericLimit : value.valueOf() <= numericLimit;
        },
    };
}

export function doubleSchemaBuilder() {
    const schema: Partial<DoubleValidationSchema> & Record<string, any> = {};
    const baseBuilder = baseBuilderFactory(schema);
    return new Proxy(
        baseBuilder,
        {
            get(target, key, receiver) {
                if (key === 'enum') {
                    if (hasSchemaValidator(schema, 'enum')) {
                        throw new Error('Duplicate schema attribute: enum');
                    }

                    return (value: EnumInput<null | number | Types.Double>) => {
                        const { enumValues, message } = normalizeEnumValues(value);

                        const allowedValues = new Set(
                            enumValues.map((value) => value === null ? null : value.valueOf()),
                        );

                        const validator: EnumValidator<number | Types.Double, Types.Double> = {
                            enumValues,
                            message: message ?? defaultEnumValidateMessage,
                            type: 'enum',
                            validator: (value) => {
                                if (value === null || value === undefined) return true;

                                return allowedValues.has(value.valueOf());
                            },
                        };

                        setSchemaValidator(schema, validator);

                        return receiver;
                    };
                }

                if (key === 'max' || key === 'min') {
                    return (value: ValueWithMessage<DoubleLimit>) => {
                        const validator = createLimitValidator(key, value);
                        setSchemaValidator(schema, validator);

                        return receiver;
                    };
                }

                return Reflect.get(target, key, receiver);
            },
        },
    ) as DoubleSchemaBuilder;
}
