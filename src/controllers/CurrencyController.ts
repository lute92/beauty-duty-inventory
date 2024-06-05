import { Request, Response } from 'express';
import { CurrencyModel } from '../models/domain/models';

export const createCurrency = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description }: { name: string; description: string } = req.body;
    const newCurrency = new CurrencyModel({ name, description });
    const savedCurrency = await newCurrency.save();
    res.status(201).json(savedCurrency);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create currency' });
  }
};

export const getCurrencies = async (req: Request, res: Response): Promise<void> => {
  const page = req.query.page || 0; // Current page number
  const limit = req.query.limit || 0; // Number of products per page
  const name = req.query.name as string;
  const description = req.query.description as string;

  const totalRecords = await CurrencyModel.countDocuments();
  const totalPages = Math.ceil(totalRecords / Number(limit));

  const filter: any = {};

  if (name?.length > 0) {
    filter.name = { $regex: name, $options: 'i' };
  }
  if (description?.length > 0) {
    filter.description = { $regex: description, $options: 'i' };
  }

  try {
    const currencies = page == 0 && limit == 0 ?//No Paging Params have given
      await CurrencyModel.find(filter)
        .lean()
        .exec() :
      await CurrencyModel.find(filter)// Requested with paging params
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean()
        .exec();


    res.status(200).json({
      currencies,
      page,
      totalPages
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve currencies' });
  }
};

export const getCurrencyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const currency = await CurrencyModel.findById(id);
    if (currency) {
      res.status(200).json(currency);
    } else {
      res.status(404).json({ error: 'Currency not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve currency' });
  }
};

export const updateCurrency = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description }: { name?: string; description?: string } = req.body;
    const updatedCurrency = await CurrencyModel.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (updatedCurrency) {
      res.status(200).json(updatedCurrency);
    } else {
      res.status(404).json({ error: 'Currency not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update currency' });
  }
};

export const deleteCurrency = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedCurrency = await CurrencyModel.findByIdAndDelete(id);
    if (deletedCurrency) {
      res.status(200).json({ message: 'Currency deleted successfully' });
    } else {
      res.status(404).json({ error: 'Currency not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete currency' });
  }
};
