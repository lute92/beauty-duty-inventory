import mongoose, { Schema, Document } from 'mongoose';

export interface ICurrency extends Document {
    name: string,
    description: string
}

const currencySchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false }
}, { timestamps: true });

export default mongoose.model<ICurrency>('currency', currencySchema);
