import express from "express";
import bodyParser from "body-parser";
import codeRouter from './routes/code.route';

const app = express();

app.use(bodyParser.json());

app.use("/code", codeRouter);

export default app;