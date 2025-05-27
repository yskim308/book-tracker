import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import { User } from "@/types";

const UserContext = createContext<User | null>(null);

export function useUser(): User {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
  if (!backendBase) {
    throw new Error("bakcend env varialbe not found");
  }

  useEffect(() => {
    const fetchId = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendBase}/getUser`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          window.location.href = "/signIn";
        }
      } catch (e) {
        console.error("error: " + e);
      }
    };
  });
}
