import { objectValues } from 'ts-extras';

import type {
    EnumInput,
    EnumOptions,
    Readonlyable,
    ValueWithMessage,
} from '../types/_internals';

// Constants/Variables
export const defaultEnumValidateMessage = 'Path `{PATH}` ({VALUE}) is not a valid enum value.';
export const defaultMinValidateMessage = 'Path `{PATH}` ({VALUE}) is less than minimum allowed value ({MIN}).';
export const defaultMaxValidateMessage = 'Path `{PATH}` ({VALUE}) is more than maximum allowed value ({MAX}).';

// Functions
function isEnumArray<T>(value: EnumInput<T>): value is readonly T[] {
    return Array.isArray(value);
}

function isEnumOptions<T>(value: EnumOptions<T> | Record<string, T>): value is EnumOptions<T> {
    return 'values' in value && Array.isArray(value.values);
}

function isValueMessageTuple<T>(value: ValueWithMessage<T>): value is Readonlyable<[T, string]> {
    return Array.isArray(value);
}

export function normalizeEnumValues<T>(value: EnumInput<T>): { enumValues: T[]; message?: string } {
    if (isEnumArray(value)) return { enumValues: [...value] };
    if (isEnumOptions(value)) {
        return {
            enumValues: [...value.values],
            message: typeof value.message === 'string' ? value.message : undefined,
        };
    }

    return { enumValues: objectValues(value) };
}

export function normalizeValueWithMessage<T>(value: ValueWithMessage<T>): readonly [T, string | undefined] {
    return isValueMessageTuple(value)
        ? value
        : [
            value,
            undefined,
        ];
}
