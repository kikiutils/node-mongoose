import {
    customMongooseOptions,
    mongooseConnectionState,
} from './_internals';
import type { CustomMongooseOptions } from './types/options';

export function setCustomMongooseOptions<K extends keyof CustomMongooseOptions>(
    key: K,
    value: CustomMongooseOptions[K],
) {
    if (key === 'defaultConnectionOptions' && mongooseConnectionState.defaultConnection) {
        throw new Error('Default connection options must be set before the default connection is created.');
    }

    customMongooseOptions[key] = value;
}
