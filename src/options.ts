import { customMongooseOptions } from '@/_internals';
import type { CustomMongooseOptions } from '@/types/options';
import type { buildMongooseModel } from '@/utils';

export type DoNotRemoveOrUseThisType = typeof buildMongooseModel;

/**
 * Sets custom options.
 *
 * For example, you can set {@link CustomMongooseOptions.beforeModelBuild} to define a function that will be called
 * every time {@link buildMongooseModel} is used. Inside this function, you can modify
 * the schema, allowing you to apply common settings to all global schemas.
 */
export function setCustomMongooseOptions<K extends keyof CustomMongooseOptions>(
    key: K,
    value: CustomMongooseOptions[K],
) {
    customMongooseOptions[key] = value;
}
