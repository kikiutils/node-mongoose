import type { Schema } from 'mongoose';

type BaseSchemaType =
  | BooleanConstructor
  | DateConstructor
  | NumberConstructor
  | Schema.Types.ObjectId['constructor']
  | StringConstructor;

// Constants/Variables
const isFunctionKeys = new Set([
    'default',
    'enum',
    'index',
    'max',
    'maxlength',
    'min',
    'minlength',
]);

// Functions
export function createBaseSchemaBuilderFactory<Builder = Readonly<Record<string, any>>>(type: BaseSchemaType) {
    return (schema: Record<string, any> = {}) => {
        schema.type = type;
        return new Proxy(
            Object.freeze({}),
            {
                get(_, key, receiver) {
                    if (typeof key === 'symbol') throw new Error('Cannot use symbol as a schema attribute');
                    if (key in schema) throw new Error(`Duplicate schema attribute: ${key}`);
                    if (isFunctionKeys.has(key)) {
                        return (value: any) => {
                            schema[key] = value;
                            return receiver;
                        };
                    }

                    if (key === 'nonRequired') return { ...schema };
                    if (key === 'required') {
                        return {
                            ...schema,
                            required: true,
                        };
                    }

                    schema[key] = true;
                    return receiver;
                },
            },
        ) as Builder;
    };
}
