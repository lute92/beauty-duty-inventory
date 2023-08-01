import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchaseDetail extends Document {
    purchase:mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId,
    quantity: number,
    purchasePrice: number,
    itemCost: number,
    expDate: String,
    mnuDate: String
}

const purchaseDetailSchema: Schema = new Schema({
    purchase: { type: Schema.Types.ObjectId, ref: 'purchase', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'product', required: true },
    quantity: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    itemCost: { type: Number, required: false },
    expDate: { type: String, required: false },
    mnuDate: { type: String, required: false }
}, { timestamps: true });

export default mongoose.model<IPurchaseDetail>('purchaseDetail', purchaseDetailSchema);



