"use client";

import { useState, useEffect } from "react";
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useUserState } from "@/context/UserContext";
import type { UserBook } from "@/types";
import { Plus, Loader2, Check } from "lucide-react";

interface AddToShelfProps {
  book: UserBook;
}

interface ExistingBook {
  id: string;
  externalId: string;
  title: string;
  author: string[];
  status: "READ" | "TO_READ" | "READING";
  completionDate: string | null;
  bookshelves: string[];
}

export default function AddToShelf({ book }: AddToShelfProps) {
  const { bookshelves, refetchBookshelves, authFetch } = useUserState();
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;

  const [isLoading, setIsLoading] = useState(false);
  const [existingBook, setExistingBook] = useState<ExistingBook | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const checkBookExists = async () => {
    if (hasChecked || isLoading) return;

    setIsLoading(true);
    try {
      const response = await authFetch(
        `${backendBase}/books/check/${book.externalId}`,
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          setExistingBook(data.book);
          console.log("book exists");
        } else {
          setExistingBook(null);
          console.log("book doesn't exist");
        }
      }
    } catch (error) {
      console.error("Error checking book existence:", error);
    } finally {
      setIsLoading(false);
      setHasChecked(true);
    }
  };

  const handleAddToBookshelf = async (bookshelfName: string) => {
    setIsSubmitting(true);
    try {
      const requestBody = {
        externalId: book.externalId,
        title: book.title,
        authors: book.author,
      };
      console.log("trying to submit: ");
      console.log(requestBody);
      console.log(JSON.stringify(requestBody));

      const response = await authFetch(
        `${backendBase}/bookshelves/${bookshelfName}`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Book added successfully:", result);

        // Refresh bookshelves data
        refetchBookshelves();

        // Show success message
        toast.success(result.message);
      } else if (response.status === 409) {
        toast.error("Book is already in this bookshelf");
      } else {
        const error = await response.json();
        toast.error(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error("Failed to add book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger
        onMouseEnter={checkBookExists}
        onClick={checkBookExists}
        className="[&>svg:last-child]:hidden"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add to Other
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-32 md:w-56">
        {isLoading ? (
          <DropdownMenuItem disabled>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm">Checking book...</span>
          </DropdownMenuItem>
        ) : (
          <>
            {existingBook && (
              <>
                <div className="px-2 py-1.5 text-xs text-blue-700 font-medium bg-blue-50 mx-1 rounded border">
                  Book already exists
                  {existingBook.bookshelves.length > 0 && (
                    <div className="text-xs text-blue-600">
                      In: {existingBook.bookshelves.join(", ")}
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator />
              </>
            )}

            {bookshelves.length > 0 ? (
              bookshelves.map((shelf) => {
                const isAlreadyInShelf = existingBook?.bookshelves.includes(
                  shelf.name,
                );
                return (
                  <DropdownMenuItem
                    key={shelf.name}
                    onClick={() => handleAddToBookshelf(shelf.name)}
                    disabled={isAlreadyInShelf || isSubmitting}
                  >
                    {isAlreadyInShelf && <Check className="mr-2 h-4 w-4" />}
                    {!isAlreadyInShelf && <div className="mr-6" />}
                    <span className={isAlreadyInShelf ? "text-gray-400" : ""}>
                      {shelf.name}
                      {isAlreadyInShelf && " (already added)"}
                    </span>
                  </DropdownMenuItem>
                );
              })
            ) : (
              <DropdownMenuItem disabled>
                <span className="text-sm text-gray-500">
                  No bookshelves available.
                </span>
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
