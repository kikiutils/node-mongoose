import { Types } from 'mongoose';

export function toObjectIdHexString(id: string | Types.ObjectId) {
    return id instanceof Types.ObjectId ? id.toHexString() : id;
}
