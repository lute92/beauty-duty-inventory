import Purchase from "../models/domain/Purchase";
import PurchaseDetail from "../models/domain/PurchaseDetail";
import { generatePurchaseOrderNumber } from "../utils/utils";

export const savePurchaseInfo = async (data: any): Promise<void> => {
    try {

        if (!data.purchaseDate || !data.purchaseDetails) {
            throw new Error('Required fields are missing');
        }

        const { purchaseDate, currency, exchangeRate, note, extraCost, purchaseDetails } = data;

        let orderNumber = generatePurchaseOrderNumber();
        // Create a new purchase
        const purchase = new Purchase({
            orderNumber: orderNumber,
            purchaseDate,
            currency: currency?.currencyId || null,
            exchangeRate,
            extraCost,
            note
        });

        await purchase.save();

        // Create purchase details
        const itemCost = purchase.extraCost / purchaseDetails.length;

        const details = purchaseDetails.map((detail: any) => ({
            purchase: purchase._id,
            product: detail.product.productId,
            quantity: detail.quantity,
            purchasePrice: detail.purchasePrice,
            itemCost: itemCost,
            expDate: detail.expDate,
            mnuDate: detail.mnuDate
        }));

        await PurchaseDetail.insertMany(details);

        /* // Save purchase and purchase details to stock
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
 */
    } catch (error: any) {
        console.error('Error saving purchase information:', error);
        throw new Error('Failed to save purchase information');
    }
}