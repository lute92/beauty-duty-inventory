import { Request, Response } from 'express';
import { ProductModel } from '../models/domain/models';

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, brand, category, sellingPrice, batches, images } = req.body;

    const existingProduct = await ProductModel.findOne({ name: name });
    if (existingProduct) {
      return res.status(400).json({ message: "Product name already exists." });
    }
    const product = new ProductModel({
      name,
      description,
      brand,
      category,
      sellingPrice,
      batches,
      images
    });

    const createdProduct = await product.save();

    return res.status(201).json({ message: "Product created.", createdProduct });

  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(400).json({ message: "Failed to create product.", error });
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

    const totalPages = await ProductModel.find(filter).countDocuments();
    const products = (page == 0 && limit == 0) ? //No Paging Params have given
      await ProductModel.find(filter)
        .lean()
        .exec()
      : await ProductModel.find(filter)
        .populate('category')
        .populate('brand')
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean()
        .exec();

    return res.status(200).json({
      products,
      page,
      totalPages: Math.ceil(totalPages / limit)
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
}

// Get a specific product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (product) {
      return res.status(200).json(product);
    }
    else {
      return res.status(404).json({ error: 'Product not found' });
    }

  } catch (error) {
    console.error("Error getting product by Id:", error);
    return res.status(500).json({ error: 'Failed to fetch product' });
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


    return res.status(204).json(updatedProduct);

  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ error: 'Failed to update product' });
  }
};


// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findByIdAndRemove(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ error: 'Failed to delete product' });
  }
};

/**
 * Create a batch of a product by productId
 * @param req 
 * @param res 
 * @returns 
 */
export const createProductBatch = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id || req.params.id;

    if (!productId) {
      return res.status(400).json({ message: "Invalid Product Id." })
    }

    const existingProduct = await ProductModel.findById(productId);
    if (!existingProduct) {
      return res.status(400).json({ message: "Product not found." });
    }

    const { mnuDate, expDate, quantity, note } = req.body;

    const isMnuDateAndExpDateAlreadyExist = existingProduct.batches.find((batch) => {
      return batch.mnuDate === mnuDate && batch.expDate === expDate;
    });

    if (isMnuDateAndExpDateAlreadyExist) {
      throw Error("Batch with same manufacture date and expire date already exists.");
    }

    existingProduct.batches.push({
      createdDate: Date.now(),
      mnuDate: mnuDate,
      expDate: expDate,
      quantity: quantity,
      note: note
    });

    await existingProduct.save();

    return res.status(201).json({ message: "Batch created." });

  } catch (error: any) {
    console.error("Error creating product:", error.message);

    return res.status(400).json(`Error: ${error.message}`);
  }
};

export const updateProductBatch = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId || req.params.productId;
    const batchId = req.params.batchId || req.params.batchId;

    if (!productId) {
      return res.status(400).json({ message: "ProductId is required." })
    }

    if (!batchId) {
      return res.status(400).json({ message: "BatchId is required." })
    }

    const existingProduct = await ProductModel.findOne(
      { _id: productId },
      {
        batches: {
          $elemMatch: { _id: batchId },
        },
      }
    );

    if (!existingProduct) {
      return res.status(400).json({ message: "Product not found." });
    }

    const { createdDate, mnuDate, expDate, quantity, mnuCountry, note } = req.body;

    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: productId, 'batches._id': batchId },
      {
        $set: {
          'batches.$.createdDate': createdDate,
          'batches.$.mnuDate': mnuDate,
          'batches.$.expDate': expDate,
          'batches.$.quantity': quantity,
          'batches.$.mnuCountry': mnuCountry,
          'batches.$.note': note,
        },
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    return res.status(204).json(updatedProduct);

  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ error: 'Failed to update product' });
  }
};
