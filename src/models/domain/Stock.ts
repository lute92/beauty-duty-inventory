import mongoose, { Schema, Document } from 'mongoose';

export interface IStock extends Document {
  product: mongoose.Types.ObjectId,
  purchase: mongoose.Types.ObjectId,
  quantity: number,
  purchasePrice: number,
  itemCost: number,
  expDate: String,
  mnuDate: String
}

const stockSchema: Schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'purchase', required: true },
  purchase: { type: Schema.Types.ObjectId, ref: 'product', required: true },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  itemCost: { type: Number, required: false },
  expDate: { type: String, required: false },
  mnuDate: { type: String, required: false }
}, { timestamps: true });

export default mongoose.model<IStock>('stock', stockSchema);



