import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";

const port = 4000;

const app = express();
app.use(cors());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("hello world from /");
});

app.listen(port, () => {
  console.log("listening on port: " + port);
});

