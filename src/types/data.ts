import type { SetFieldType } from 'type-fest';

import type { IfElse } from './utils';

declare global {
    /**
     * Type definition for the base data of a Mongoose model, optionally including timestamp fields.
     *
     * @template CreatedAtField - A boolean flag indicating whether the `createdAt` field should be included.
     * @template UpdatedAtField - A boolean flag indicating whether the `updatedAt` field should be included.
     */
    type BaseMongooseModelData<
        CreatedAtField extends boolean = true,
        UpdatedAtField extends boolean = true,
    > =
      & IfElse<CreatedAtField, { createdAt: string }, unknown>
      & IfElse<UpdatedAtField, { updatedAt: string }, unknown>
      & { id: string };

    type DataToBaseMongooseDocType<
        T,
        ObjectIdFields extends keyof T = never,
        DateFields extends Exclude<keyof T, ObjectIdFields> = never,
        CreatedAtField extends boolean = true,
        UpdatedAtField extends boolean = true,
    > = BaseMongooseDocType<
        SetFieldsToObjectId<SetFieldType<T, DateFields, Date>, ObjectIdFields>,
        CreatedAtField,
        UpdatedAtField
    >;

    /**
     * Type definition to omit timestamp fields (`createdAt`, `updatedAt`)
     * and other specified fields (`K`) from a given type `T`.
     *
     * @template T - The type from which to omit fields.
     * @template K - Additional fields to omit, specified as a union of keys in `T`.
     */
    type ExceptMongooseTimestampAndOtherFields<T, K extends keyof T> = Omit<T, 'createdAt' | 'updatedAt' | K>;

    /**
     * Type definition to omit timestamp fields (`createdAt`, `updatedAt`)
     * and other specified fields (`K`) from a given type `T`.
     *
     * @template T - The type from which to omit fields.
     * @template K - Additional fields to omit, specified as a union of string, number, or symbol keys.
     */
    type OmitMongooseTimestampAndOtherFields<
        T,
        K extends number | string | symbol = never,
    > = Omit<
        T,
        'createdAt' | 'updatedAt' | K
    >;

    /**
     * Type definition for including timestamp fields conditionally based on the provided flags.
     *
     * @template CreatedAt - A boolean flag indicating whether the `createdAt` field should be included.
     * @template UpdatedAt - A boolean flag indicating whether the `updatedAt` field should be included.
     */
    type WithMongooseTimestampFieldsData<
        CreatedAt extends boolean = true,
        UpdatedAt extends boolean = true,
    > =
      & IfElse<CreatedAt, { createdAt: string }, object>
      & IfElse<UpdatedAt, { updatedAt: string }, object>;
}
