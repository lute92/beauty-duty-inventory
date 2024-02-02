import mongoose, { Document, Schema } from 'mongoose';

export interface IBrand extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
}

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  brand: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  sellingPrice: number;
  varient: IColorVarient | ISizeVarient;
  images: IProductImage[];
}

export interface IColorVarient {
  type: 'color',
  colorCode: string;
  batches: IProductBatch[];
}

export interface ISizeVarient {
  type: 'size',
  size: string;
  batches: IProductBatch[];
}

export interface IProductImage {
  _id: string;
  url: string;
  fileName: string;
}

export interface IProductBatch {
  _id: string;
  mnuDate: number;
  expDate: number;
  quantity: number;
  mnuCountry: string;
  note: string;
}

export interface ICurrency extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
}

export interface ICustomer extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  address: string;
  phoneNumber: string;
}
export interface ISales extends Document {
  _id: mongoose.Types.ObjectId;
  salesDate: number;
  currency: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  note: string;
  salesDetails: ISalesDetails[];
}

export interface ISalesDetails extends Document {
  _id: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  productBatch: mongoose.Types.ObjectId;
  quantity: number;
  salesPrice: number;
  discount: number;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  isActive: boolean;
  createdDate: number;
}

// Define Mongoose Schemas
const BrandSchema = new Schema<IBrand>({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const CurrencySchema = new Schema<ICurrency>({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const productSchema = new Schema({
  _id: { type: mongoose.Types.ObjectId, required: true },
  productCode: { type: String, required: false },
  name: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: mongoose.Types.ObjectId, required: true },
  category: { type: mongoose.Types.ObjectId, required: true },
  sellingPrice: { type: Number, required: true },
  varient: {
    type: {
      type: String,
      enum: ['color', 'size'],
      required: true,
    },
    colorCode: { type: String },
    size: { type: String },
    batches: [
      {
        _id: { type: String, required: true },
        createdDate: { type: Number, required: true },
        mnuDate: { type: Number, required: false },
        expDate: { type: Number, required: false },
        quantity: { type: Number, required: true },
        mnuCountry: { type: String, required: false },
        note: { type: String, required: false },
      },
    ],
  },
  images: [
    {
      _id: { type: String, required: true },
      url: { type: String, required: true },
      fileName: { type: String, required: true },
    },
  ],
});

const SalesDetailsSchema = new Schema<ISalesDetails>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  productBatch: { type: Schema.Types.ObjectId, ref: 'ProductBatch', required: true },
  quantity: { type: Number, required: true },
  salesPrice: { type: Number, required: true },
  discount: { type: Number, required: true },
});

const SalesSchema = new Schema<ISales>({
  salesDate: { type: Number, required: true },
  currency: { type: Schema.Types.ObjectId, ref: 'Currency', required: true },
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  note: { type: String, required: true },
  salesDetails: { type: [SalesDetailsSchema], required: true },
});

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  createdDate: { type: Number, required: true },
});



// Define Mongoose Models
const BrandModel = mongoose.model<IBrand>('Brand', BrandSchema);
const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema);
const CurrencyModel = mongoose.model<ICurrency>('Currency', CurrencySchema);
const CustomerModel = mongoose.model<ICustomer>('Customer', CustomerSchema);
const SalesDetailsModel = mongoose.model<ISalesDetails>('SalesDetails', SalesDetailsSchema);
const SalesModel = mongoose.model<ISales>('Sales', SalesSchema);
const UserModel = mongoose.model<IUser>('User', UserSchema);
const ProductModel = mongoose.model('Product', productSchema);

export {
  BrandModel,
  CategoryModel,
  CurrencyModel,
  CustomerModel,
  SalesDetailsModel,
  SalesModel,
  UserModel,
  ProductModel
};
