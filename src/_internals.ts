import type { Connection } from 'mongoose';

import type { CustomMongooseOptions } from './types/options';

export const customMongooseOptions: CustomMongooseOptions = {};
export const mongooseConnectionState: { defaultConnection?: Connection } = {};
