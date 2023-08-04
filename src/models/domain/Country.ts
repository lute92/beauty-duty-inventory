import mongoose from "mongoose";

// Define the Country interface that extends Document
interface ICountry extends mongoose.Document {
    countryName: string;
    isoCode: string;
}

const countrySchema = new mongoose.Schema({
    countryName: {
        type: String,
        required: true,
        unique: true,
    },
    isoCode: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true });

// Create the Country model
export default mongoose.model<ICountry>('country', countrySchema);
