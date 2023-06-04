import { Request, Response } from 'express';
import Brand, { IBrand } from '../models/domain/Brand';
import { IGetAllBrands } from '../models/response/IGetAllBrands';

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

export const getBrands = async (req: Request, res: Response): Promise<void> => {
  const page = req.query.page || 0;
  const limit = req.query.limit || 0;
  const name = req.query.name as string;
  const description = req.query.description as string;

  const totalBrands = await Brand.countDocuments();
  const totalPages = Math.ceil(totalBrands / Number(limit));
  const data: IGetAllBrands[] = [];

  
  const filter:any ={};

  if(name?.length > 0){
    filter.name = { $regex: name, $options: 'i' };
  }
  if(description?.length > 0){
    filter.description = { $regex: description, $options: 'i' };
  }

  try {
    let brands: IBrand[] = [];
    if (page == 0 && limit == 0) {//No Paging Params have given
      brands = await Brand.find(filter)
        .lean()
        .exec();
    } else {

      brands = await Brand.find(filter)// Requested with paging params
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean()
        .exec();
    }


    brands.map((brand: IBrand) => {
      data.push({
        brandId: brand._id,
        name: brand.name,
        description: brand.description
      })
    });

    res.status(200).json({
      data,
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
