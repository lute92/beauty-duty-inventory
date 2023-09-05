import { Timestamp } from 'mongodb';
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    _id:string,
    username: string,
    password: string,
    isActive: boolean,
    createdDate: Timestamp
}

const userSchema: Schema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    createdDate: { type: String, required: false }
}, { timestamps: true });

export default mongoose.model<IUser>('user', userSchema);
