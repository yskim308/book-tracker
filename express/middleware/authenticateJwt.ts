import express from "express";
import type { User } from "../generated/prisma";
import jwt, { type JwtPayload, type VerifyErrors } from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET!;
if (!jwtSecret) {
  throw new Error("Jwt secret not set");
}

interface AuthRequest extends express.Request {
  user?: User;
}

export default function verifyJwt(
  req: AuthRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).send("No acesss token provided");
  }

  jwt.verify(
    token,
    jwtSecret,
    (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err) {
        console.log(err);
        return res.status(403).send("Invalid access token");
      }

      req.user = decoded as User;
      next();
    },
  );
}
