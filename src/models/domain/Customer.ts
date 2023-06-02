import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string,
  address: string,
  phoneNumber: string
}

const customerSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: false },
  phoneNumber: { type: String, required: false }
}, { timestamps: true });

export default mongoose.model<ICustomer>('customer', customerSchema);
