import { Request, Response } from 'express';
import Purchase from '../models/domain/Purchase';
import PurchaseDetail from '../models/domain/PurchaseDetail';
import Stock from '../models/domain/Stock';

export const createPurchase = async (req: Request, res: Response) => {
    try {
        const { purchaseDate, currency, exchangeRate, note, details } = req.body;

        // Create a new purchase
        const purchase = new Purchase({
            purchaseDate,
            currency,
            exchangeRate,
            note
        });
        await purchase.save();

        // Create purchase details
        const purchaseDetails = details.map((detail: any) => ({
            purchase: purchase._id,
            product: detail.product,
            quantity: detail.quantity,
            purchasePrice: detail.purchasePrice,
            itemCost: detail.itemCost,
            expDate: detail.expDate,
            mnuDate: detail.mnuDate
        }));
        await PurchaseDetail.insertMany(purchaseDetails);

        // Save purchase and purchase details to stock
        const stockItems = purchaseDetails.map((detail: any) => ({
            purchase: detail.purchase,
            product: detail.product,
            quantity: detail.quantity,
            purchasePrice: detail.purchasePrice,
            itemCost: detail.itemCost,
            expDate: detail.expDate,
            mnuDate: detail.mnuDate
        }));
        await Stock.insertMany(stockItems);

        res.status(201).json({ message: 'Purchase created successfully', purchase });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create purchase' });
    }
};


export const getAllPurchaseInfo = async (req: Request, res: Response) => {
    try {
        const { purchaseDate } = req.query;

        let filter = {};
        if (purchaseDate) {
            // If purchaseDate parameter is provided, filter the purchases by purchaseDate
            filter = { purchaseDate };
        }

        // Find the purchases based on the filter
        const purchases = await Purchase.find(filter);

        res.json(purchases);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get purchase information' });
    }
};

export const getPurchaseInfo = async (req: Request, res: Response) => {
    try {
        const { purchaseId } = req.params;

        // Find the purchase by ID
        const purchase = await Purchase.findById(purchaseId);

        if (!purchase) {
            return res.status(404).json({ error: 'Purchase not found' });
        }

        // Find the purchase details for the given purchase ID
        const purchaseDetails = await PurchaseDetail.find({ purchase: purchase._id });

        // Find the stock items for the given purchase ID
        const stockItems = await Stock.find({ purchase: purchase._id });

        res.json({ purchase, purchaseDetails, stockItems });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get purchase information' });
    }
};