import express from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import { router as GoogleAuthRouter } from "./routes/googleAuthRouter";
import { router as HomeRouter } from "./routes/homeRouter";

const port = 4000;

const app = express();
app.use(cors());
app.use(passport.initialize());
app.use(cookieParser());

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("hello world from /");
});

app.use("/auth/google", GoogleAuthRouter);
app.use("/home", HomeRouter);

app.listen(port, () => {
  console.log("listening on port: " + port);
});
