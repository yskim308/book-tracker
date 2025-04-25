import express from "express";
import jwt, { type JwtPayload, type VerifyErrors } from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET!;
if (!jwtSecret) {
  throw new Error("Jwt secret not set");
}

export default function verifyJwt(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const token = req.cookies.authToken;
  if (!token) {
    res.status(401).send("No acesss token provided");
    return;
  }

  jwt.verify(
    token,
    jwtSecret,
    (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err) {
        console.log(err);
        return res.status(403).send("Invalid access token");
      }
      const id = Number(decoded);
      if (isNaN(id)) {
        throw new Error("id from jwt sign is NOT a number");
      }
      res.locals.userId = id;
      console.log(res.locals.user);
      next();
    },
  );
}
