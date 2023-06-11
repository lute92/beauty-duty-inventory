import bodyParser from 'body-parser';
import express, { Application, Request, Response } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import routes from './routes/routes';

const cors = require('cors');

const DB_NAME = process.env.DB_NAME || "test";
const DB_URL = process.env.MONGO_URL || "mongodb+srv://admin:QyAYuqZ7shHzs0ZX@cluster0.hxyfkm5.mongodb.net/Test";
/* const DB_URL = process.env.MONGO_URL || "mongodb://localhost:27017/test" */

class Service {
    private app: Application;
    private port: number;
    private dbConnection: mongoose.Connection;


    constructor(port: number) {
        this.app = express();
        this.port = port;
        this.dbConnection = mongoose.connection;
    }

    public start(): any {
        this.connectToDatabase();
        this.configureRoutes();

        this.app.use(cors({
            origin: '*'
        }));

        this.app.use(express.json());

        // Routes
        this.app.use(routes);

        /* this.app.listen(this.port, () => {
            console.log(`Server started on port ${this.port}`);
        }); */

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

        mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions)
            .then(() => {
                console.log('Connected to MongoDB');
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