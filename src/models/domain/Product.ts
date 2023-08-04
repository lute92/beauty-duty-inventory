import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  _id:string,
  name: string,
  description: string,
  brand: mongoose.Types.ObjectId,
  category: mongoose.Types.ObjectId,
  sellingPrice: Number,
  images: any[],
  weight:string,
  qty:number,
  mnuCountry:string
}

const productSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  brand: { type: Schema.Types.ObjectId, ref: 'brand', required: false },
  category: { type: Schema.Types.ObjectId, ref: 'category', required: true },
  sellingPrice: { type: Number, required: false },
  images: {type: Array<any>, required: false },
  weight: { type: String, required: false },
  qty:{ type: Number, required: false },
  mnuCountry:{ type: String, required: false }
}, { timestamps: true });

export default mongoose.model<IProduct>('product', productSchema);



