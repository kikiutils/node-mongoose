import type { SetFieldType } from 'type-fest';

import type {
    BaseMongooseDocType,
    SetFieldsToObjectId,
} from './';

export type BaseMongooseModelData<CreatedAtField extends boolean = true, UpdatedAtField extends boolean = true> =
  & (CreatedAtField extends true ? { createdAt: string } : unknown)
  & (UpdatedAtField extends true ? { updatedAt: string } : unknown)
  & { id: string };

export type DataToBaseMongooseDocType<
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
