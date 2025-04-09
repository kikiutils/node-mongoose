import { Decimal } from 'decimal.js';
import { Schema } from 'mongoose';
import type {
    DefaultType,
    IndexDirection,
    IndexOptions,
    Types,
} from 'mongoose';
import type { Merge } from 'type-fest';

import type { Readonlyable } from '../types/utils';

import { createBaseSchemaBuilderFactory } from './base';

export type ExtendDecimal128SchemaBuilder<
    Props extends BaseProps,
    ExtraOmitFields extends string,
> = Omit<
    Decimal128SchemaBuilder<Props, ExtraOmitFields>,
    ExtraOmitFields | keyof Props
>;

interface BaseProps {
    type: typeof Schema.Types.Decimal128;
}

interface ToStringGetterSchema {
    get: (value?: Types.Decimal128) => string | undefined;
}

interface ToStringSetterSchema {
    set: (value?: { toString: () => string }) => string;
}

export interface Decimal128SchemaBuilder<
    Props extends { type: typeof Schema.Types.Decimal128 } = { type: typeof Schema.Types.Decimal128 },
    ExtraOmitFields extends string = never,
> {
    default: <
        T extends ((this: any, doc: any) => DefaultType<D>) | DefaultType<D> | null,
        D extends Types.Decimal128,
    >(value: T) => ExtendDecimal128SchemaBuilder<
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
    >(value: T) => ExtendDecimal128SchemaBuilder<
        Merge<Props, { enum: T }>,
        ExtraOmitFields
    >;

    index: <T extends boolean | IndexDirection | IndexOptions>(value: T) => ExtendDecimal128SchemaBuilder<
        Merge<Props, { index: T }>,
        ExtraOmitFields
    >;

    nonRequired: Props;
    private: ExtendDecimal128SchemaBuilder<Merge<Props, { private: true }>, ExtraOmitFields>;
    required: Merge<Props, { required: true }>;

    /**
     * Sets the rounding and toFixed behavior for Decimal128 fields.
     * This method allows specifying the number of decimal places and the rounding strategy to be used when
     * saving the field to the database.
     *
     * @param places - The number of decimal places to round to (default is 2).
     * @param rounding - The rounding strategy from the Decimal.js library (default is Decimal.ROUND_DOWN).
     *
     * @returns A schema builder with the rounding and toFixed behavior applied to the `set` option in Mongoose.
     */
    setRoundAndToFixedSetter: (places?: number, rounding?: Decimal.Rounding) => ExtendDecimal128SchemaBuilder<
        Merge<Props, ToStringSetterSchema>,
        'setRoundAndToFixedSetter' | ExtraOmitFields
    >;

    /**
     * Sets the toString behavior for Decimal128 fields.
     * This method defines how the Decimal128 field should be converted to a string when processing or
     * retrieving the value in the application (e.g., via getters), while still storing the value as Decimal128
     * in the database.
     *
     * @returns A schema builder with the custom `get` behavior applied to convert the Decimal128 field to a string
     * when accessed in the application.
     */
    setToStringGetter: ExtendDecimal128SchemaBuilder<
        Merge<Props, ToStringGetterSchema>,
        'setToStringGetter' | ExtraOmitFields
    >;

    sparse: ExtendDecimal128SchemaBuilder<Merge<Props, { sparse: true }>, ExtraOmitFields>;
    unique: ExtendDecimal128SchemaBuilder<Merge<Props, { unique: true }>, ExtraOmitFields>;
}

const baseBuilderFactory = createBaseSchemaBuilderFactory(Schema.Types.Decimal128);

export function decimal128SchemaBuilder() {
    const schema: Record<string, any> = {};
    const baseBuilder = baseBuilderFactory(schema);
    return new Proxy(
        baseBuilder,
        {
            get(target, key, receiver) {
                if (key === 'setRoundAndToFixedSetter') {
                    return (places: number = 2, rounding: Decimal.Rounding = Decimal.ROUND_DOWN) => {
                        schema.set = (value?: { toString: () => string }) => {
                            if (value) return new Decimal(value.toString()).toFixed(places, rounding);
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
