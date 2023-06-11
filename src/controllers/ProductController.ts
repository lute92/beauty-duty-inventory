import { Request, Response } from 'express';
import Product, { IProduct } from '../models/domain/Product';
import { IGetAllProducts } from '../models/response/IGetAllProducts';
import Stock from '../models/domain/Stock';
import ProductImage, { IProductImage } from '../models/domain/ProductImage';
import { from, map } from 'rxjs';

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { productName, description, brand, category, sellingPrice, imageUrls } = req.body;
    
    const existingProduct = await Product.findOne({ name: productName });
    if (existingProduct) {
      return res.status(400).json({ message: "Product name already exists." });
    }

    const product = new Product({
      name: productName,
      description,
      brand,
      category,
      sellingPrice
    });

    /**Save Product */
    await product.save().then((createdProduct) => {
      let productImages: IProductImage[] = [];
      imageUrls.map((_url: string) => {
        const productImage = new ProductImage({
          product: createdProduct._id,
          description: "",
          url: _url
        })
        productImages.push(productImage);
      })

      /**Save Product Images */
      ProductImage.create(productImages).then((savedImages) => {
        console.log('Saved Images successfully:', savedImages);
      }).catch(error => {
        console.error('Error product images:', error);
      })

    }).catch((err) => {
      console.log(err);
    });

    res.status(201).json({ message: "Product created." });
  } catch (error) {
    res.status(500).json(error);
  }
};



// Get all products
export const getProducts = async (req: Request, res: Response) => {

  const page = req.query.page || 0; // Current page number
  const limit = req.query.limit || 0; // Number of products per page

  try {

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / Number(limit));
    const data: IGetAllProducts[] = [];
    let products: IProduct[] = [];

    if (page == 0 && limit == 0) {//No Paging Params have given
      products = await Product.find()
      .lean()
      .exec();
    }
    else{
      products = await Product.find()
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
        let productRes: IGetAllProducts = {
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
    const data: IGetAllProducts[] = [];
    let products: IProduct[] = [];

    if (page == 0 && limit == 0) {//No Paging Params have given
      products = await Product.find(filter)
      .lean()
      .exec();
    }
    else{
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
        let productRes: IGetAllProducts = {
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
