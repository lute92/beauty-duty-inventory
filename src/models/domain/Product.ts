import mongoose, { Schema, Document } from 'mongoose';
import { IProductImage } from './ProductImage';

export interface IProduct extends Document {
  _id:string,
  name: string,
  description: string,
  brand: mongoose.Types.ObjectId,
  category: mongoose.Types.ObjectId,
  sellingPrice: Number
}

const productSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  brand: { type: Schema.Types.ObjectId, ref: 'brand', required: false },
  category: { type: Schema.Types.ObjectId, ref: 'category', required: true },
  sellingPrice: { type: Number, required: false }
}, { timestamps: true });

export default mongoose.model<IProduct>('product', productSchema);



