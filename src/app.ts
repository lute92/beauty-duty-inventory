import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import bodyParser from 'body-parser';
import routes from './routes/routes';

var cors = require('cors');

const DB_URL = "mongodb+srv://admin:admin123@cluster0.hxyfkm5.mongodb.net/beauty_duty"

const app: Application = express();

// Middleware
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());


// Database connection
mongoose
    .connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// Routes
app.use('/', routes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const port = 4900;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
