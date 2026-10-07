import type {
    GetLeanResultType,
    Types,
} from 'mongoose';
import {
    describe,
    expectTypeOf,
    it,
} from 'vitest';

import type {
    BaseMongooseDocType,
    MongooseHydratedDocument,
} from '../src/types';
import type { DataToBaseMongooseDocType } from '../src/types/data';

describe('document _id types', () => {
    it('defaults to a required ObjectId without exposing the data id', () => {
        type Doc = BaseMongooseDocType<{ id: string; name: string }>;
        expectTypeOf<Doc['_id']>().toEqualTypeOf<Types.ObjectId>();
        expectTypeOf<Doc>().toExtend<{ _id: Types.ObjectId }>();
        expectTypeOf<Doc>().not.toHaveProperty('id');
        expectTypeOf<Doc['createdAt']>().toEqualTypeOf<Date>();
        expectTypeOf<Doc['updatedAt']>().toEqualTypeOf<Date>();
    });

    it('preserves explicitly declared string, number and UUID ids', () => {
        expectTypeOf<BaseMongooseDocType<{ _id: string }>['_id']>().toEqualTypeOf<string>();
        expectTypeOf<BaseMongooseDocType<{ _id: number }>['_id']>().toEqualTypeOf<number>();
        expectTypeOf<BaseMongooseDocType<{ _id: Types.UUID }>['_id']>().toEqualTypeOf<Types.UUID>();
    });

    it('makes an optional custom id required for persisted documents', () => {
        type Doc = BaseMongooseDocType<{ _id?: string }>;
        expectTypeOf<Doc['_id']>().toEqualTypeOf<string>();
        expectTypeOf<Doc>().toExtend<{ _id: string }>();
    });

    it('omits _id when disabled, even if the input declares one', () => {
        type Child = BaseMongooseDocType<{ name: string }, false, false, false>;
        type CustomChild = BaseMongooseDocType<{ _id: string; name: string }, false, false, false>;
        expectTypeOf<Child>().toEqualTypeOf<{ name: string }>();
        expectTypeOf<CustomChild>().toEqualTypeOf<{ name: string }>();
    });

    it('does not recursively add or change ids on nested objects or arrays', () => {
        type Child = BaseMongooseDocType<{ name: string }, false, false, false>;
        interface Fields {
            child: Child;
            children: BaseMongooseDocType<{ _id: number }, false, false>[];
            metadata: { label: string };
        }
        type Doc = BaseMongooseDocType<Fields>;
        expectTypeOf<Doc['child']>().toEqualTypeOf<Child>();
        expectTypeOf<Doc['children'][number]['_id']>().toEqualTypeOf<number>();
        expectTypeOf<Doc['metadata']>().not.toHaveProperty('_id');
    });

    it('keeps timestamp options independent of the id option', () => {
        type Doc = BaseMongooseDocType<{ name: string }, false, false>;
        expectTypeOf<Doc['_id']>().toEqualTypeOf<Types.ObjectId>();
        expectTypeOf<Doc>().not.toHaveProperty('createdAt');
        expectTypeOf<Doc>().not.toHaveProperty('updatedAt');
        type NoId = BaseMongooseDocType<{ name: string }, true, false, false>;
        expectTypeOf<NoId['createdAt']>().toEqualTypeOf<Date>();
        expectTypeOf<NoId>().not.toHaveProperty('_id');
        expectTypeOf<NoId>().not.toHaveProperty('updatedAt');
    });

    it('adds an id while preserving data field conversions', () => {
        type Doc = DataToBaseMongooseDocType<
            { createdAt: string; id: string; owner: string; sentAt: string; updatedAt: string },
            'owner',
            'sentAt'
        >;

        expectTypeOf<Doc['_id']>().toEqualTypeOf<Types.ObjectId>();
        expectTypeOf<Doc['owner']>().toEqualTypeOf<Types.ObjectId>();
        expectTypeOf<Doc['sentAt']>().toEqualTypeOf<Date>();
        expectTypeOf<Doc['createdAt']>().toEqualTypeOf<Date>();
        expectTypeOf<Doc>().not.toHaveProperty('id');
    });

    it('supports custom and disabled ids in data conversions', () => {
        type Custom = DataToBaseMongooseDocType<{ _id: string; id: string }>;
        type Child = DataToBaseMongooseDocType<{ _id: number; name: string }, never, never, false, false, false>;
        expectTypeOf<Custom['_id']>().toEqualTypeOf<string>();
        expectTypeOf<Child>().toEqualTypeOf<{ name: string }>();
    });

    it('provides ids to lean result types without relying on mongoose to add them', () => {
        type Doc = BaseMongooseDocType<{ name: string }>;
        type Lean = GetLeanResultType<Doc, MongooseHydratedDocument<Doc>, 'findOne'>;
        type Custom = BaseMongooseDocType<{ _id: string }>;
        type CustomLean = GetLeanResultType<Custom, MongooseHydratedDocument<Custom>, 'findOne'>;
        expectTypeOf<Lean['_id']>().toEqualTypeOf<Types.ObjectId>();
        expectTypeOf<CustomLean['_id']>().toEqualTypeOf<string>();
    });
});
