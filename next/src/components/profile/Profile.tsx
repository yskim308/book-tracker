"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [name, setName] = useState<string>("");
  const [picture, setPicture] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${backendBase}/getUser`, {
          method: "GET",
          credentials: "include",
        });
        if (response.status === 401) {
          console.log("unauthorized");
          router.push("/signIn");
        }
        const data = await response.json();
        setName(data.name);
        setPicture(data.picture);
        setLoading(false);
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    };

    getData();
  }, []);

  return (
    <div className="">
      <div>
        {loading ? (
          <h1>loading</h1>
        ) : (
          <div>
            <Image
              src={picture}
              alt="images/account-circle-outline"
              width={40}
              height={40}
              className="rounded-full"
            />
            <h1>{name}</h1>
          </div>
        )}
      </div>
    </div>
  );
}
