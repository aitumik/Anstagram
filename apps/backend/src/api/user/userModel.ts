import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

type UserType = mongoose.Document & {
    id: string,
    firstName: string,
    lastName: string,
    gender: string,
    email: string,
    username: string,
    password: string,
    avatar: string,
    dateOfBirth: string,
    isVerified: boolean
};

const userSchema = new Schema({
    id: { type: ObjectId, index: true },
    firstName: { type: String, trim: true, required: 'required firstName' },
    lastName: { type: String, trim: true, required: 'required lastName' },
    email: {
        type: String, unique: true, required: 'required email', index: true, lowercase: true
    },
    username: {
        type: String, unique: true, required: 'required username', index: true, lowercase: true
    },
    dateOfBirth: { type: Date, required: 'required dateOfBirth' },
    gender: { type: String, required: 'required gender' },
    password: { type: String, required: 'required password' },
    avatar: { type: String },
    resetOtp: { type: Number },
    verifyOtp: { type: Number },
    isVerified: { type: Boolean, default: false }
}, {
        timestamps: true
    });

const User = mongoose.model('User', userSchema);

export { UserType, User };
