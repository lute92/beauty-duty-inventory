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

export interface IProductImage extends Document {
  _id: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  url: string;
  fileName: string;
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  brand: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  sellingPrice: number;
  images: IProductImage[];
  weight: string;
  qty: number;
  mnuCountry: string;
}

export interface IProductBatch extends Document {
  _id: mongoose.Types.ObjectId;
  batchId: string;
  productId: mongoose.Types.ObjectId;
  mnuDate: number;
  expDate: number;
  note: string;
}

export interface ICountry extends Document {
  _id: mongoose.Types.ObjectId;
  countryName: string;
  isoCode: string;
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

export interface IPurchase extends Document {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  purchaseDate: number;
  currency: mongoose.Types.ObjectId;
  exchangeRate: number;
  extraCost: number;
  note: string;
  purchaseDetails: IPurchaseDetail[];
}

export interface IPurchaseDetail extends Document {
  _id: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
  purchasePrice: number;
  itemCost: number;
  expDate: String;
  mnuDate: String;
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

const ProductImageSchema = new Schema<IProductImage>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  url: { type: String, required: true },
  fileName: { type: String, required: true },
});

const ProductBatchSchema = new Schema<IProductBatch>({
  batchId: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  mnuDate: { type: Number, required: true },
  expDate: { type: Number, required: true },
  note: { type: String, required: true },
});

const CountrySchema = new Schema<ICountry>({
  countryName: { type: String, required: true },
  isoCode: { type: String, required: true },
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

const PurchaseDetailSchema = new Schema<IPurchaseDetail>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  itemCost: { type: Number, required: true },
  expDate: { type: String, required: true },
  mnuDate: { type: String, required: true },
});

const PurchaseSchema = new Schema<IPurchase>({
  orderNumber: { type: String, required: true },
  purchaseDate: { type: Number, required: true },
  currency: { type: Schema.Types.ObjectId, ref: 'Currency', required: true },
  exchangeRate: { type: Number, required: true },
  extraCost: { type: Number, required: true },
  note: { type: String, required: true },
  purchaseDetails: { type: [PurchaseDetailSchema], required: true },
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

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  sellingPrice: { type: Number, required: true },
  images: { type: [ProductImageSchema], required: true },
  weight: { type: String, required: true },
  qty: { type: Number, required: true },
  mnuCountry: { type: String, required: true },
});

// Define Mongoose Models
const BrandModel = mongoose.model<IBrand>('Brand', BrandSchema);
const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema);
const ProductImageModel = mongoose.model<IProductImage>('ProductImage', ProductImageSchema);
const ProductBatchModel = mongoose.model<IProductImage>('ProductBatch', ProductBatchSchema);
const CountryModel = mongoose.model<ICountry>('Country', CountrySchema);
const CurrencyModel = mongoose.model<ICurrency>('Currency', CurrencySchema);
const CustomerModel = mongoose.model<ICustomer>('Customer', CustomerSchema);
const PurchaseDetailModel = mongoose.model<IPurchaseDetail>('PurchaseDetail', PurchaseDetailSchema);
const PurchaseModel = mongoose.model<IPurchase>('Purchase', PurchaseSchema);
const SalesDetailsModel = mongoose.model<ISalesDetails>('SalesDetails', SalesDetailsSchema);
const SalesModel = mongoose.model<ISales>('Sales', SalesSchema);
const UserModel = mongoose.model<IUser>('User', UserSchema);
const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);

export {
  BrandModel,
  CategoryModel,
  ProductImageModel,
  ProductBatchModel,
  CountryModel,
  CurrencyModel,
  CustomerModel,
  PurchaseDetailModel,
  PurchaseModel,
  SalesDetailsModel,
  SalesModel,
  UserModel,
  ProductModel,
};
