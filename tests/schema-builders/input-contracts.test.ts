import { Types } from 'mongoose';
import {
    describe,
    expectTypeOf,
    it,
} from 'vitest';

import {
    date,
    decimal128,
    int32,
    number,
    objectId,
    ref,
    string,
} from '../../src/schema-builders';

describe('enum input contracts', () => {
    it('should preserve native enum inputs and inferred literal types', ({ expect }) => {
        const dateOptions = {
            message: 'custom',
            values: [
                new Date(0),
                null,
            ],
        } as const;

        const decimalOptions = {
            message: 'custom',
            values: [
                Types.Decimal128.fromString('1'),
                null,
            ],
        } as const;

        const numberOptions = {
            message: 'custom',
            values: [
                1,
                null,
            ],
        } as const;

        const idOptions = {
            message: 'custom',
            values: [
                new Types.ObjectId(),
                null,
            ],
        } as const;

        const stringOptions = {
            message: 'custom',
            values: [
                'allowed',
                null,
            ],
        } as const;

        const dateDefinition = date().enum(dateOptions).nonRequired;
        const dateArrayDefinition = date().enum(dateOptions.values).nonRequired;
        expectTypeOf(dateDefinition.enum).toEqualTypeOf<typeof dateOptions>();
        expectTypeOf(dateArrayDefinition.enum).toEqualTypeOf<typeof dateOptions.values>();
        expect(dateDefinition.enum).toBe(dateOptions);
        expect(dateArrayDefinition.enum).toBe(dateOptions.values);

        const decimalDefinition = decimal128().enum(decimalOptions).nonRequired;
        const decimalArrayDefinition = decimal128().enum(decimalOptions.values).nonRequired;
        expectTypeOf(decimalDefinition.enum).toEqualTypeOf<typeof decimalOptions>();
        expectTypeOf(decimalArrayDefinition.enum).toEqualTypeOf<typeof decimalOptions.values>();
        expect(decimalDefinition.enum).toBe(decimalOptions);
        expect(decimalArrayDefinition.enum).toBe(decimalOptions.values);

        const numberDefinition = number().enum(numberOptions).nonRequired;
        const numberArrayDefinition = number().enum(numberOptions.values).nonRequired;
        expectTypeOf(numberDefinition.enum).toEqualTypeOf<typeof numberOptions>();
        expectTypeOf(numberArrayDefinition.enum).toEqualTypeOf<typeof numberOptions.values>();
        expect(numberDefinition.enum).toBe(numberOptions);
        expect(numberArrayDefinition.enum).toBe(numberOptions.values);

        const idDefinition = objectId().enum(idOptions).nonRequired;
        const idArrayDefinition = objectId().enum(idOptions.values).nonRequired;
        expectTypeOf(idDefinition.enum).toEqualTypeOf<typeof idOptions>();
        expectTypeOf(idArrayDefinition.enum).toEqualTypeOf<typeof idOptions.values>();
        expect(idDefinition.enum).toBe(idOptions);
        expect(idArrayDefinition.enum).toBe(idOptions.values);

        const refDefinition = ref('Contract').enum(idOptions).nonRequired;
        const refArrayDefinition = ref('Contract').enum(idOptions.values).nonRequired;
        expectTypeOf(refDefinition.enum).toEqualTypeOf<typeof idOptions>();
        expectTypeOf(refArrayDefinition.enum).toEqualTypeOf<typeof idOptions.values>();
        expect(refDefinition.enum).toBe(idOptions);
        expect(refArrayDefinition.enum).toBe(idOptions.values);

        const stringDefinition = string().enum(stringOptions).nonRequired;
        const stringArrayDefinition = string().enum(stringOptions.values).nonRequired;
        expectTypeOf(stringDefinition.enum).toEqualTypeOf<typeof stringOptions>();
        expectTypeOf(stringArrayDefinition.enum).toEqualTypeOf<typeof stringOptions.values>();
        expect(stringDefinition.enum).toBe(stringOptions);
        expect(stringArrayDefinition.enum).toBe(stringOptions.values);
    });

    it('should preserve enum boundary behavior through int32', ({ expect }) => {
        const readonlyValues = Object.freeze([
            1,
            2,
            null,
        ]);

        const arrayDefinition = int32().enum(readonlyValues).nonRequired;
        const optionsDefinition = int32().enum({ values: readonlyValues }).nonRequired;
        const mutableValues = [
            1,
            null,
        ];

        const snapshot = int32().enum({
            message: '',
            values: mutableValues,
        }).nonRequired;

        mutableValues.length = 0;

        for (const definition of [
            arrayDefinition,
            optionsDefinition,
        ]) {
            expect(definition.validate[0]).toMatchObject({ enumValues: readonlyValues });
            if (definition.validate[0]?.type === 'enum') {
                expectTypeOf(definition.validate[0].enumValues).toEqualTypeOf<Array<null | number>>();
                expect(definition.validate[0].enumValues).not.toBe(readonlyValues);
            } else throw new Error('Expected an enum validator');
        }

        expect(snapshot.validate[0]).toMatchObject({
            enumValues: [
                1,
                null,
            ],
            message: '',
        });

        expect(int32().enum({
            message: 2,
            values: 1,
        }).nonRequired.validate[0])
            .toMatchObject({
                enumValues: [
                    2,
                    1,
                ],
            });

        expect(int32().enum({
            message: 2,
            values: null,
        }).nonRequired.validate[0])
            .toMatchObject({
                enumValues: [
                    2,
                    null,
                ],
            });

        expect(int32().enum([]).nonRequired.validate[0]).toMatchObject({ enumValues: [] });
        expect(int32().enum({}).nonRequired.validate[0]).toMatchObject({ enumValues: [] });
    });
});

describe('value and message input contracts', () => {
    it('should preserve native limits and their inferred tuple types', ({ expect }) => {
        const numericLimit = [
            3,
            'custom',
        ] as const;

        const dateLimit: [Date, string] = [
            new Date(0),
            'custom',
        ];

        const numberDefinition = number().min(numericLimit).nonRequired;
        const dateDefinition = date().max(dateLimit).nonRequired;
        const stringDefinition = string().length(numericLimit).nonRequired;

        expectTypeOf(numberDefinition.min).toEqualTypeOf<typeof numericLimit>();
        expectTypeOf(dateDefinition.max).toEqualTypeOf<typeof dateLimit>();
        expectTypeOf(stringDefinition.minlength).toEqualTypeOf<typeof numericLimit>();
        expectTypeOf(stringDefinition.maxlength).toEqualTypeOf<typeof numericLimit>();
        expect(numberDefinition.min).toBe(numericLimit);
        expect(dateDefinition.max).toBe(dateLimit);
        expect(stringDefinition.minlength).toBe(numericLimit);
        expect(stringDefinition.maxlength).toBe(numericLimit);
    });

    it('should preserve custom Decimal128 limit objects and empty messages', ({ expect }) => {
        const limit = { toString: () => '1.25' };
        const definition = decimal128().min([
            limit,
            '',
        ] as const).nonRequired;

        expect(definition.validate[0]).toMatchObject({
            message: '',
            min: '1.25',
            type: 'min',
        });
    });
});

function checkRejectedInputs() {
    const invalidOptions = {
        message: 123,
        values: [],
    };

    const invalidNumberTuple = [
        1,
        123,
    ] as const;

    const invalidDateTuple = [
        new Date(0),
        123,
    ] as const;

    // @ts-expect-error Enum elements must match the builder's value type.
    date().enum([true]);
    // @ts-expect-error Enum messages must remain strings.
    date().enum(invalidOptions);
    // @ts-expect-error Enum elements must match the builder's value type.
    decimal128().enum([true]);
    // @ts-expect-error Enum messages must remain strings.
    decimal128().enum(invalidOptions);
    // @ts-expect-error Enum elements must match the builder's value type.
    number().enum([true]);
    // @ts-expect-error Enum messages must remain strings.
    number().enum(invalidOptions);
    // @ts-expect-error Enum elements must match the builder's value type.
    objectId().enum([true]);
    // @ts-expect-error Enum messages must remain strings.
    objectId().enum(invalidOptions);
    // @ts-expect-error Enum elements must match the builder's value type.
    ref('Contract').enum([true]);
    // @ts-expect-error Enum messages must remain strings.
    ref('Contract').enum(invalidOptions);
    // @ts-expect-error Enum elements must match the builder's value type.
    string().enum([true]);
    // @ts-expect-error Enum messages must remain strings.
    string().enum(invalidOptions);
    // @ts-expect-error Tuple messages must remain strings.
    number().min(invalidNumberTuple);
    // @ts-expect-error Tuple messages must remain strings.
    date().max(invalidDateTuple);
    // @ts-expect-error Tuple messages must remain strings.
    string().length(invalidNumberTuple);
}

void checkRejectedInputs;
