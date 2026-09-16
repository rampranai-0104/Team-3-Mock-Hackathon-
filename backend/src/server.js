const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectdb = require('./config/db');

const PORT = process.env.PORT || 6677;

const startServer = async () => {
    try {
        await connectdb();

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`SERVER IS RUNNING SUCCESSFULLY on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
