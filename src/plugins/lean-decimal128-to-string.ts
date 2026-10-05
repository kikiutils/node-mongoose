import type {
    Query,
    Schema,
    SchemaType,
} from 'mongoose';

declare module 'mongoose' {
    interface LeanOptions {
        /** Override conversion of marked Decimal128 fields. Defaults to the plugin's enabledByDefault setting. */
        decimal128ToString?: boolean;
    }
}

type QueryWithOptionalMap = Query<unknown, unknown> & { map?: (transform: (result: unknown) => unknown) => unknown };

export interface MongooseLeanDecimal128ToStringPluginOptions {
    /** Whether marked fields are converted on lean queries by default. Defaults to true. */
    enabledByDefault?: boolean;
}

// Constants/Variables
const registeredSchemas = new WeakSet<Schema>();

// Functions
const isNonNullObject = (value: unknown): value is Record<string, any> => value !== null && typeof value === 'object';

function convertDocument(schema: Schema, value: unknown) {
    if (!isNonNullObject(value)) return;
    const discriminatorKey = schema.get('discriminatorKey') ?? '__t';
    const discriminatorSchema = Object.values(schema.discriminators ?? {}).find(
        (childSchema) => childSchema.get('discriminatorKey') === discriminatorKey
          && (childSchema as Schema & { discriminatorMapping?: { value: unknown } }).discriminatorMapping?.value
          === value[discriminatorKey],
    );

    const documentSchema = discriminatorSchema ?? schema;
    documentSchema.eachPath((path, schemaType) => {
        // Maps are handled through their embedded schema type, not their synthetic $* path.
        const pathSegments = path.split('.');
        if (pathSegments.includes('$*')) return;
        convertPath(value, pathSegments, schemaType);
    });
}

function convertPath(value: unknown, pathSegments: string[], schemaType: SchemaType) {
    if (Array.isArray(value)) {
        value.forEach((item) => convertPath(item, pathSegments, schemaType));
        return;
    }

    if (!isNonNullObject(value)) return;
    const [key, ...remainingPathSegments] = pathSegments;
    if (key === undefined || !Object.hasOwn(value, key)) return;
    if (remainingPathSegments.length) convertPath(value[key], remainingPathSegments, schemaType);
    else value[key] = convertValue(value[key], schemaType);
}

function convertValue(value: unknown, schemaType: SchemaType): unknown {
    if (value === null || value === undefined) return value;
    const embeddedSchemaType = schemaType.getEmbeddedSchemaType();
    if (embeddedSchemaType && Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            if (Object.hasOwn(value, i)) value[i] = convertValue(value[i], embeddedSchemaType);
        }

        return value;
    }

    if (embeddedSchemaType && schemaType.instance === 'Map') {
        if (value instanceof Map) value.forEach((item, key) => value.set(key, convertValue(item, embeddedSchemaType)));
        else if (isNonNullObject(value)) {
            for (const key of Object.keys(value)) value[key] = convertValue(value[key], embeddedSchemaType);
        }

        return value;
    }

    if (schemaType.schema) {
        convertDocument(schemaType.schema, value);
        return value;
    }

    if (
        schemaType.instance === 'Decimal128'
        && schemaType.options.leanDecimal128ToString === true
        && isNonNullObject(value)
        && value._bsontype === 'Decimal128'
        && typeof value.toString === 'function'
    ) return value.toString();

    return value;
}

/**
 * Converts marked Decimal128 fields to strings on lean queries without invoking getters.
 *
 * @remarks
 * `decimal128().setToStringGetter` sets the `leanDecimal128ToString` schema-path option.
 * Query-level `lean({ decimal128ToString: false })` disables this plugin only, not other plugins.
 * Existing strings and nullish values are preserved. Missing/projected-out fields are not added.
 * Supports nested schemas, arrays and maps. Aggregate results are intentionally not transformed.
 * Registration is idempotent; the first registration's default options take precedence.
 * Runtime conversion does not override Mongoose's inferred lean result types.
 */
export function mongooseLeanDecimal128ToStringPlugin(
    schema: Schema,
    pluginOptions?: MongooseLeanDecimal128ToStringPluginOptions,
) {
    if (registeredSchemas.has(schema)) return;
    registeredSchemas.add(schema);

    function convertResult(query: QueryWithOptionalMap, result: unknown) {
        const leanOptions = query.mongooseOptions().lean;
        if (!leanOptions) return result;
        const conversionEnabled = typeof leanOptions === 'object'
            ? leanOptions.decimal128ToString ?? pluginOptions?.enabledByDefault ?? true
            : pluginOptions?.enabledByDefault ?? true;

        if (!conversionEnabled) return result;
        const document = query.getOptions().includeResultMetadata && isNonNullObject(result) ? result.value : result;
        const querySchema = query.model.schema;
        if (Array.isArray(document)) document.forEach((value) => convertDocument(querySchema, value));
        else convertDocument(querySchema, document);
        return result;
    }

    // Find cursors do not run post('find'); match Mongoose's query/cursor transform surfaces.
    schema.pre(
        'find',
        function (this: QueryWithOptionalMap) {
            const transform = (result: unknown) => convertResult(this, result);
            if (typeof this.map === 'function') this.map(transform);
            else if (typeof this.transform === 'function') this.transform(transform);
            else this.setOptions({ transform });
        },
    );

    schema.post(
        [
            'findOne',
            'findOneAndUpdate',
            'findOneAndDelete',
            'findOneAndReplace',
        ],
        function (this: QueryWithOptionalMap, result: unknown) {
            convertResult(this, result);
        },
    );
}
