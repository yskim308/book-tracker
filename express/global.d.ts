import "express";
import type { User } from "./auth/authTypes";

declare global {
  namespace Express {
    interface User extends User {}
  }
}
