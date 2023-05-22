import { Request, Response } from 'express';
import Currency, { ICurrency } from '../models/Currency';

export const createCurrency = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description }: { name: string; description: string } = req.body;
    const newCurrency: ICurrency = new Currency({ name, description });
    const savedCurrency: ICurrency = await newCurrency.save();
    res.status(201).json(savedCurrency);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create currency' });
  }
};

export const getCurrencies = async (_req: Request, res: Response): Promise<void> => {
  try {
    const currencies: ICurrency[] = await Currency.find();
    res.status(200).json(currencies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve currencies' });
  }
};

export const getCurrencyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const currency: ICurrency | null = await Currency.findById(id);
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
    const updatedCurrency: ICurrency | null = await Currency.findByIdAndUpdate(
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
    const deletedCurrency: ICurrency | null = await Currency.findByIdAndDelete(id);
    if (deletedCurrency) {
      res.status(200).json({ message: 'Currency deleted successfully' });
    } else {
      res.status(404).json({ error: 'Currency not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete currency' });
  }
};
