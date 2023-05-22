import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string,
  description:string,
  brandId: string,
  price: number,
  quantity: number,
  currencyId: string,
  categoryId: string
}

const productSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  brandId: { type: String, required: false },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  currencyId: { type: String, required: true },
  categoryId: { type: String, required: true}
},{ timestamps: true });

export default mongoose.model<IProduct>('Products', productSchema);



