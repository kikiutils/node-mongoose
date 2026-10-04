import { Decimal } from 'decimal.js';
import { Schema } from 'mongoose';
import type {
    DefaultType,
    IndexDirection,
    IndexOptions,
    Types,
} from 'mongoose';
import type { Merge } from 'type-fest';

import type { Readonlyable } from '../types/_internals';

import { createBaseSchemaBuilderFactory } from './base';

type Decimal128Limit = Decimal.Value | Types.Decimal128 | { toString: () => string };
type ExtendSchemaBuilder<
    Props extends BaseProps,
    ExtraOmitFields extends string,
> = Omit<
    Decimal128SchemaBuilder<Props, ExtraOmitFields>,
    ExtraOmitFields | keyof Props
>;

interface BaseProps {
    type: typeof Schema.Types.Decimal128;
}

interface Decimal128LimitValidator {
    max?: string;
    message: string;
    min?: string;
    type: 'max' | 'min';
    validator: (value: null | Types.Decimal128 | undefined) => boolean;
}

export interface Decimal128SchemaBuilder<
    Props extends { type: typeof Schema.Types.Decimal128 } = { type: typeof Schema.Types.Decimal128 },
    ExtraOmitFields extends string = never,
> {
    default: <
        T extends ((this: any, doc: any) => DefaultType<D>) | DefaultType<D> | null,
        D extends Types.Decimal128,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, { default: T }>,
        ExtraOmitFields
    >;

    enum: <
        T extends
        | Readonlyable<Array<D | null>>
        | { [path: string]: D | null }
        | { message?: M; values: Readonlyable<Array<D | null>> },
        D extends Types.Decimal128,
        M extends string,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, { enum: T }>,
        ExtraOmitFields
    >;

    immutable: ExtendSchemaBuilder<Merge<Props, { immutable: true }>, ExtraOmitFields>;
    index: <T extends boolean | IndexDirection | IndexOptions>(value: T) => ExtendSchemaBuilder<
        Merge<Props, { index: T }>,
        ExtraOmitFields
    >;

    max: <
        T extends D | Readonlyable<[D, S]>,
        D extends Decimal128Limit,
        S extends string,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, Decimal128ValidationSchema>,
        'max' | ExtraOmitFields
    >;

    min: <
        T extends D | Readonlyable<[D, S]>,
        D extends Decimal128Limit,
        S extends string,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, Decimal128ValidationSchema>,
        'min' | ExtraOmitFields
    >;

    nonRequired: Props;
    private: ExtendSchemaBuilder<Merge<Props, { private: true }>, ExtraOmitFields>;
    required: Merge<Props, { required: true }>;

    /**
     * Configures a setter that rounds decimal values and formats them with a fixed number of decimal places.
     *
     * @remarks
     * Replaces the configured setter on this builder. The setter converts non-nullish values through Decimal.js
     * and returns a decimal string for Mongoose to cast to `Decimal128`. It returns `undefined` for `null` or
     * `undefined`. Decimal.js validates conversion and formatting when the setter processes a value,
     * not when the setter is configured.
     *
     * @param places - The non-negative integer number of decimal places. Defaults to `2`.
     * @param rounding - The Decimal.js rounding mode. Defaults to `Decimal.ROUND_DOWN`, which rounds toward zero.
     *
     * @returns This instance for chaining.
     */
    setRoundAndToFixedSetter: (places?: number, rounding?: Decimal.Rounding) => ExtendSchemaBuilder<
        Merge<Props, ToStringSetterSchema>,
        'setRoundAndToFixedSetter' | ExtraOmitFields
    >;

    /**
     * Configures a getter that converts decimal values to strings.
     *
     * @remarks
     * Replaces the configured getter on this builder. The getter returns the value's string representation,
     * or `undefined` for `null` or `undefined`. It changes the read representation, not the stored BSON type.
     *
     * @returns This instance for chaining.
     */
    setToStringGetter: ExtendSchemaBuilder<Merge<Props, ToStringGetterSchema>, 'setToStringGetter' | ExtraOmitFields>;
    sparse: ExtendSchemaBuilder<Merge<Props, { sparse: true }>, ExtraOmitFields>;
    unique: ExtendSchemaBuilder<Merge<Props, { unique: true }>, ExtraOmitFields>;
}

interface Decimal128ValidationSchema {
    validate: Decimal128LimitValidator[];
}

interface ToStringGetterSchema {
    get: (value?: Types.Decimal128) => string | undefined;
}

interface ToStringSetterSchema {
    set: (value?: { toString: () => string }) => string | undefined;
}

// Constants/Variables
const defaultMinValidateMessage = 'Path `{PATH}` ({VALUE}) is less than minimum allowed value ({MIN}).';
const defaultMaxValidateMessage = 'Path `{PATH}` ({VALUE}) is more than maximum allowed value ({MAX}).';

// Functions
const baseBuilderFactory = createBaseSchemaBuilderFactory(Schema.Types.Decimal128);

function createLimitValidator(
    type: 'max' | 'min',
    value: Decimal128Limit | Readonlyable<[Decimal128Limit, string]>,
): Decimal128LimitValidator {
    const [limit, message] = Array.isArray(value)
        ? value as Readonly<[Decimal128Limit, string]>
        : [
            value,
            undefined,
        ];

    const decimalLimit = new Decimal(limit.toString());
    if (!decimalLimit.isFinite()) throw new RangeError(`Decimal128 ${type} limit must be finite`);

    return {
        message: message ?? (type === 'min' ? defaultMinValidateMessage : defaultMaxValidateMessage),
        [type]: decimalLimit.toString(),
        type,
        validator: (value) => {
            if (value === null || value === undefined) return true;

            const decimalValue = new Decimal(value.toString());
            return type === 'min' ? decimalValue.gte(decimalLimit) : decimalValue.lte(decimalLimit);
        },
    };
}

export function decimal128SchemaBuilder() {
    const schema: Record<string, any> = {};
    const baseBuilder = baseBuilderFactory(schema);
    return new Proxy(
        baseBuilder,
        {
            get(target, key, receiver) {
                if (key === 'max' || key === 'min') {
                    return (value: Decimal128Limit | Readonlyable<[Decimal128Limit, string]>) => {
                        const validator = createLimitValidator(key, value);
                        const validators = Array.isArray(schema.validate) ? schema.validate : [];
                        schema.validate = [
                            ...validators.filter(({ type }) => type !== key),
                            validator,
                        ];

                        return receiver;
                    };
                }

                if (key === 'setRoundAndToFixedSetter') {
                    return (places: number = 2, rounding: Decimal.Rounding = Decimal.ROUND_DOWN) => {
                        schema.set = (value?: { toString: () => string }) => {
                            if (value !== undefined && value !== null) {
                                const decimal = Decimal.isDecimal(value) ? value : new Decimal(value.toString());
                                return decimal.toFixed(places, rounding);
                            }
                        };

                        return receiver;
                    };
                }

                if (key === 'setToStringGetter') {
                    schema.get = (value?: Types.Decimal128) => value?.toString();
                    return receiver;
                }

                return Reflect.get(target, key, receiver);
            },
        },
    ) as Decimal128SchemaBuilder;
}
