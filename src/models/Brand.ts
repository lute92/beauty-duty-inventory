import mongoose, { Schema, Document } from 'mongoose';

export interface IBrand extends Document {
  name: string,
  description: string
}

const brandSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false }
}, { timestamps: true });

export default mongoose.model<IBrand>('brand', brandSchema);
