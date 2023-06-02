import mongoose, { Schema, Document } from 'mongoose';

export interface IProductImage extends Document {
  description: string,
  url: string
}

const productImageSchema: Schema = new Schema({

  description: { type: String, required: false },
  url: { type: String, required: false }
}, { timestamps: true });

export default mongoose.model<IProductImage>('image', productImageSchema);
