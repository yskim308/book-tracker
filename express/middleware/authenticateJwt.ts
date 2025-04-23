import express from "express";
import type { User } from "../generated/prisma";
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
  console.log("middleware triggered");
  const token = req.cookies.authToken;
  const frontendBase = process.env.FRONTEND_BASE;
  if (!token) {
    res.status(401).send("No acesss token provided");
    res.redirect(`${frontendBase}/error`);
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

      res.locals.user = decoded as User;
      next();
    },
  );
}
