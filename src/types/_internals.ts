export type IfElse<
    Condition,
    Then,
    Else,
    ReferenceCondition = true,
> = Condition extends ReferenceCondition ? Then : Else;

export type Readonlyable<T> = Readonly<T> | T;
