import { Request, Response } from 'express';
import { IProduct, IProductImage, ProductImageModel, ProductModel } from '../models/domain/models';

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, brand, category, sellingPrice, productImages, qty, weight, mnuCountry } = req.body;

    const existingProduct = await ProductModel.findOne({ name: name, weigth: weight });
    if (existingProduct) {
      return res.status(400).json({ message: "Product name already exists." });
    }
    else if (!Array.isArray(productImages)) {
      return res.status(400).json({ message: "Invalid request body." })
    }

    const product = new ProductModel({
      name,
      description,
      brand,
      category,
      sellingPrice,
      qty,
      weight,
      mnuCountry
    });


    /**Save Product */
    product.images = productImages.map((images: IProductImage) => {
      return images;
    })

    const createdProduct = await product.save();
    
    res.status(201).json({ message: "Product created.", createdProduct });

  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ message: "Failed to create product.", error });
  }
};



// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    console.log("Fetching Products");

    const page = Number(req.query.page) || 0; // Current page number
    const limit = Number(req.query.limit) || 0; // Number of products per page

    const totalProducts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    let products = [];

    if (page === 0 && limit === 0) {
      // No Paging Params have given
      products = await ProductModel.find().lean().exec();
    } else {
      products = await ProductModel.find()
        .populate('category')
        .populate('brand')
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec();
    }

    res.status(200).json({
      products,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};


//Search products
export const searchProducts = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 0; // Current page number
  const limit = Number(req.query.limit) || 0; // Number of products per page

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

    let products: IProduct[] = [];
    const totalPages = await ProductModel.find(filter).countDocuments();
    if (page == 0 && limit == 0) {//No Paging Params have given
      products = await ProductModel.find(filter)
        .lean()
        .exec();
    }
    else {
      products = await ProductModel.find(filter)
        .populate('category')
        .populate('brand')
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean()
        .exec();
    }

    res.status(200).json({
      products,
      page,
      totalPages: Math.ceil(totalPages / limit)
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

// Get a specific product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (product) {
      res.status(200).json(product);
    }
    else {
      return res.status(404).json({ error: 'Product not found' });
    }

  } catch (error) {
    console.error("Error getting product by Id:", error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const existingProduct = await ProductModel.exists({ name: req.body.name, _id: { $ne: req.params.id } });

    if (existingProduct) {
      return res.status(400).json({ message: "Product name already exists." });
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    
    res.status(204).json(updatedProduct);

  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};


// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findByIdAndRemove(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
