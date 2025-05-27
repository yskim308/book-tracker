"use client";

import { useUserState } from "@/context/UserContext";
import { useEffect, useState } from "react";

interface Bookshelf {
  name: string;
  count: number;
}

export default function useFetchBookshelves() {
  const { user, loading } = useUserState();
  const [bookshelves, setBookshelves] = useState<Bookshelf[] | null>(null);
  const [shelfLoading, setShelfLoading] = useState<boolean>(true);

  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
  if (!backendBase) {
    throw new Error("backend env variable not setup");
  }

  useEffect(() => {
    const getShelves = async () => {
      try {
        if (loading) {
          return;
        }
        const response = await fetch(`${backendBase}/bookshelves`, {
          credentials: "include",
        });
        if (!response.ok) {
          console.error("error with getting api: ", response);
          return;
        }
        const data = await response.json();
        setBookshelves(data.bookshelves);
      } catch (e) {
        console.error("error with api: " + e);
      } finally {
        setShelfLoading(false);
      }
    };

    getShelves();
  }, [loading, backendBase]); // Added dependencies

  return {
    bookshelves,
    shelfLoading,
    user,
    loading,
  };
}
