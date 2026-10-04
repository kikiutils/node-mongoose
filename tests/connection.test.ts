import mongoose, { Schema } from 'mongoose';
import type { Connection } from 'mongoose';
import {
    afterEach,
    beforeEach,
    describe,
    it,
    vi,
} from 'vitest';

import type { BaseMongoosePaginateModel } from '../src/types';

type TestModel = BaseMongoosePaginateModel<TestDoc>;

interface TestDoc {
    name?: null | string;
}

describe('default connection', () => {
    let connection: Connection;

    beforeEach(() => {
        vi.resetModules();
        vi.stubEnv('MONGODB_URI', '');
        connection = mongoose.createConnection();
        vi.spyOn(mongoose, 'createConnection').mockReturnValue(connection);
    });

    afterEach(async () => {
        vi.restoreAllMocks();
        vi.unstubAllEnvs();
        await connection.destroy();
    });

    it('should not create a connection on import', async ({ expect }) => {
        await import('../src/connection');
        await import('../src/options');
        await import('../src/builders');

        expect(mongoose.createConnection).not.toHaveBeenCalled();
    });

    it('should create and reuse the default connection with the fallback URI', async ({ expect }) => {
        const { getDefaultMongooseConnection } = await import('../src/connection');

        expect(getDefaultMongooseConnection()).toBe(connection);
        expect(getDefaultMongooseConnection()).toBe(connection);
        expect(mongoose.createConnection).toHaveBeenCalledExactlyOnceWith('mongodb://127.0.0.1:27017', undefined);
    });

    it('should use the environment URI and configured connection options', async ({ expect }) => {
        vi.stubEnv('MONGODB_URI', 'mongodb://127.0.0.1:27017/custom');
        const { setCustomMongooseOptions } = await import('../src/options');
        const { getDefaultMongooseConnection } = await import('../src/connection');
        const options = {
            maxPoolSize: 20,
            serverSelectionTimeoutMS: 5000,
        };

        setCustomMongooseOptions('defaultConnectionOptions', options);
        getDefaultMongooseConnection();

        expect(mongoose.createConnection).toHaveBeenCalledExactlyOnceWith(process.env.MONGODB_URI, options);
    });

    it.for([
        {
            name: 'replacement',
            options: { maxPoolSize: 10 },
        },
        {
            name: 'clearing',
            options: undefined,
        },
    ])(
        'should apply options $name before the default connection is created',
        async ({ options }, { expect }) => {
            const { setCustomMongooseOptions } = await import('../src/options');
            const { getDefaultMongooseConnection } = await import('../src/connection');
            setCustomMongooseOptions('defaultConnectionOptions', { maxPoolSize: 20 });

            setCustomMongooseOptions('defaultConnectionOptions', options);
            const result = getDefaultMongooseConnection();

            expect(result).toBe(connection);
            expect(mongoose.createConnection).toHaveBeenCalledExactlyOnceWith('mongodb://127.0.0.1:27017', options);
        },
    );

    it('should allow beforeModelBuild changes after the default connection is created', async ({ expect }) => {
        const { getDefaultMongooseConnection } = await import('../src/connection');
        const { setCustomMongooseOptions } = await import('../src/options');
        const { buildMongooseModel } = await import('../src/builders');
        getDefaultMongooseConnection();
        const schema = new Schema<TestDoc, TestModel>(
            { name: String },
            {
                autoCreate: false,
                autoIndex: false,
            },
        );

        setCustomMongooseOptions('beforeModelBuild', (schema) => schema.set('versionKey', false));

        const model = buildMongooseModel('configured', 'Configured', schema);

        expect(model.schema.get('versionKey')).toBe(false);
    });

    it('should reject setting or clearing connection options after creation', async ({ expect }) => {
        const { setCustomMongooseOptions } = await import('../src/options');
        const { getDefaultMongooseConnection } = await import('../src/connection');
        getDefaultMongooseConnection();

        expect(() => setCustomMongooseOptions('defaultConnectionOptions', { maxPoolSize: 20 }))
            .toThrow('Default connection options must be set before the default connection is created.');

        expect(() => setCustomMongooseOptions('defaultConnectionOptions', undefined))
            .toThrow('Default connection options must be set before the default connection is created.');
    });

    it('should not cache a connection when creation throws', async ({ expect }) => {
        const { setCustomMongooseOptions } = await import('../src/options');
        const { getDefaultMongooseConnection } = await import('../src/connection');
        vi.mocked(mongoose.createConnection).mockImplementationOnce(() => {
            throw new Error('creation failed');
        });

        expect(getDefaultMongooseConnection).toThrow('creation failed');

        setCustomMongooseOptions('defaultConnectionOptions', { maxPoolSize: 10 });

        expect(getDefaultMongooseConnection()).toBe(connection);
    });

    it('should create the default connection during model building and reuse it', async ({ expect }) => {
        const { buildMongooseModel } = await import('../src/builders');
        const schema = () => new Schema<TestDoc, TestModel>(
            { name: String },
            {
                autoCreate: false,
                autoIndex: false,
            },
        );

        const original = buildMongooseModel('first', 'First', schema());
        const copy = buildMongooseModel('second', 'Second', schema());

        expect(original.db).toBe(connection);
        expect(copy.db).toBe(connection);
        expect(mongoose.createConnection).toHaveBeenCalledTimes(1);
    });

    it('should not initialize or lock default options when an explicit connection is used', async ({ expect }) => {
        const { buildMongooseModel } = await import('../src/builders');
        const { setCustomMongooseOptions } = await import('../src/options');
        setCustomMongooseOptions('defaultConnectionOptions', { maxPoolSize: 20 });
        const schema = new Schema<TestDoc, TestModel>(
            { name: String },
            {
                autoCreate: false,
                autoIndex: false,
            },
        );

        const model = buildMongooseModel('custom', 'Custom', schema, { connection });

        expect(model.db).toBe(connection);
        expect(mongoose.createConnection).not.toHaveBeenCalled();

        setCustomMongooseOptions('defaultConnectionOptions', { maxPoolSize: 10 });
        const { getDefaultMongooseConnection } = await import('../src/connection');

        expect(getDefaultMongooseConnection()).toBe(connection);
        expect(mongoose.createConnection)
            .toHaveBeenCalledExactlyOnceWith('mongodb://127.0.0.1:27017', { maxPoolSize: 10 });
    });
});
