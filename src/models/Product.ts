import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string,
  description:string,
  brand: string,
  price: number,
  quantity: number,
  currency: string,
  category: string
}

const productSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  brand: { type: Schema.Types.ObjectId, ref: 'brands', required: false },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  currency: { type: Schema.Types.ObjectId, ref: 'currency', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'categories', required: true }
},{ timestamps: true });

export default mongoose.model<IProduct>('Products', productSchema);



