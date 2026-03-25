import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export const connectDB = async (): Promise<void> => {
    try {
        if (MONGODB_URI === undefined) throw new Error('MONGO_URI is undefined');
        const conn = await mongoose.connect(MONGODB_URI);

        console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${(error as Error).message}`);
        // Exit process with failure if DB connection is critical
        process.exit(1);
    }
};