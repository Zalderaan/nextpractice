import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

export const connectDB = async (): Promise<void> => {
    try {
        if (MONGO_URI === undefined) throw new Error('MONGO_URI is undefined');
        const conn = await mongoose.connect(MONGO_URI);

        console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${(error as Error).message}`);
        // Exit process with failure if DB connection is critical
        process.exit(1);
    }
};