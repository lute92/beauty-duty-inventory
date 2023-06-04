import { Request, Response } from 'express';
import Category, { ICategory } from '../models/domain/Category';
import { IGetAllCategories } from '../models/response/IGetAllCategories';

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description }: { name: string; description: string } = req.body;
    const newCategory: ICategory = new Category({ name, description });
    const savedCategory: ICategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  const page = req.query.page || 0; // Current page number
  const limit = req.query.limit || 0; // Number of products per page
  const name = req.query.name as string;
  const description = req.query.description as string;

  const totalRecords = await Category.countDocuments();
  const totalPages = Math.ceil(totalRecords / Number(limit));
  const data: IGetAllCategories[] = [];

  const filter:any ={};

  if(name?.length > 0){
    filter.name = { $regex: name, $options: 'i' };
  }
  if(description?.length > 0){
    filter.description = { $regex: description, $options: 'i' };
  }

  try {
    let categories: ICategory[] = [];
    if (page == 0 && limit == 0) {//No Paging Params have given
      categories = await Category.find(filter)
        .lean()
        .exec();
    } else {

      categories = await Category.find(filter)// Requested with paging params
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean()
        .exec();
    }


    categories.map((category: ICategory) => {
      data.push({
        categoryId: category._id,
        name: category.name,
        description: category.description
      })
    });

    res.status(200).json({
      data,
      page,
      totalPages
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category: ICategory | null = await Category.findById(id);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve category' });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description }: { name?: string; description?: string } = req.body;
    const updatedCategory: ICategory | null = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (updatedCategory) {
      res.status(200).json(updatedCategory);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedCategory: ICategory | null = await Category.findByIdAndDelete(id);
    if (deletedCategory) {
      res.status(200).json({ message: 'Category deleted successfully' });
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
