import { Timestamp } from 'mongodb';
import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchaseDetail extends Document {
    purchase:mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId,
    quantity: number,
    purchasePrice: number,
    itemCost: number,
    expDate: Timestamp,
    mnuDate: Timestamp
}

const purchaseDetailSchema: Schema = new Schema({
    purchase: { type: Schema.Types.ObjectId, ref: 'purchase', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'product', required: true },
    quantity: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    itemCost: { type: Number, required: false },
    expDate: { type: Date, required: false },
    mnuDate: { type: Date, required: false }
}, { timestamps: true });

export default mongoose.model<IPurchaseDetail>('purchaseDetail', purchaseDetailSchema);



