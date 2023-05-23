import { Request, Response } from 'express';
import Product from '../models/Product';

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, brand, price, quantity, currency, category } = req.body;
    const product = new Product({
      name,
      description,
      brand,
      price,
      quantity,
      currency,
      category
    });
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Get all products
export const getProducts = async (req: Request, res: Response) => {

  const page = req.query.page || 1; // Current page number
  const limit = req.query.limit || 10; // Number of products per page

  try {

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / Number(limit));

    const products = await Product.find({})
      .populate('category', 'name')
      .populate('brand', 'name')
      .populate('currency', 'name')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));


    res.json({
      products,
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
      .populate('currency', 'name')
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
