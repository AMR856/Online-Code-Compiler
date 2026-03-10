import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import codeRouter from "./routes/code.route";
import { errorHandler } from "./utils/errorHandler";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
      },
    },
  }),
);
app.use(cors());
app.use(bodyParser.json({ limit: "150kb" }));
app.use("/code", codeRouter);
app.use(errorHandler);

export default app;