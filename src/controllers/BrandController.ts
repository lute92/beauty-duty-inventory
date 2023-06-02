import { Request, Response } from 'express';
import Brand, { IBrand } from '../models/domain/Brand';

export const createBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description }: { name: string; description: string } = req.body;
    const newBrand: IBrand = new Brand({ name, description });
    const savedBrand: IBrand = await newBrand.save();
    res.status(201).json(savedBrand);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create brand' });
  }
};

export const getBrands = async (_req: Request, res: Response): Promise<void> => {
  try {
    const brands: IBrand[] = await Brand.find();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve brands' });
  }
};

export const getBrandById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const brand: IBrand | null = await Brand.findById(id);
    if (brand) {
      res.status(200).json(brand);
    } else {
      res.status(404).json({ error: 'Brand not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve brand' });
  }
};

export const updateBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description }: { name?: string; description?: string } = req.body;
    const updatedBrand: IBrand | null = await Brand.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (updatedBrand) {
      res.status(200).json(updatedBrand);
    } else {
      res.status(404).json({ error: 'Brand not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update brand' });
  }
};

export const deleteBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedBrand: IBrand | null = await Brand.findByIdAndDelete(id);
    if (deletedBrand) {
      res.status(200).json({ message: 'Brand deleted successfully' });
    } else {
      res.status(404).json({ error: 'Brand not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete brand' });
  }
};
