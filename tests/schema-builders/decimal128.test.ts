import { Decimal } from 'decimal.js';
import {
    deleteModel,
    model,
    Schema,
    Types,
} from 'mongoose';
import {
    afterEach,
    describe,
    it,
} from 'vitest';

import { decimal128SchemaBuilder } from '../../src/schema-builders';

describe('decimal128SchemaBuilder', () => {
    afterEach(() => deleteModel(/^Decimal128RangeTest/));

    it('should create a schema with the correct type for Decimal128', ({ expect }) => {
        expect(decimal128SchemaBuilder().nonRequired).toEqual({ type: Schema.Types.Decimal128 });
    });

    it('should return the string representation of Decimal128 when using setToStringGetter', ({ expect }) => {
        const schema = decimal128SchemaBuilder().setToStringGetter.nonRequired;

        expect(schema.get(new Types.Decimal128('114.1910'))).toBe('114.1910');
    });

    it('should preserve undefined when using setToStringGetter', ({ expect }) => {
        const schema = decimal128SchemaBuilder().setToStringGetter.nonRequired;

        expect(schema.get()).toBeUndefined();
    });

    it.for([
        {
            expected: '114.19',
            input: '114.191',
            name: 'default precision and rounding',
            places: undefined,
            rounding: undefined,
        },
        {
            expected: '0.00',
            input: 0,
            name: 'zero with default precision',
            places: undefined,
            rounding: undefined,
        },
        {
            expected: '114.2',
            input: 114.191,
            name: 'custom precision and rounding',
            places: 1,
            rounding: Decimal.ROUND_UP,
        },
        {
            expected: '114.20',
            input: { toString: () => '114.191' },
            name: 'stringifiable input and custom rounding',
            places: undefined,
            rounding: Decimal.ROUND_UP,
        },
    ])(
        'should format values with $name',
        (
            {
                expected,
                input,
                places,
                rounding,
            },
            { expect },
        ) => {
            const schema = decimal128SchemaBuilder().setRoundAndToFixedSetter(places, rounding).nonRequired;

            expect(schema.set(input)).toBe(expected);
        },
    );

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

    it('should expose custom minimum messages and maximum errors through Mongoose', async ({ expect }) => {
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

        await expect(new AmountModel({ amount: '1.24' }).validate()).rejects.toMatchObject({
            errors: {
                amount: {
                    kind: 'min',
                    message: 'Too small: 1.25',
                },
            },
        });

        await expect(new AmountModel({ amount: '5.76' }).validate())
            .rejects
            .toMatchObject({ errors: { amount: { kind: 'max' } } });

        await expect(new AmountModel({ amount: '3.50' }).validate()).resolves.toBeUndefined();
    });

    it('should ignore nullish values for range validation', ({ expect }) => {
        const schema = decimal128SchemaBuilder().min('0').max('10').nonRequired;

        expect(schema.validate[0]?.validator(null)).toBe(true);
        expect(schema.validate[0]?.validator(undefined)).toBe(true);
    });
});
