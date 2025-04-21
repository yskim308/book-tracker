import express from "express";
import cors from "cors";
import passport from "passport";
import { router as GoogleAuthRouter } from "./routes/googleAuthRouter";

const port = 4000;

const app = express();
app.use(cors());

app.use(passport.initialize());

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("hello world from /");
});

app.use("/auth/google", GoogleAuthRouter);

app.listen(port, () => {
  console.log("listening on port: " + port);
});
