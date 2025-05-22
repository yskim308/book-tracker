"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import LogoutButton from "./LogoutButton";
import ProfileContext from "./ProfileContext";

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
    <div className="relative">
      {loading ? (
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-primary/10 transition-all hover:ring-2 hover:ring-primary/20">
              <Image
                src={picture || "/placeholder.svg"}
                alt={`${name}'s profile picture`}
                fill
                className="object-cover"
              />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 p-0 overflow-hidden">
            <ProfileContext name={name} picture={picture} />
            <LogoutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
