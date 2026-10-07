import {
    connection,
    deleteModel,
    model,
    Schema,
    Types,
} from 'mongoose';
import type { LeanOptions } from 'mongoose';
import mongooseLeanGetters from 'mongoose-lean-getters';
import {
    afterEach,
    describe,
    expectTypeOf,
    it,
    vi,
} from 'vitest';

import { buildMongooseModel } from '../../src/builders';
import { mongooseLeanDecimal128ToStringPlugin } from '../../src/plugins/lean-decimal128-to-string';
import { decimal128SchemaBuilder } from '../../src/schema-builders/decimal128';
import type { BaseMongoosePaginateModel } from '../../src/types';

let modelIndex = 0;
const decimal = (value = '12.34') => Types.Decimal128.fromString(value);
const marked = () => decimal128SchemaBuilder().setToStringGetter.nonRequired;

function createModel(schema: Schema) {
    schema.set('bufferCommands', false);
    schema.set('autoCreate', false);
    schema.set('autoIndex', false);
    return model(`LeanDecimal${modelIndex++}`, schema);
}

function mockFind(TestModel: Pick<ReturnType<typeof createModel>, 'collection'>, results: Record<string, any>[]) {
    let index = 0;
    const cursor = {
        close: vi.fn(() => Promise.resolve()),
        next: vi.fn(() => Promise.resolve(results[index++] ?? null)),
        toArray: vi.fn(() => Promise.resolve(results)),
    };

    vi.spyOn(TestModel.collection, 'find').mockReturnValue(cursor as never);
}

describe('mongooseLeanDecimal128ToStringPlugin', () => {
    it('declares the lean override as an optional boolean', () => {
        expectTypeOf<LeanOptions['decimal128ToString']>().toEqualTypeOf<boolean | undefined>();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        deleteModel(/^LeanDecimal/);
    });

    it('marks builder output and converts only marked paths without running other getters', async ({ expect }) => {
        const getter = vi.fn((value) => `getter:${value}`);
        const schema = new Schema({
            amount: marked(),
            raw: Schema.Types.Decimal128,
            text: {
                get: getter,
                type: String,
            },
        });

        schema.plugin(mongooseLeanDecimal128ToStringPlugin);
        const TestModel = createModel(schema);
        const raw = decimal();
        vi.spyOn(TestModel.collection, 'findOne').mockResolvedValue({
            amount: decimal(),
            raw,
            text: 'original',
        });

        const result = await TestModel.findOne().lean();
        expect(marked().leanDecimal128ToString).toBe(true);
        expect(result).toMatchObject({
            amount: '12.34',
            raw,
            text: 'original',
        });

        expect(getter).not.toHaveBeenCalled();
        const document = new TestModel({ amount: '12.34' });
        expect(document.amount).toBe('12.34');
        expect(document.get('amount', null, { getters: false })).toBeInstanceOf(Types.Decimal128);
    });

    it('handles nested schemas, dotted paths, arrays, maps and nullish/projected values', async ({ expect }) => {
        const child = new Schema({ amount: marked() }, { _id: false });
        const schema = new Schema({
            amount: marked(),
            child,
            children: [child],
            dictionary: {
                of: marked(),
                type: Map,
            },
            mapChildren: {
                of: child,
                type: Map,
            },
            matrix: [[marked()]],
            missing: marked(),
            nested: { amount: marked() },
            nullAmount: marked(),
            undefinedAmount: marked(),
            values: [marked()],
        });

        schema.plugin(mongooseLeanDecimal128ToStringPlugin);
        const TestModel = createModel(schema);
        const value = {
            amount: 'already a string',
            child: { amount: decimal() },
            children: [
                { amount: decimal() },
                null,
                {},
            ],
            dictionary: {
                first: decimal(),
                missing: null,
            },
            mapChildren: new Map([
                [
                    'first',
                    { amount: decimal() },
                ],
            ]),
            matrix: [[decimal()]],
            nested: { amount: decimal() },
            nullAmount: null,
            undefinedAmount: undefined,
            values: [
                decimal(),
                null,
                undefined,
                'string',
            ],
        };

        vi.spyOn(TestModel.collection, 'findOne').mockResolvedValue(value);
        const result = await TestModel.findOne().select('-missing').lean<Record<string, any>>();
        expect(result).toMatchObject({
            amount: 'already a string',
            child: { amount: '12.34' },
            children: [
                { amount: '12.34' },
                null,
                {},
            ],
            dictionary: {
                first: '12.34',
                missing: null,
            },
            matrix: [['12.34']],
            nested: { amount: '12.34' },
            nullAmount: null,
            undefinedAmount: undefined,
            values: [
                '12.34',
                null,
                undefined,
                'string',
            ],
        });

        expect(result?.mapChildren?.get('first')?.amount).toBe('12.34');
        expect(result).not.toHaveProperty('missing');
        expect(result?.children?.[2]).not.toHaveProperty('amount');
    });

    it('supports find results and streaming cursors', async ({ expect }) => {
        const schema = new Schema({ amount: marked() });
        schema.plugin(mongooseLeanDecimal128ToStringPlugin);
        const TestModel = createModel(schema);
        mockFind(
            TestModel,
            [
                { amount: decimal() },
                { amount: decimal('0') },
            ],
        );

        expect(await TestModel.find().lean()).toMatchObject([
            { amount: '12.34' },
            { amount: '0' },
        ]);

        vi.restoreAllMocks();
        mockFind(
            TestModel,
            [
                { amount: decimal() },
                { amount: decimal('0') },
            ],
        );

        const results = [];
        for await (const value of TestModel.find().lean().cursor()) results.push(value);
        expect(results).toMatchObject([
            { amount: '12.34' },
            { amount: '0' },
        ]);
    });

    it('allows defaults and query overrides without converting hydrated documents', async ({ expect }) => {
        const schema = new Schema({ amount: marked() });
        schema.plugin(mongooseLeanDecimal128ToStringPlugin, { enabledByDefault: false });
        schema.plugin(mongooseLeanDecimal128ToStringPlugin); // First registration wins.
        const TestModel = createModel(schema);
        vi.spyOn(TestModel.collection, 'findOne').mockImplementation(() => Promise.resolve({ amount: decimal() }));
        expect((await TestModel.findOne().lean())?.amount).toBeInstanceOf(Types.Decimal128);
        expect((await TestModel.findOne().lean({ decimal128ToString: true }))?.amount).toBe('12.34');
        const disabled = await TestModel.findOne().lean({ decimal128ToString: false });
        expect(disabled?.amount).toBeInstanceOf(Types.Decimal128);
        const document = await TestModel.findOne();
        expect(document?.amount).toBe('12.34');
        expect(document?.get('amount', null, { getters: false })).toBeInstanceOf(Types.Decimal128);
    });

    it('registers through buildMongooseModel by default and supports model opt-out', async ({ expect }) => {
        for (const enabled of [
            undefined,
            true,
            false,
            {},
            { enabledByDefault: false },
        ]) {
            const schema = new Schema<any, BaseMongoosePaginateModel<any>>(
                { amount: marked() },
                {
                    autoCreate: false,
                    autoIndex: false,
                    bufferCommands: false,
                },
            );

            const TestModel = buildMongooseModel(
                'lean_decimal',
                `LeanDecimal${modelIndex++}`,
                schema,
                {
                    connection,
                    plugins: { leanDecimal128ToString: enabled },
                    timestamps: false,
                },
            );

            vi.spyOn(TestModel.collection, 'findOne').mockImplementation(
                () => Promise.resolve({ amount: decimal() }),
            );

            const result = await TestModel.findOne().lean();
            if (enabled !== false && !(typeof enabled === 'object' && enabled.enabledByDefault === false)) {
                expect(result?.amount).toBe('12.34');
                const raw = await TestModel.findOne().lean({ decimal128ToString: false });
                expect(raw?.amount).toBeInstanceOf(Types.Decimal128);
            } else expect(result?.amount).toBeInstanceOf(Types.Decimal128);
        }
    });

    it('converts discriminator-only paths when the discriminator key is projected out', async ({ expect }) => {
        const schema = new Schema({});
        schema.plugin(mongooseLeanDecimal128ToStringPlugin);
        const BaseModel = createModel(schema);
        const ChildModel = BaseModel.discriminator(`LeanDecimal${modelIndex++}`, new Schema({ amount: marked() }));

        vi.spyOn(ChildModel.collection, 'findOne').mockResolvedValue({ amount: decimal() });
        const result = await ChildModel.findOne().select('-__t').lean();
        expect(result).toMatchObject({ amount: '12.34' });
        expect(result).not.toHaveProperty('__t');
        mockFind(ChildModel, [{ amount: decimal() }]);
        expect(await ChildModel.find().select('-__t').lean()).toMatchObject([{ amount: '12.34' }]);
    });

    it('preserves missing query results', async ({ expect }) => {
        const schema = new Schema({ amount: marked() });
        schema.plugin(mongooseLeanDecimal128ToStringPlugin);
        const TestModel = createModel(schema);
        vi.spyOn(TestModel.collection, 'findOne').mockResolvedValue(null);
        expect(await TestModel.findOne().lean()).toBeNull();
    });

    for (const operation of [
        'findOneAndUpdate',
        'findOneAndReplace',
        'findOneAndDelete',
    ] as const) {
        it(`converts ${operation} metadata results without touching metadata`, async ({ expect }) => {
            const schema = new Schema({ amount: marked() });
            schema.plugin(mongooseLeanDecimal128ToStringPlugin);
            const TestModel = createModel(schema);
            vi.spyOn(TestModel.collection, operation).mockResolvedValue({
                ok: 1,
                value: { amount: decimal() },
            } as never);

            const query = operation === 'findOneAndDelete'
                ? TestModel.findOneAndDelete({})
                : operation === 'findOneAndReplace'
                    ? TestModel.findOneAndReplace({}, { amount: '12.34' })
                    : TestModel.findOneAndUpdate({}, { $set: { amount: '12.34' } });

            expect(await query.setOptions({ includeResultMetadata: true }).lean()).toMatchObject({
                ok: 1,
                value: { amount: '12.34' },
            });
        });
    }

    for (const ownFirst of [
        true,
        false,
    ]) {
        it(`coexists on nested fields and cursors (ownFirst=${ownFirst})`, async ({ expect }) => {
            const child = new Schema({ amount: marked() }, { _id: false });
            const schema = new Schema({
                child,
                children: [child],
                values: [marked()],
            });

            if (ownFirst) schema.plugin(mongooseLeanDecimal128ToStringPlugin);
            schema.plugin(mongooseLeanGetters);
            if (!ownFirst) schema.plugin(mongooseLeanDecimal128ToStringPlugin);
            const TestModel = createModel(schema);
            const value = () => ({
                child: { amount: decimal() },
                children: [{ amount: decimal() }],
                values: [decimal()],
            });

            const expected = {
                child: { amount: '12.34' },
                children: [{ amount: '12.34' }],
                values: ['12.34'],
            };

            vi.spyOn(TestModel.collection, 'findOne').mockImplementation(() => Promise.resolve(value()));
            expect(await TestModel.findOne().lean({ getters: true })).toMatchObject(expected);
            mockFind(TestModel, [value()]);
            const result = [];
            for await (const item of TestModel.find().lean({ getters: true }).cursor()) result.push(item);
            expect(result).toMatchObject([expected]);
        });

        for (const getters of [
            true,
            false,
        ]) {
            it(`coexists with mongoose-lean-getters (ownFirst=${ownFirst}, getters=${getters})`, async ({ expect }) => {
                const schema = new Schema({ amount: marked() });
                if (ownFirst) schema.plugin(mongooseLeanDecimal128ToStringPlugin);
                schema.plugin(mongooseLeanGetters, { defaultLeanOptions: { getters: true } });
                if (!ownFirst) schema.plugin(mongooseLeanDecimal128ToStringPlugin);
                const TestModel = createModel(schema);
                vi.spyOn(TestModel.collection, 'findOne').mockImplementation(
                    () => Promise.resolve({ amount: decimal() }),
                );

                expect((await TestModel.findOne().lean({ getters }))?.amount).toBe('12.34');
                mockFind(TestModel, [{ amount: decimal() }]);
                expect(await TestModel.find().lean({ getters })).toMatchObject([{ amount: '12.34' }]);
                const disabled = await TestModel.findOne().lean({
                    decimal128ToString: false,
                    getters: false,
                });

                expect(disabled?.amount).toBeInstanceOf(Types.Decimal128);
                const externalOnly = await TestModel.findOne().lean({
                    decimal128ToString: false,
                    getters: true,
                });

                expect(externalOnly?.amount).toBe('12.34');
            });
        }
    }
});
