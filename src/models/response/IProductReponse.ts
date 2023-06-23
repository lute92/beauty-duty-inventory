import { ObjectId } from 'mongodb';
import { IProductImage } from '../domain/ProductImage';

export interface IProductResponse {
    productId: string;
    productName: string;
    description: string;
    sellingPrice: Number;
    category: ObjectId;
    brand: ObjectId;
    totalQuantity: Number,
    images?: IProductImage[]
}