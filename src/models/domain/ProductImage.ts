import mongoose, { Schema, Document } from 'mongoose';

export interface IProductImage extends Document {
  product: mongoose.Types.ObjectId,
  fileName: string,
  url: string
}

const productImageSchema: Schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'product', required: true },
  fileName: { type: String, required: false },
  url: { type: String, required: false }
}, { timestamps: true });

export default mongoose.model<IProductImage>('image', productImageSchema);
