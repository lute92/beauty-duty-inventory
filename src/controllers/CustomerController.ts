import { Request, Response } from 'express';
import Customer, { ICustomer } from '../models/Customer';

export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, address, phoneNumber }: { name: string; address: string; phoneNumber: string } = req.body;
    const newCustomer: ICustomer = new Customer({ name, address, phoneNumber });
    const savedCustomer: ICustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

export const getCustomers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const customers: ICustomer[] = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve customers' });
  }
};

export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const customer: ICustomer | null = await Customer.findById(id);
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve customer' });
  }
};

export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, address, phoneNumber }: { name?: string; address?: string; phoneNumber?: string } = req.body;
    const updatedCustomer: ICustomer | null = await Customer.findByIdAndUpdate(
      id,
      { name, address, phoneNumber },
      { new: true }
    );
    if (updatedCustomer) {
      res.status(200).json(updatedCustomer);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
};

export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedCustomer: ICustomer | null = await Customer.findByIdAndDelete(id);
    if (deletedCustomer) {
      res.status(200).json({ message: 'Customer deleted successfully' });
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
};
