import { Request, Response } from 'express';
import { BrandModel } from '../models/domain/models';

export const createBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description }: { name: string; description: string } = req.body;
    const newBrand = new BrandModel({ name, description });
    const savedBrand = await newBrand.save();
    res.status(201).json(savedBrand);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create brand' });
  }
};

export const getBrands = async (req: Request, res: Response): Promise<void> => {
  const page = req.query.page || 0;
  const limit = req.query.limit || 0;
  const name = req.query.name as string;
  const description = req.query.description as string;
  const filter: any = {};

  if (name?.length > 0) {
    filter.name = { $regex: name, $options: 'i' };
  }
  if (description?.length > 0) {
    filter.description = { $regex: description, $options: 'i' };
  }

  try {

    const brands = page == 0 && limit == 0 ?
      await BrandModel.find(filter).lean().exec() :
      await BrandModel.find(filter)// Requested with paging params
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean()
        .exec();


    const totalBrands = await BrandModel.countDocuments();
    const totalPages = Math.ceil(totalBrands / Number(limit));

    res.status(200).json({
      brands,
      page,
      totalPages
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve brands' });
  }
};

export const getBrandById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const brand = await BrandModel.findById(id);
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
    const updatedBrand = await BrandModel.findByIdAndUpdate(
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
    const deletedBrand = await BrandModel.findByIdAndDelete(id);
    if (deletedBrand) {
      res.status(200).json({ message: 'Brand deleted successfully' });
    } else {
      res.status(404).json({ error: 'Brand not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete brand' });
  }
};
