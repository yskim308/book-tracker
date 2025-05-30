"use client";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { User } from "@/types";
import type { Bookshelf } from "@/types";

interface UserContextType {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

export function useUserState(): UserContextType {
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [shelfLoading, setShelfLoading] = useState<boolean>(true);
  const [bookshelves, setBookshelves] = useState<Bookshelf[]>([]);

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

        const user: User = await response.json();
        setUser(user);
      } catch (e) {
        console.error("error: " + e);
      } finally {
        setLoading(false);
      }
    };

    fetchId();
  }, []);

  const fetchBookshelves = useCallback(async () => {
    // Only fetch bookshelves if user is loaded and not null
    // or if you want to fetch bookshelves even without a user, adjust this logic
    if (user === null && !loading) {
      // If user is null and no longer loading (i.e., not authenticated)
      setBookshelves([]); // Or set to null, depending on desired behavior for unauthenticated
      setShelfLoading(false);
      return;
    }
    if (loading) {
      // Wait for user loading to complete
      setShelfLoading(true); // Keep loading state true if user is still loading
      return;
    }

    try {
      setShelfLoading(true);
      const response = await fetch(`${backendBase}/bookshelves`, {
        credentials: "include",
      });
      console.log("fetching bookshelves");
      if (!response.ok) {
        console.error("error with getting api: ", response);
        // Optionally, handle specific error codes, e.g., 401 for unauthorized
        setBookshelves([]); // Clear bookshelves on error or if unauthorized
        return;
      }
      const data = await response.json();
      setBookshelves(data.bookshelves);
    } catch (e) {
      console.error("error with api: " + e);
      setBookshelves([]); // Clear bookshelves on error
    } finally {
      console.log("bookshelves fetch complete");
      setShelfLoading(false);
    }
  }, [backendBase, user, loading]);

  useEffect(() => {
    fetchBookshelves();
  }, [user, loading]);

  const value = {
    user,
    loading,
    bookshelves,
    shelfLoading,
    refetchBookshelves: fetchBookshelves,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
