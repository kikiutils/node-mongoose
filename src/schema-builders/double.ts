import { Schema } from 'mongoose';
import type {
    IndexDirection,
    IndexOptions,
    Types,
} from 'mongoose';
import type { Merge } from 'type-fest';

import type {
    EnumInput,
    ValueWithMessage,
} from '../types/_internals';

import {
    defaultEnumValidateMessage,
    defaultMaxValidateMessage,
    defaultMinValidateMessage,
    normalizeEnumValues,
    normalizeValueWithMessage,
} from './_internals';
import { createBaseSchemaBuilderFactory } from './base';

type DoubleLimit = number | Types.Double;
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

interface DoubleEnumValidator {
    enumValues: Array<null | number | Types.Double>;
    message: string;
    type: 'enum';
    validator: (value: null | Types.Double | undefined) => boolean;
}

interface DoubleLimitValidator {
    max?: number;
    message: string;
    min?: number;
    type: 'max' | 'min';
    validator: (value: null | Types.Double | undefined) => boolean;
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

interface DoubleValidationSchema {
    validate: Array<DoubleEnumValidator | DoubleLimitValidator>;
}

// Functions
const baseBuilderFactory = createBaseSchemaBuilderFactory(Schema.Types.Double);

function createLimitValidator(
    type: 'max' | 'min',
    value: ValueWithMessage<DoubleLimit>,
): DoubleLimitValidator {
    const [limit, message] = normalizeValueWithMessage(value);

    const numericLimit = typeof limit === 'number' ? limit : limit.valueOf();
    if (!Number.isFinite(numericLimit)) throw new RangeError(`Double ${type} limit must be finite`);

    return {
        message: message ?? (type === 'min' ? defaultMinValidateMessage : defaultMaxValidateMessage),
        [type]: numericLimit,
        type,
        validator: (value) => {
            if (value === null || value === undefined) return true;

            return type === 'min' ? value.valueOf() >= numericLimit : value.valueOf() <= numericLimit;
        },
    };
}

export function doubleSchemaBuilder() {
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

                    return (value: EnumInput<null | number | Types.Double>) => {
                        const { enumValues, message } = normalizeEnumValues(value);

                        const allowedValues = new Set(
                            enumValues.map((value) => value === null ? null : value.valueOf()),
                        );

                        const validator: DoubleEnumValidator = {
                            enumValues,
                            message: message ?? defaultEnumValidateMessage,
                            type: 'enum',
                            validator: (value) => {
                                if (value === null || value === undefined) return true;

                                return allowedValues.has(value.valueOf());
                            },
                        };

                        schema.validate = [
                            ...schema.validate ?? [],
                            validator,
                        ];

                        return receiver;
                    };
                }

                if (key === 'max' || key === 'min') {
                    return (value: ValueWithMessage<DoubleLimit>) => {
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
    ) as DoubleSchemaBuilder;
}
