import type { IfElse } from './utils';

/**
 * Interface for the base data of a Mongoose model, optionally including timestamp fields.
 *
 * This interface extends `LocalWithTimestampFieldsData` to optionally include `createdAt`
 * and `updatedAt` fields based on the `CreatedAtField` and `UpdatedAtField` flags.
 * It also includes a mandatory `id` field.
 *
 * @template CreatedAtField - A boolean flag indicating whether the `createdAt` field should be included.
 * @template UpdatedAtField - A boolean flag indicating whether the `updatedAt` field should be included.
 */
interface LocalBaseMongooseModelData<
    CreatedAtField extends boolean = true,
    UpdatedAtField extends boolean = true,
> extends LocalWithTimestampFieldsData<CreatedAtField, UpdatedAtField> {
    id: string;
}

/**
 * Interface for including timestamp fields conditionally based on the provided flags.
 *
 * This interface conditionally includes `createdAt` and `updatedAt` fields based on
 * the `CreatedAt` and `UpdatedAt` boolean flags. If the flag is true, the respective
 * field is included, otherwise it is set to `never`.
 *
 * @template CreatedAt - A boolean flag indicating whether the `createdAt` field should be included.
 * @template UpdatedAt - A boolean flag indicating whether the `updatedAt` field should be included.
 */
interface LocalWithTimestampFieldsData<CreatedAt extends boolean = true, UpdatedAt extends boolean = true> {
    createdAt: IfElse<CreatedAt, string, never>;
    updatedAt: IfElse<UpdatedAt, string, never>;
}

/**
 * Utility type to omit properties that are set to `never` in a given type.
 *
 * This type alias iterates over the properties of a given type `T` and removes any
 * properties that are set to `never`.
 *
 * @template T - The type from which to omit `never` properties.
 */
type OmitNever<T> = { [P in keyof T as IfElse<T[P], never, P, never>]: T[P] };

declare global {
    /**
     * Type definition for the base data of a Mongoose model, optionally including timestamp fields.
     *
     * This type alias uses `OmitNever` to remove any `never` properties from `LocalBaseMongooseModelData`
     * based on the presence of the `CreatedAtField` and `UpdatedAtField` flags.
     *
     * @template CreatedAtField - A boolean flag indicating whether the `createdAt` field should be included.
     * @template UpdatedAtField - A boolean flag indicating whether the `updatedAt` field should be included.
     */
    type BaseMongooseModelData<
        CreatedAtField extends boolean = true,
        UpdatedAtField extends boolean = true,
    > = OmitNever<LocalBaseMongooseModelData<CreatedAtField, UpdatedAtField>>;

    /**
     * Type definition to omit timestamp fields (`createdAt`, `updatedAt`)
     * and other specified fields (`OT`) from a given type `T`.
     *
     * @template T - The type from which to omit fields.
     * @template OT - Additional fields to omit, specified as a union of keys in `T`.
     */
    type ExceptMongooseTimestampAndOtherFields<T, OT extends keyof T> = Omit<T, 'createdAt' | 'updatedAt' | OT>;

    /**
     * Type definition to omit timestamp fields (`createdAt`, `updatedAt`)
     * and other specified fields (`OT`) from a given type `T`.
     *
     * @template T - The type from which to omit fields.
     * @template OT - Additional fields to omit, specified as a union of string, number, or symbol keys.
     */
    type OmitMongooseTimestampAndOtherFields<
        T,
        OT extends number | string | symbol = never,
    > = Omit<
        T,
        'createdAt' | 'updatedAt' | OT
    >;

    /**
     * Type definition for including timestamp fields conditionally based on the provided flags.
     *
     * This type alias uses `OmitNever` to remove any `never` properties from `LocalWithTimestampFieldsData`
     * based on the presence of the `CreatedAt` and `UpdatedAt` flags.
     *
     * @template CreatedAt - A boolean flag indicating whether the `createdAt` field should be included.
     * @template UpdatedAt - A boolean flag indicating whether the `updatedAt` field should be included.
     */
    type WithMongooseTimestampFieldsData<
        CreatedAt extends boolean = true,
        UpdatedAt extends boolean = true,
    > = OmitNever<LocalWithTimestampFieldsData<CreatedAt, UpdatedAt>>;
}

export {};
