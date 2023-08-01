import { Timestamp } from 'mongodb';
import mongoose, { Schema, Document } from 'mongoose';
import { ICurrency } from './Currency';

export interface IPurchase extends Document {
  orderNumber:string,
  purchaseDate: Timestamp,
  currency: mongoose.Types.ObjectId,
  exchangeRate: number,
  extraCost: number,
  note: string,
}

const purchaseSehema: Schema = new Schema({
  orderNumber: { type: String, required: true },
  purchaseDate: { type: String, required: true },
  currency: { type: Schema.Types.ObjectId, ref: 'currency', required: false },
  exchangeRate: { type: Number, required: true },
  extraCost: { type: Number, required: false },
  note: { type: String, required: false }
}, { timestamps: true });

export default mongoose.model<IPurchase>('purchase', purchaseSehema);



