import express, { Application, Request, Response } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import routes from './routes/routes';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

class Service {
    private app: Application;
    private port: string;
    private dbConnection: mongoose.Connection;
    private DB_NAME: string;
    private DB_URL: string;

    constructor() {
        dotenv.config();
        this.app = express();
        this.port = process.env.INVENTORY_SERVICE_PORT || "4900";
        this.dbConnection = mongoose.connection;

        this.DB_NAME = process.env.MONGO_DBNAME || "test";
        this.DB_URL = `mongodb+srv://${process.env.MONGO_DBUSER}:${process.env.MONGO_DBPASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DBNAME}`;
    }

    public start(): any {
        this.connectToDatabase();
        this.configureRoutes();

        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

        this.app.use(cors({
            origin: '*'
        }));

        this.app.use(express.json());

        // Routes
        this.app.use(routes);

        return this.app.listen(this.port, () => {
            console.log(`Server started on port ${this.port}`);
        });
    }

    public stop(): void {
        this.closeDatabaseConnection();
        console.log('Server stopped');
    }

    public getApp(): Application {
        return this.app;
    }

    private connectToDatabase(): void {
        mongoose.connect(this.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions)
            .then(() => {
                console.log(`Connected to MongoDB:${this.DB_URL}`);
            })
            .catch((error) => {
                console.error('MongoDB connection error:', error);
            });

        this.dbConnection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
        });

    }

    private closeDatabaseConnection(): void {
        this.dbConnection.close();
    }

    private configureRoutes(): void {
        this.app.get('/', (req: Request, res: Response) => {
            res.send('Hello, World!');
        });
    }
}

export { Service };