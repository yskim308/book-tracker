import type React from "react";
import BookSearchbar from "@/components/searchbar/BookSearchbar";
import Profile from "@/components/profile/Profile";
import { UserProvider } from "@/context/UserContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/SideBar/Sidebar";
import { Toaster } from "sonner";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <UserProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          {/* Header with search and profile */}
          <div className="flex justify-center relative my-5 px-4">
            <SidebarTrigger
              className="absolute left-0 top-1/2 -translate-y-1/2"
              asChild
            />
            <BookSearchbar />
            <div className="absolute right-0 mx-2 md:mx-5 flex justify-center">
              <Profile />
            </div>
          </div>

          {/* Main content */}
          <div className="px-4">{children}</div>
          <Toaster />
        </main>
      </SidebarProvider>
    </UserProvider>
  );
}
