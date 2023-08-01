import { Request, Response } from 'express';
import Brand from "../models/domain/Brand";
import Category from "../models/domain/Category";
import Product from "../models/domain/Product";
import { Timestamp } from "mongodb";
import { savePurchaseInfo } from "../services/PurchaseService";


interface ExcelRow {
    Brand: string;
    Category: string;
    Name: string;
    Description: string;
    Price: number;
    Weight: string;
    Qty: number;
    ManufactureDate: Timestamp;
    ExpireDate: Timestamp;

}

export const importDataFromExcel = async (req: Request, res: Response) => {
    try {

        let purchaseDetails: any[] = [];
        const data = req.body as any;

        if (!data) {
            res.status(400).json({ message: 'No data found in payload' });
        }

        for (const row of data) {
            const product = new Product({
                name: row.Name?.trim(),
                description: row.Description?.trim(),
                sellingPrice: row.Price,
                weight: row.Weight?.trim()
            });

            // Get the brand and category IDs from the database based on the names in the Excel file
            const brand = await Brand.findOne({ name: row.Brand?.trim() }); // Replace "Brand" with your actual brand model
            const category = await Category.findOne({ name: row.Category?.trim() }); // Replace "Category" with your actual category model

            // If brand or category not found in the database, you can choose to handle it accordingly
            if (!brand || !category) {
                console.log(`Brand or Category not found for row: ${JSON.stringify(row)}`);
            } else {
                product.brand = brand._id;
                product.category = category._id;

                // Save the product to the database
                const existingProduct = await Product.findOne({ name: row.Name.trim() });
                if (!existingProduct) {
                    await product.save();
                }
                else{
                    console.log("Skipped saving existing product.")
                }


                //Prepare purchaseDetails
                let purchaseDetail = {
                    product: {
                        productId: product._id
                    },
                    quantity: row.Qty,
                    purchasePrice: 0,
                    itemCost: 0,
                    expDate: row.ExpireDate,
                    mnuDate: row.ManufactureDate
                };

                purchaseDetails.push(purchaseDetail);
            }
        }

        //Save Purchase Info

        let PurchaseInfo: any = {
            purchaseDate: new Date(),
            currency: null,
            exchangeRate: 1,
            extraCost: 0,
            purchaseDetails: purchaseDetails
        }

        await savePurchaseInfo(PurchaseInfo);
        console.log('Data imported successfully');

        res.status(200).json('Data imported successfully');

    } catch (error) {
        console.error('Error importing data:', error);
        /* throw new Error('Error importing data'); */
        res.status(500).json({ error: 'Failed to import data.' });
    }
}

