import { Request, Response } from 'express';
import Product, { IProduct } from '../models/domain/Product';
import { IProductResponse } from '../models/response/IProductReponse';
import Stock from '../models/domain/Stock';
import ProductImage, { IProductImage } from '../models/domain/ProductImage';

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, brand, category, sellingPrice, productImages } = req.body;

    const existingProduct = await Product.findOne({ name: name });
    if (existingProduct) {
      return res.status(400).json({ message: "Product name already exists." });
    }
    else if (!Array.isArray(productImages)) {
      return res.status(400).json({ message: "Invalid request body." })
    }

    const product = new Product({
      name,
      description,
      brand,
      category,
      sellingPrice
    });


    /**Save Product */
    const createdProduct = await product.save();

    const imagesToSave = productImages.map((image: IProductImage) => {
      return { ...image, product: createdProduct._id };
    });

    /**Save Product Images */
    await ProductImage.insertMany(imagesToSave)
    product.images = imagesToSave;

    res.status(201).json({ message: "Product created.", product });

  } catch (error) {
    res.status(400).json({ message: "Failed to create product.", error });
  }
};



// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 0; // Current page number
    const limit = Number(req.query.limit) || 0; // Number of products per page

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    let products = [];

    if (page === 0 && limit === 0) {
      // No Paging Params have given
      products = await Product.find().lean().exec();
    } else {
      products = await Product.find()
        .populate('category')
        .populate('brand')
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec();
    }

    const productIds = products.map((product) => product._id);

    const stockAggregation = await Stock.aggregate([
      { $match: { product: { $in: productIds } } },
      { $group: { _id: '$product', totalQuantity: { $sum: '$quantity' } } },
    ]);

    const stockMap = new Map();
    stockAggregation.forEach((item) => {
      stockMap.set(item._id.toString(), item.totalQuantity);
    });

    const data = await Promise.all(
      products.map(async (product) => {
        const images = await ProductImage.find({ product: product._id }).exec();
        const productRes = {
          productId: product._id,
          description: product.description,
          productName: product.name,
          sellingPrice: product.sellingPrice,
          category: product.category,
          brand: product.brand,
          totalQuantity: stockMap.get(product._id.toString()) || 0,
          images,
        };
        return productRes;
      })
    );

    res.status(200).json({
      data,
      page,
      totalPages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};


//Search products
export const searchProducts = async (req: Request, res: Response) => {
  const page = req.query.page || 0; // Current page number
  const limit = req.query.limit || 0; // Number of products per page

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
    const data: IProductResponse[] = [];
    let products: IProduct[] = [];

    if (page == 0 && limit == 0) {//No Paging Params have given
      products = await Product.find(filter)
        .lean()
        .exec();
    }
    else {
      products = await Product.find(filter)
        .populate('category')
        .populate('brand')
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean()
        .exec();
    }

    const productIds: string[] = products.map((product: IProduct) => product._id);

    const stockAggregation: any[] = await Stock.aggregate([
      { $match: { product: { $in: productIds } } },
      { $group: { _id: '$product', totalQuantity: { $sum: '$quantity' } } },
    ]);

    const stockMap: Map<string, number> = new Map();
    stockAggregation.forEach((item: any) => {
      stockMap.set(item._id.toString(), item.totalQuantity);
    });

    const processArray = async (): Promise<any[]> => {

      const promises = products.map(async (product: IProduct) => {
        let productRes: IProductResponse = {
          productId: product._id,
          description: product.description,
          productName: product.name,
          sellingPrice: product.sellingPrice,
          category: product.category,
          brand: product.brand,
          totalQuantity: stockMap.get(product._id.toString()) || 0,
          images: await ProductImage.find({ product: product._id }).exec()
        }

        return productRes;
      });

      const results = await Promise.all(promises);
      return results;
    }

    processArray().then((data) => {
      res.status(200).json({
        data,
        page,
        totalPages
      });
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

// Get a specific product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const productRes: IProductResponse = {
        productId: product._id,
        description: product.description,
        productName: product.name,
        sellingPrice: product.sellingPrice,
        category: product.category,
        brand: product.brand,
        totalQuantity: 0,
        images: await ProductImage.find({ product: product._id }).exec()
      }
      res.json(productRes);
    }
    else {
      return res.status(404).json({ error: 'Product not found' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const existingProduct = await Product.exists({ name: req.body.name, _id: { $ne: req.params.id } });

    if (existingProduct) {
      return res.status(400).json({ message: "Product name already exists." });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (req.body.productImages) {
      await ProductImage.deleteMany({ product: req.params.id });

      const imagesToUpdate = req.body.productImages.map((item: IProductImage) => ({ ...item, product: req.params.id }));

      const savedImages = await ProductImage.insertMany(imagesToUpdate);

      updatedProduct.images = savedImages;
    }

    res.json(updatedProduct);

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
