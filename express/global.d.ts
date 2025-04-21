import "express";
import type { User } from "./generated/prisma";

declare global {
  namespace Express {
    interface User extends User {}
  }
}
