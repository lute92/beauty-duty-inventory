
import mongoose from 'mongoose';
import { IBrand } from '../domain/Brand';
import { ICategory } from '../domain/Category';
import { ObjectId } from 'mongodb';

export interface IGetAllProducts {
    productId: string;
    productName: string;
    description: string;
    sellingPrice: Number;
    category: ObjectId;
    brand: ObjectId;
    totalQuantity: Number;
}