import mongoose from 'mongoose';
import {DB_NAME} from '../../constrant.js';

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Database connected successfully !! DB host:${connectionInstance.connection.host}`);
    } catch (error) {
        console.log('Error connecting to database:', error);
        process.exit(1);
    }
};