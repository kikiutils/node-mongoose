import type { MongooseConnections } from '@/types';

/**
 * Mongoose connections.
 *
 * This constant is a record of named Mongoose connections, allowing multiple
 * database connections to be managed within the application. An optional `default`
 * connection can also be specified for use when a specific connection is not provided.
 */
export const mongooseConnections: MongooseConnections = {};
