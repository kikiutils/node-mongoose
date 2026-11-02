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
     * Adds IPv4 address validation and enables input trimming.
     *
     * @remarks
     * Replaces the configured custom validator and sets `trim` to `true` on this builder.
     *
     * @param message - The validation error message. Defaults to the built-in IPv4 validation message.
     *
     * @returns This instance for chaining.
     */
    ipv4: <T extends string = typeof defaultIpv4ValidateMessage>(message?: T) => ExtendSchemaBuilder<
        Merge<Props, IpSchema<T>>,
        'ipv4' | 'ipv6' | 'url' | ExtraOmitFields
    >;

    /**
     * Adds IPv6 address validation and enables input trimming.
     *
     * @remarks
     * Replaces the configured custom validator and sets `trim` to `true` on this builder.
     *
     * @param message - The validation error message. Defaults to the built-in IPv6 validation message.
     *
     * @returns This instance for chaining.
     */
    ipv6: <T extends string = typeof defaultIpv6ValidateMessage>(message?: T) => ExtendSchemaBuilder<
        Merge<Props, IpSchema<T>>,
        'ipv4' | 'ipv6' | 'url' | ExtraOmitFields
    >;

    /**
     * Sets equal minimum and maximum string lengths.
     *
     * @remarks
     * Assigns the same value to `minlength` and `maxlength`, replacing any previously configured limits.
     *
     * @param value - The exact length in UTF-16 code units, or a tuple containing the length and a validation
     * error message.
     *
     * @returns This instance for chaining.
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
     * Configures regular expression validation for the string field.
     *
     * @remarks
     * Replaces any previously configured `match` option.
     *
     * @param regex - The regular expression used by Mongoose to validate the string.
     * @param message - The validation error message. If omitted, Mongoose uses its default message.
     *
     * @returns This instance for chaining.
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
     * Adds WHATWG URL parseability validation.
     *
     * @remarks
     * Accepts URLs with credentials and non-HTTP schemes. Performs no DNS lookup or stored-value normalization,
     * and does not enable trimming. Replaces the configured custom validator on this builder.
     *
     * @param message - The validation error message. Defaults to the built-in URL validation message.
     *
     * @returns This instance for chaining.
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
