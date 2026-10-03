import { Schema } from 'mongoose';
import type {
    IndexDirection,
    IndexOptions,
    Types,
} from 'mongoose';
import type { Merge } from 'type-fest';

import type { Readonlyable } from '../types/_internals';

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

    immutable: ExtendSchemaBuilder<Merge<Props, { immutable: true }>, ExtraOmitFields>;
    index: <T extends boolean | IndexDirection | IndexOptions>(value: T) => ExtendSchemaBuilder<
        Merge<Props, { index: T }>,
        ExtraOmitFields
    >;

    max: <
        T extends L | Readonlyable<[L, S]>,
        L extends DoubleLimit,
        S extends string,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, DoubleValidationSchema>,
        'max' | ExtraOmitFields
    >;

    min: <
        T extends L | Readonlyable<[L, S]>,
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
    validate: DoubleLimitValidator[];
}

// Constants/Variables
const defaultMinValidateMessage = 'Path `{PATH}` ({VALUE}) is less than minimum allowed value ({MIN}).';
const defaultMaxValidateMessage = 'Path `{PATH}` ({VALUE}) is more than maximum allowed value ({MAX}).';

// Functions
const baseBuilderFactory = createBaseSchemaBuilderFactory(Schema.Types.Double);

function createLimitValidator(
    type: 'max' | 'min',
    value: DoubleLimit | Readonlyable<[DoubleLimit, string]>,
): DoubleLimitValidator {
    const [limit, message] = Array.isArray(value)
        ? value as Readonly<[DoubleLimit, string]>
        : [
            value as DoubleLimit,
            undefined,
        ];

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
                if (key === 'max' || key === 'min') {
                    return (value: DoubleLimit | Readonlyable<[DoubleLimit, string]>) => {
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
