import { Decimal } from 'decimal.js';
import {
    model,
    Schema,
    Types,
} from 'mongoose';
import {
    describe,
    it,
} from 'vitest';

import { decimal128SchemaBuilder } from '../../src/schema-builders';

describe.concurrent('decimal128SchemaBuilder', () => {
    it('should create a schema with the correct type for Decimal128', ({ expect }) => {
        expect(decimal128SchemaBuilder().nonRequired).toEqual({ type: Schema.Types.Decimal128 });
    });

    it('should return the string representation of Decimal128 when using setToStringGetter', ({ expect }) => {
        const schema = decimal128SchemaBuilder().setToStringGetter.nonRequired;
        expect(schema.get(new Types.Decimal128('114514.1919810'))).toEqual('114514.1919810');
    });

    it('should return the undefined representation of Decimal128 when using setToStringGetter', ({ expect }) => {
        const schema = decimal128SchemaBuilder().setToStringGetter.nonRequired;
        expect(schema.get()).toBeUndefined();
    });

    it('should set the value correctly with rounding and fixed decimal places', ({ expect }) => {
        const schema1 = decimal128SchemaBuilder().setRoundAndToFixedSetter().nonRequired;
        expect(schema1.set('114514.1919810')).toEqual('114514.19');
        expect(schema1.set(0)).toEqual('0.00');
        const schema2 = decimal128SchemaBuilder().setRoundAndToFixedSetter(1, Decimal.ROUND_UP).nonRequired;
        expect(schema2.set(114514.191981)).toEqual('114514.2');
        const schema3 = decimal128SchemaBuilder().setRoundAndToFixedSetter(undefined, Decimal.ROUND_UP).nonRequired;
        expect(schema3.set({ toString: () => '114514.1919810' })).toEqual('114514.20');
    });

    it('should return undefined when setting undefined with setRoundAndToFixedSetter', ({ expect }) => {
        const schema = decimal128SchemaBuilder().setRoundAndToFixedSetter().nonRequired;
        expect(schema.set(undefined)).toBeUndefined();
    });

    it('should validate Decimal128 minimum and maximum values precisely', ({ expect }) => {
        const schema = decimal128SchemaBuilder()
            .min('0.1000000000000000001')
            .max('0.2000000000000000001')
            .nonRequired;

        expect(schema.validate).toHaveLength(2);
        expect(schema.validate[0]?.validator(new Types.Decimal128('0.1'))).toBe(false);
        expect(schema.validate[0]?.validator(new Types.Decimal128('0.1000000000000000001'))).toBe(true);
        expect(schema.validate[1]?.validator(new Types.Decimal128('0.2000000000000000002'))).toBe(false);
        expect(schema.validate[1]?.validator(new Types.Decimal128('0.2000000000000000001'))).toBe(true);
    });

    it('should support custom range messages and validate through Mongoose', ({ expect }) => {
        const schema = new Schema({
            amount: decimal128SchemaBuilder()
                .min([
                    '1.25',
                    'Too small: {MIN}',
                ])
                .max('5.75')
                .nonRequired,
        });

        const AmountModel = model('Decimal128RangeTest', schema);

        expect(new AmountModel({ amount: '1.24' }).validateSync()?.errors.amount?.message).toBe('Too small: 1.25');
        expect(new AmountModel({ amount: '5.76' }).validateSync()?.errors.amount?.kind).toBe('max');
        expect(new AmountModel({ amount: '3.50' }).validateSync()).toBeUndefined();
    });

    it('should ignore nullish values for range validation', ({ expect }) => {
        const schema = decimal128SchemaBuilder().min('0').max('10').nonRequired;

        expect(schema.validate[0]?.validator(null)).toBe(true);
        expect(schema.validate[0]?.validator(undefined)).toBe(true);
    });
});
