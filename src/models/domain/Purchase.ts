import { Timestamp } from 'mongodb';
import mongoose, { Schema, Document } from 'mongoose';
import { ICurrency } from './Currency';

export interface IPurchase extends Document {
 purchaseDate:Timestamp,
 currency:mongoose.Types.ObjectId,
 exchangeRate:number,
 note:string,
}

const purchaseSehema: Schema = new Schema({
  PurchaseDate: { type: String, required: true},
  Currency: { type: Schema.Types.ObjectId, ref: 'currency', required: true },
  ExchangeRate: { type: Number, required: true },
  Note:{ type: String, required: false }
},{ timestamps: true });

export default mongoose.model<IPurchase>('purchase', purchaseSehema);



