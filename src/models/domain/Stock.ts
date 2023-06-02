import mongoose, { Schema, Document } from 'mongoose';

export interface IStock extends Document {
 product:mongoose.Types.ObjectId,
 purchase:mongoose.Types.ObjectId,
 quantity:number,
 purchasePrice:number,
 itemCost:number,
 expDate: number,
 mnuDate:number
}

const stockSchema: Schema = new Schema({
  Purchase: { type: Schema.Types.ObjectId, ref: 'purchase', required: true },
  Product: { type: Schema.Types.ObjectId, ref: 'product', required: true },
  Quantity: { type: Number, required: true },
  PurchasePrice:{ type: Number, required: true },
  ItemCost: { type: Number, required: false },
  ExpDate: { type: Number, required: false },
  MnuDate: { type: Number, required: false }
},{ timestamps: true });

export default mongoose.model<IStock>('stock', stockSchema);



