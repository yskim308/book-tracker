"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CirclePlus, Loader2 } from "lucide-react";
import { useUserState } from "@/context/UserContext";
import { BookCheck, BookDashed, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BookData } from "./WorkDetail";

interface ExistingBook {
  id: string;
  externalId: string;
  title: string;
  author: string[];
  status: "READ" | "TO_READ" | "READING";
  completionDate: string | null;
  bookshelves: string[];
}

interface AddBookButtonProps {
  bookData: BookData;
}

export default function AddBookButton({ bookData }: AddBookButtonProps) {
  const { bookshelves, refetchBookshelves } = useUserState();
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;

  const [isLoading, setIsLoading] = useState(true);
  const [existingBook, setExistingBook] = useState<ExistingBook | null>(null);
  const [selectedBookshelf, setSelectedBookshelf] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<
    "READ" | "TO_READ" | "READING"
  >("TO_READ");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Check if book exists when component mounts or when popover opens
  useEffect(() => {
    if (isOpen && bookData.externalId) {
      checkBookExists();
    }
  }, [isOpen, bookData.externalId]);

  const checkBookExists = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${backendBase}/books/check${bookData.externalId}`,
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
    }
  };

  const handleSubmit = async () => {
    if (!selectedBookshelf) {
      alert("Please select a bookshelf");
      return;
    }

    if (!existingBook && !selectedStatus) {
      alert("Please select a status");
      return;
    }

    setIsSubmitting(true);
    try {
      const requestBody = {
        externalId: bookData.externalId,
        title: bookData.title,
        authors: bookData.authors,
        ...(!existingBook && { status: selectedStatus }),
      };
      console.log("trying to submit: ");
      console.log(requestBody);
      console.log(JSON.stringify(requestBody));

      const response = await fetch(
        `${backendBase}/bookshelves/${selectedBookshelf}`,
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

        // Close popover and reset form
        setIsOpen(false);
        setSelectedBookshelf("");
        setSelectedStatus("TO_READ");

        // Show success message
        alert(result.message);
      } else if (response.status === 409) {
        alert("Book is already in this bookshelf");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <CirclePlus className="h-6 w-6 cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm">Checking book...</span>
          </div>
        ) : (
          <>
            {existingBook && (
              <div className="mb-3 p-2 bg-blue-50 rounded border">
                <p className="text-xs text-blue-700 font-medium">
                  Book already exists
                </p>
                <p className="text-xs text-blue-600">
                  Status: existingBook.status
                </p>
                {existingBook.bookshelves.length > 0 && (
                  <p className="text-xs text-blue-600">
                    In: {existingBook.bookshelves.join(", ")}
                  </p>
                )}
              </div>
            )}

            <p className="text-sm font-medium mb-2">Add to Bookshelf</p>
            <Select
              value={selectedBookshelf}
              onValueChange={setSelectedBookshelf}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a bookshelf" />
              </SelectTrigger>
              <SelectContent>
                {bookshelves.length > 0 ? (
                  bookshelves.map((shelf) => (
                    <SelectItem
                      key={shelf.name}
                      value={shelf.name}
                      disabled={existingBook?.bookshelves.includes(shelf.name)}
                    >
                      <span
                        className={
                          existingBook?.bookshelves.includes(shelf.name)
                            ? "text-gray-400"
                            : ""
                        }
                      >
                        {shelf.name}
                        {existingBook?.bookshelves.includes(shelf.name) &&
                          " (already added)"}
                      </span>
                    </SelectItem>
                  ))
                ) : (
                  <p className="p-2 text-sm text-gray-500">
                    No bookshelves available.
                  </p>
                )}
              </SelectContent>
            </Select>

            <p className="text-sm font-medium mb-2 mt-4">Status</p>
            <Select
              value={existingBook ? existingBook.status : selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(value as "READ" | "TO_READ" | "READING")
              }
              disabled={!!existingBook}
            >
              <SelectTrigger
                className={`w-full ${existingBook ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <SelectValue placeholder="status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="READ">
                  <div className="flex items-center">
                    <BookCheck className="h-4 w-4 mr-2" />
                    Read
                  </div>
                </SelectItem>
                <SelectItem value="TO_READ">
                  <div className="flex items-center">
                    <BookDashed className="h-4 w-4 mr-2" />
                    To Read
                  </div>
                </SelectItem>
                <SelectItem value="READING">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Reading
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="my-2 w-full"
              onClick={handleSubmit}
              disabled={
                isSubmitting || !selectedBookshelf || bookshelves.length === 0
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                "Add Book"
              )}
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
