import express from "express";
import bodyParser from "body-parser";
import codeRouter from './routes/code.route';
import { errorHandler } from "./utils/errorHandler";

const app = express();

app.use(bodyParser.json());

app.use("/code", codeRouter);
app.use(errorHandler);

export default app;