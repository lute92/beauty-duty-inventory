import { Timestamp } from 'mongodb';
import mongoose, { Schema, Document } from 'mongoose';
import { ICurrency } from './Currency';

export interface IPurchase extends Document {
 purchaseDate:Timestamp,
 currency:mongoose.Types.ObjectId,
 exchangeRate:number,
 extraCost:number,
 note:string,
}

const purchaseSehema: Schema = new Schema({
  purchaseDate: { type: String, required: true},
  currency: { type: Schema.Types.ObjectId, ref: 'currency', required: true },
  exchangeRate: { type: Number, required: true },
  extraCost: {type:Number, required: false},
  note:{ type: String, required: false }
},{ timestamps: true });

export default mongoose.model<IPurchase>('purchase', purchaseSehema);



