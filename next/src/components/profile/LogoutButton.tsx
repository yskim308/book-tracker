"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;

  if (!backendBase) {
    throw new Error("Backend environment variable not found");
  }

  const handleLogout = async () => {
    try {
      await fetch(`${backendBase}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e: unknown) {
      console.error("Error during logout:", e);
    } finally {
      window.location.reload();
    }
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start px-4 py-2 h-auto rounded-none hover:bg-muted"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4 mr-2" />
      <span>Logout</span>
    </Button>
  );
}
