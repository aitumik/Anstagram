import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

type FeedType = mongoose.Document & {
    id: string,
    userId: string,
    media: [],
    description: string,
};

const feedSchema = new Schema({
    id: { type: ObjectId, index: true },
    user: {type: ObjectId, ref: 'User'},
    media: { type: Array, required: 'required media' },
    description: { type: String, default: '' },
    location: { type: String, default: '' }
}, {
        timestamps: true
    });

const Feed = mongoose.model('Feed', feedSchema);

export { FeedType, Feed };
