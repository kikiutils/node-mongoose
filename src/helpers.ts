import { Types } from 'mongoose';

import type {
    BaseMongoosePaginateModel,
    MongooseDocumentOrObjectId,
    MongooseHydratedDocument,
} from './types';

export async function mongooseDocumentOrObjectIdToDocument<
    D extends MongooseHydratedDocument<DocType, InstanceMethodsAndOverrides, QueryHelpers>,
    DocType,
    InstanceMethodsAndOverrides,
    QueryHelpers,
>(
    documentOrObjectId: MongooseDocumentOrObjectId<D>,
    model: BaseMongoosePaginateModel<DocType, InstanceMethodsAndOverrides, QueryHelpers>,
    selectFields?: string[],
) {
    if (typeof documentOrObjectId === 'string' || documentOrObjectId instanceof Types.ObjectId) {
        return (await model.findById(documentOrObjectId).select(selectFields || [])) as D | null;
    }

    return documentOrObjectId;
}

export function toObjectIdHexString(id: string | Types.ObjectId) {
    return id instanceof Types.ObjectId ? id.toHexString() : id;
}
