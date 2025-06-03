import express from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import { router as GoogleAuthRouter } from "./routes/googleAuthRouter";
import { router as HomeRouter } from "./routes/homeRouter";
import { router as BookRouter } from "./routes/booksRouter";
import { router as ShelfRouter } from "./routes/shelfRouter.ts";

const port = 4000;

const frontendBase = process.env.FRONTEND_BASE;
const app = express();
app.use(
  cors({
    origin: frontendBase,
    credentials: true,
  }),
);
app.use(passport.initialize());
app.use(cookieParser());
app.use(express.json());

app.use("/auth/google", GoogleAuthRouter);
app.use("/", HomeRouter);
app.use("/", BookRouter);
app.use("/", ShelfRouter);

app.listen(port, () => {
  console.log("listening on port: " + port);
});
