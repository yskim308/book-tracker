"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BookshelfCard } from "./bookshelfCard";
import useFetchBookshelves from "./useFetchBookshelves";
import { Skeleton } from "@/components/ui/skeleton";
import { Library } from "lucide-react";

export function AppSidebar() {
  const { bookshelves, shelfLoading, user, loading } = useFetchBookshelves();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-inherit">
                <Library className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">My Library</span>
                <span className="truncate text-xs">
                  {loading ? "Loading..." : user?.name || "Guest"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Bookshelves</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2">
              {shelfLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-5 w-8 rounded-full" />
                    </div>
                  </div>
                ))
              ) : bookshelves && bookshelves.length > 0 ? (
                // Render bookshelves
                bookshelves.map((bookshelf) => (
                  <BookshelfCard
                    key={bookshelf.name}
                    name={bookshelf.name}
                    count={bookshelf.count}
                  />
                ))
              ) : (
                // Empty state
                <div className="text-center py-8 text-muted-foreground">
                  <Library className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No bookshelves found</p>
                </div>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
