import mongoose, { Schema, Document } from 'mongoose';

export interface IProductImage extends Document {
  fileName: string,
  url: string
}

const productImageSchema: Schema = new Schema({
  fileName: { type: String, required: false },
  url: { type: String, required: false }
}, { timestamps: true });

export default mongoose.model<IProductImage>('image', productImageSchema);
