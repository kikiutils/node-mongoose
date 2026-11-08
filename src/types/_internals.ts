export type EnumInput<T, M extends string = string> = EnumOptions<T, M> | Readonlyable<T[]> | Record<string, T>;
export type Readonlyable<T> = Readonly<T> | T;
export type ValueWithMessage<T, M extends string = string> = Readonlyable<[T, M]> | T;

export interface EnumOptions<T, M extends string = string> {
    message?: M;
    values: Readonlyable<T[]>;
}
