import 'dotenv/config'
import app from './app'
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

const startServer = () => {
    try {
        // connect db first before starting server
        connectDB()
            .then(() => {
                app.listen(PORT, () => {
                    console.log(`Server running on http://localhost:${PORT}`);
                })
            })
            .catch((error) => {
                console.error('Failed to connect to DB:', error.message);
                process.exit(1); // Or handle differently
            });
    } catch (error) {
        console.error('Error starting server: ', (error as Error).message);
    }
}

startServer(); // Run the app