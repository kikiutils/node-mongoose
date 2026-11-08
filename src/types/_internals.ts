export type EnumInput<T, M extends string = string> = EnumOptions<T, M> | Readonlyable<T[]> | Record<string, T>;
export type Readonlyable<T> = Readonly<T> | T;
export type ValueWithMessage<T, M extends string = string> = Readonlyable<[T, M]> | T;

export interface EnumOptions<T, M extends string = string> {
    message?: M;
    values: Readonlyable<T[]>;
}

export interface EnumValidator<T, V = T> {
    enumValues: Array<null | T>;
    message: string;
    type: 'enum';
    validator: (value: null | undefined | V) => boolean;
}

export interface LimitValidator<L, V = L> {
    max?: L;
    message: string;
    min?: L;
    type: 'max' | 'min';
    validator: (value: null | undefined | V) => boolean;
}

export interface ValidationSchema<T> {
    validate: T[];
}
