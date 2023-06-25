import { Request, Response } from 'express';
import Purchase from '../models/domain/Purchase';
import PurchaseDetail from '../models/domain/PurchaseDetail';
import Stock from '../models/domain/Stock';

export const createPurchase = async (req: Request, res: Response) => {
    try {
        const { purchaseDate, currency, exchangeRate, note, extraCost, purchaseDetails } = req.body;

        // Create a new purchase
        const purchase = new Purchase({
            purchaseDate,
            currency: currency.currencyId,
            exchangeRate,
            extraCost,
            note
        });
        await purchase.save();

        // Create purchase details
        const details = purchaseDetails.map((detail: any) => ({
            purchase: purchase._id,
            product: detail.product.productId,
            quantity: detail.quantity,
            purchasePrice: detail.purchasePrice,
            itemCost: detail.itemCost,
            expDate: detail.expDate,
            mnuDate: detail.mnuDate
        }));
        await PurchaseDetail.insertMany(details);


        const itemCost = purchase.extraCost / purchaseDetails.length;

        // Save purchase and purchase details to stock
        const stockItems = purchaseDetails.map((detail: any) => ({
            purchase: purchase._id,
            product: detail.product.productId,
            quantity: detail.quantity,
            purchasePrice: detail.purchasePrice,
            itemCost: itemCost,
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
        const page = Number(req.query.page) || 0; // Current page number
        const limit = Number(req.query.limit) || 0; // Number of products per page

        const totalPurchases = await Purchase.countDocuments();
        const totalPages = Math.ceil(totalPurchases / limit);

        let purchases = [];

        if (page === 0 && limit === 0) {
            // No Paging Params have given
            purchases = await Purchase.find().lean().exec();
        } else {
            purchases = await Purchase.find()
                .skip((page - 1) * limit)
                .limit(limit)
                .lean()
                .exec();
        }


        const data = await Promise.all(
            purchases.map(async (purchase) => {
                const purchaseRes = {
                    purchaseId: purchase._id,
                    purchaseDate: purchase.purchaseDate,
                    currency: purchase.currency,
                    exchangeRate: purchase.exchangeRate,
                    extraCost: purchase.extraCost,
                    note: purchase.note
                };
                return purchaseRes;
            })
        );

        res.status(200).json({
            data,
            page,
            totalPages,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get purchase information', error: error });

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