import type {
    Document,
    mongo,
} from 'mongoose';

export async function assertMongooseUpdateSuccess<T extends Document>(
    updatePromise: Promise<mongo.UpdateResult<T>>,
    expectedModifiedCount = 1,
) {
    const updateResult = await updatePromise;
    if (!updateResult.acknowledged) throw new Error('Update was not acknowledged');
    if (updateResult.modifiedCount < expectedModifiedCount) {
        // eslint-disable-next-line style/max-len
        throw new Error(`Expected to modify at least ${expectedModifiedCount} document(s), but modified ${updateResult.modifiedCount}`);
    }
}
