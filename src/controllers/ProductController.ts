import { Request, Response } from 'express';
import Product, { IProduct } from '../models/domain/Product';
import { IGetAllProducts } from '../models/response/IGetAllProducts';
import Stock, { IStock } from '../models/domain/Stock';
import Brand, { IBrand } from '../models/domain/Brand';
import Category, { ICategory } from '../models/domain/Category';

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, brand, category, sellingPrice } = req.body;
    const product = new Product({
      name,
      description,
      brand,
      category,
      sellingPrice
    });
    await product.save().catch((err) => {
      console.log(err);
    });
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get all products
export const getProducts = async (req: Request, res: Response) => {

  const page = req.query.page || 1; // Current page number
  const limit = req.query.limit || 10; // Number of products per page

  try {

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / Number(limit));
    const data: IGetAllProducts[] = [];

    const products: IProduct[] = await Product.find()
      .populate('category', 'name')
      .populate('brand', 'name')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit)).lean().exec();

    const productIds: string[] = products.map((product: IProduct) => product._id);

    const stockAggregation: any[] = await Stock.aggregate([
      { $match: { product: { $in: productIds } } },
      { $group: { _id: '$product', totalQuantity: { $sum: '$quantity' } } },
    ]);

    const stockMap: Map<string, number> = new Map();
    stockAggregation.forEach((item: any) => {
      stockMap.set(item._id.toString(), item.totalQuantity);
    });

   products.map((product: IProduct) => {
    data.push(
      {
        productId: product._id,
        description: product.description,
        productName: product.name,
        sellingPrice: product.sellingPrice,
        category: product.category,
        brand: product.brand,
        totalQuantity: stockMap.get(product._id.toString()) || 0,
      }
    )
   });

    res.status(200).json({
      data,
      page,
      totalPages
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

//Search products
export const searchProducts = async (req: Request, res: Response) => {
  const page = req.query.page || 1; // Current page number
  const limit = req.query.limit || 10; // Number of products per page

  const { name, brandId, categoryId } = req.query;
  const filter: any = {};
  if (name) {
    filter.name = { $regex: name, $options: 'i' };
  }
  if (brandId) {
    filter.brand = brandId;
  }
  if (categoryId) {
    filter.category = categoryId;
  }

  try {

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / Number(limit));

    const products = await Product.find(filter)
      .populate('category', 'name')
      .populate('brand', 'name')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      products,
      page,
      totalPages
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get a specific product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
