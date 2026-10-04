import mongoose from 'mongoose';
import type { Connection } from 'mongoose';

import {
    customMongooseOptions,
    mongooseConnectionState,
} from './_internals';

export function getDefaultMongooseConnection(): Connection {
    return mongooseConnectionState.defaultConnection ||= mongoose.createConnection(
        process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017',
        customMongooseOptions.defaultConnectionOptions,
    );
}
