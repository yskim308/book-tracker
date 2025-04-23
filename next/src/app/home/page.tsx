"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
  const [message, setMesssage] = useState(null); // type explictily later

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backendBase}/home`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("unauthorized"); // should route elsewhere to error page
        }
        const message = await response.json();
        console.log(message);
        setMesssage(message);
      } catch (e: unknown) {
        console.log(e);
      }
    };

    fetchData();
  });
  return (
    <div>
      <h1>hello from homepage, check cookies please</h1>
      <h1>message: {message}</h1>
    </div>
  );
}
