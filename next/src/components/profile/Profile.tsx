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
import { useUserState } from "@/context/UserContext";

export default function Profile() {
  const { user, loading } = useUserState();
  const router = useRouter();

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
                src={user?.picture || "/placeholder.svg"}
                alt={`${name}'s profile picture`}
                fill
                className="object-cover"
              />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 p-0 overflow-hidden rounded-lg"
          >
            <ProfileContext name={user?.name} picture={user?.picture} />
            <LogoutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
