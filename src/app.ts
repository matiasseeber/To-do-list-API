import express, { Application } from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

declare global {
    namespace Express {
        interface Request {
            decoded: any
            body: any
            token: string
        }
    }
}

app.use(compression({
    filter: () => true,
    threshold: 0
}));

app.use(morgan("dev"));
app.enable('trust proxy');
app.disable('x-powered-by');
app.use(cors());
app.options('*', cors());

app.use(bodyParser.raw());
app.use(bodyParser.text());

app.use(bodyParser.json({
    limit: '10mb'
}));

app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}));

app.set("secretKey", process.env.SECRET_KEY || "oxBRF5rgdYNC5VsB9r0Ahzw3Nu2h6bgPBir05PV0");

BigInt.prototype['toJSON'] = function () {
    return parseInt(this.toString());
};

process.env.DATABASE_URL = process.env.DATABASE_URL ? process.env.DATABASE_URL : "postgresql://postgres:admin@localhost:5432/To-do list?schema=public";

export const customSalt = process.env.customSalt || '$2a$10$mycustomsaltforsamehash'; // Replace this with your own salt

export default app;