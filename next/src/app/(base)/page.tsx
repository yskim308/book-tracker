"use client";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backendBase}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          router.push("/signIn");
          return;
        }
        const userData = await response.json();
        setUser(userData.data);
        setLoading(false);
        console.log(userData.data);
      } catch (e: unknown) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full flex-col items-center text-3xl">
      {loading ? (
        <h1>loading</h1>
      ) : (
        <h1>welcome from home page, {user?.name}</h1>
      )}
    </div>
  );
}
