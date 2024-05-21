import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { AuthRoute } from "./routes/auth.route";
import { ErrorMiddleWare } from "./middleware/error.middleware";

const app = express();
const errorMiddleWare = new ErrorMiddleWare();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(morgan("dev"));
app.use(helmet());

app.use("/auth", AuthRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("oH HELLO");
});

app.use(errorMiddleWare.errorMiddleWare);

app.listen(5000, () => {
  console.log("Server is currently running on port 5000");
});
