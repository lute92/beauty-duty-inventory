import { Timestamp } from 'mongodb';
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    _id:string,
    username: string,
    password: string,
    isActive: boolean,
    createdDate: number
}

const userSchema: Schema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    createdDate: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model<IUser>('user', userSchema);
