import { Request, Response } from 'express';
import Category, { ICategory } from '../models/domain/Category';

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

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories: ICategory[] = await Category.find();
    res.status(200).json(categories);
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
