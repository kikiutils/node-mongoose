import { customMongooseOptions } from './_internals';
import type { CustomMongooseOptions } from './types/options';

export function setCustomMongooseOptions<K extends keyof CustomMongooseOptions>(
    key: K,
    value: CustomMongooseOptions[K],
) {
    customMongooseOptions[key] = value;
}
