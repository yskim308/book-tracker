import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const jwtSecret = process.env.JWT_SECRET!;
if (!jwtSecret) {
  throw new Error("Jwt secret not set");
}

interface AuthRequest extends express.Request {
  user?: {
    userId: string;
    userEmails: string[];
    userProfileUrl: string;
    userPhotos: string[];
  };
}

interface User {
  userId: string;
  userEmails: string[];
  userProfileUrl: string;
  userPhotos: string[];
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

  jwt.verify(token, jwtSecret, (err: unknown, decoded: unknown) => {
    if (err) {
      console.log(err);
      return res.status(403).send("Invalid access token");
    }

    req.user = decoded as User;
    next();
  });
}
