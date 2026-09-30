import {
    isIPv4,
    isIPv6,
} from 'node:net';

import type {
    DefaultType,
    IndexDirection,
    IndexOptions,
    StringSchemaDefinition,
} from 'mongoose';
import type { Merge } from 'type-fest';

import type { Readonlyable } from '../types/_internals';

import { createBaseSchemaBuilderFactory } from './base';

type ExtendSchemaBuilder<
    Props extends BaseProps,
    ExtraOmitFields extends string,
> = Omit<
    StringSchemaBuilder<Props, ExtraOmitFields>,
    ExtraOmitFields | keyof Props
>;

interface BaseProps {
    type: StringSchemaDefinition;
}

interface IpSchema<T extends string> {
    trim: true;
    validate: { message: T; validator: (value: string) => boolean };
}

export interface StringSchemaBuilder<
    Props extends { type: StringSchemaDefinition } = { type: StringSchemaDefinition },
    ExtraOmitFields extends string = never,
> {
    default: <
        T extends ((this: any, doc: any) => DefaultType<D>) | DefaultType<D> | null,
        D extends string,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, { default: T }>,
        ExtraOmitFields
    >;

    enum: <
        T extends
        | Readonlyable<Array<null | S>>
        | { [path: string]: null | S }
        | { message?: M; values: Readonlyable<Array<null | S>> },
        M extends string,
        S extends string,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, { enum: T }>,
        ExtraOmitFields
    >;

    immutable: ExtendSchemaBuilder<Merge<Props, { immutable: true }>, ExtraOmitFields>;
    index: <T extends boolean | IndexDirection | IndexOptions>(value: T) => ExtendSchemaBuilder<
        Merge<Props, { index: T }>,
        ExtraOmitFields
    >;

    /**
     * Adds IPv4 validation to the string schema.
     * Ensures the string is a valid IPv4 address and trims the input. The validation message can be customized.
     *
     * @param message - The custom error message to return if validation fails. Defaults to a standard
     * IPv4 validation message.
     *
     * @returns A schema builder with IPv4 validation and the `trim` option enabled.
     */
    ipv4: <T extends string = typeof defaultIpv4ValidateMessage>(message?: T) => ExtendSchemaBuilder<
        Merge<Props, IpSchema<T>>,
        'ipv4' | 'ipv6' | 'url' | ExtraOmitFields
    >;

    /**
     * Adds IPv6 validation to the string schema.
     * Ensures the string is a valid IPv6 address and trims the input. The validation message can be customized.
     *
     * @param message - The custom error message to return if validation fails. Defaults to a standard
     * IPv6 validation message.
     *
     * @returns A schema builder with IPv6 validation and the `trim` option enabled.
     */
    ipv6: <T extends string = typeof defaultIpv6ValidateMessage>(message?: T) => ExtendSchemaBuilder<
        Merge<Props, IpSchema<T>>,
        'ipv4' | 'ipv6' | 'url' | ExtraOmitFields
    >;

    /**
     * Sets both the maximum and minimum length of the string.
     * This method ensures the string length is exactly or within a specified range.
     *
     * @param value - A number representing the exact length or an array specifying [minimum, maximum] length.
     *
     * @returns A schema builder with both `maxlength` and `minlength` options applied.
     */
    length: <
        T extends L | Readonlyable<[L, S]>,
        L extends number,
        S extends string,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, { maxlength: T; minlength: T }>,
        ExtraOmitFields
    >;

    lowercase: ExtendSchemaBuilder<Merge<Props, { lowercase: true }>, ExtraOmitFields>;

    /**
     * Adds regular expression validation to the string schema.
     * The validation message can be customized.
     *
     * @param regex - The regular expression that the string must match.
     * @param message - Optional custom validation message.
     *
     * @returns A schema builder with the Mongoose `match` option configured.
     */
    match: <
        T extends RegExp,
        M extends string | undefined = undefined,
    >(regex: T,
        message?: M) => ExtendSchemaBuilder<
        Merge<Props, { match: M extends string ? Readonly<[T, M]> : T }>,
        ExtraOmitFields
    >;
    maxlength: <
        T extends L | Readonlyable<[L, S]>,
        L extends number,
        S extends string,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, { maxlength: T }>,
        ExtraOmitFields
    >;

    minlength: <
        T extends L | Readonlyable<[L, S]>,
        L extends number,
        S extends string,
    >(value: T) => ExtendSchemaBuilder<
        Merge<Props, { minlength: T }>,
        ExtraOmitFields
    >;

    nonRequired: Props;
    private: ExtendSchemaBuilder<Merge<Props, { private: true }>, ExtraOmitFields>;
    required: Merge<Props, { required: true }>;
    sparse: ExtendSchemaBuilder<Merge<Props, { sparse: true }>, ExtraOmitFields>;
    text: ExtendSchemaBuilder<Merge<Props, { text: true }>, ExtraOmitFields>;
    trim: ExtendSchemaBuilder<Merge<Props, { trim: true }>, ExtraOmitFields>;
    unique: ExtendSchemaBuilder<Merge<Props, { unique: true }>, ExtraOmitFields>;
    uppercase: ExtendSchemaBuilder<Merge<Props, { uppercase: true }>, ExtraOmitFields>;

    /**
     * Adds WHATWG URL validation to the string schema. Credentials and non-HTTP schemes are allowed.
     * The input is parsed only; no DNS lookup or normalization is performed. The validation message can be customized.
     *
     * @param message - Custom validation error message. Defaults to the standard URL validation message.
     *
     * @returns A schema builder with URL validation enabled.
     */
    url: <T extends string = typeof defaultUrlValidateMessage>(message?: T) => ExtendSchemaBuilder<
        Merge<Props, UrlSchema<T>>,
        'ipv4' | 'ipv6' | 'url' | ExtraOmitFields
    >;
}

interface UrlSchema<T extends string> {
    validate: { message: T; validator: (value: string) => boolean };
}

// Constants/Variables
const defaultIpv4ValidateMessage = '`{VALUE}` is not a valid IPv4 address for path `{PATH}`';
const defaultIpv6ValidateMessage = '`{VALUE}` is not a valid IPv6 address for path `{PATH}`';
const defaultUrlValidateMessage = '`{VALUE}` is not a valid URL for path `{PATH}`';

// Functions
const baseBuilderFactory = createBaseSchemaBuilderFactory(String);

export function stringSchemaBuilder() {
    const schema: Record<string, any> = {};
    const baseBuilder = baseBuilderFactory(schema);
    return new Proxy(
        baseBuilder,
        {
            get(target, key, receiver) {
                if (key === 'ipv4') {
                    return (message: string = defaultIpv4ValidateMessage) => {
                        schema.trim = true;
                        schema.validate = {
                            message,
                            validator: (value: string) => isIPv4(value),
                        };

                        return receiver;
                    };
                }

                if (key === 'ipv6') {
                    return (message: string = defaultIpv6ValidateMessage) => {
                        schema.trim = true;
                        schema.validate = {
                            message,
                            validator: (value: string) => isIPv6(value),
                        };

                        return receiver;
                    };
                }

                if (key === 'length') {
                    return (value: any) => {
                        schema.maxlength = schema.minlength = value;
                        return receiver;
                    };
                }

                if (key === 'match') {
                    return (regex: RegExp, message?: string) => {
                        schema.match = message === undefined
                            ? regex
                            : [
                                regex,
                                message,
                            ];

                        return receiver;
                    };
                }

                if (key === 'url') {
                    return (message: string = defaultUrlValidateMessage) => {
                        schema.validate = {
                            message,
                            validator: (value: string) => URL.canParse(value),
                        };

                        return receiver;
                    };
                }

                return Reflect.get(target, key, receiver);
            },
        },
    ) as StringSchemaBuilder;
}
