"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserState } from "@/context/UserContext";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BookshelfBookRow } from "@/components/bookshelf/BookshelfBookRow";
import { BookshelfBookCard } from "@/components/bookshelf/BookShelfCard";
import { toast } from "sonner";
import { DeleteBookshelfButton } from "@/components/bookshelf/DeleteBookshelfButton";
import type { UserBook } from "@/types";
import UpdateShelfButton from "@/components/bookshelf/UpdateShelfButton";

interface GetBooksRes {
  bookshelf: {
    id: number;
    name: string;
    description: string;
  };
  books: UserBook[];
}

interface BookShelf {
  name: string;
  description: string;
}

export default function Page() {
  const params = useParams();
  const bookshelfName = params.name as string;
  const [books, setBooks] = useState<UserBook[] | null>(null);
  const [bookshelf, setBookshelf] = useState<BookShelf | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;

  const { refetchBookshelves } = useUserState();

  const router = useRouter();
  useEffect(() => {
    const getBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${backendBase}/bookshelves/${bookshelfName}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch bookshelf data");
        }

        const data: GetBooksRes = await response.json();
        setBookshelf(data.bookshelf);
        setBooks(data.books);
        setError(null);
      } catch (err) {
        console.error("Error fetching bookshelf:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    if (bookshelfName) {
      getBooks();
    }
  }, [bookshelfName, backendBase]);

  const handleStatusChange = async (
    externalId: string,
    newStatus: "READ" | "TO_READ" | "READING",
  ) => {
    try {
      const response = await fetch(`${backendBase}/books/status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          externalId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update book status");
      }

      const { data } = await response.json();

      // Update the books state with the updated book
      setBooks(
        (prevBooks) =>
          prevBooks?.map((book) =>
            book.externalId === externalId
              ? {
                  ...book,
                  status: newStatus,
                  completionDate: data.completionDate,
                }
              : book,
          ) || null,
      );
      toast.success("book status updated");
    } catch (err) {
      console.error("Error updating book status:", err);
      toast.error("Error updating book status");
    }
  };

  const handleDeleteBook = async (externalId: string) => {
    try {
      const response = await fetch(
        `${backendBase}/bookshelves/${bookshelfName}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            externalId: externalId,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to delete book from bookshelf",
        );
      }

      // Remove the book from the local state
      setBooks(
        (prevBooks) =>
          prevBooks?.filter((book) => book.externalId !== externalId) || null,
      );
      refetchBookshelves();
      toast.success("book removed from bookshelf");
    } catch (err) {
      console.error("Error deleting book:", err);
      toast.error("error deleting book");
    }
  };

  const handleDeleteShelf = async (bookshelfName: string) => {
    try {
      await fetch(`${backendBase}/bookshelves/delete`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookshelfName: bookshelfName,
        }),
        method: "DELETE",
      });
      return;
    } catch (e) {
      toast.error("error in deleting bookshelf");
      throw new Error("error: " + e);
    } finally {
      router.push("/");
      refetchBookshelves();
    }
  };

  const handleUpdateShelf = async (
    oldName: string,
    name: string,
    description: string,
  ) => {
    try {
      const response = await fetch(
        `${backendBase}/bookshelves/update/${oldName}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            description: description,
          }),
          method: "PUT",
        },
      );
      if (response.status === 409) {
        toast.error("Bookshelf with this name already exists");
      }
    } catch (e) {
      toast.error("error in updating bookshelf");
      throw new Error("error: " + e);
    } finally {
      router.push(`/bookshelves/${name}`);
      refetchBookshelves();
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {loading ? (
        <>
          <div className="space-y-2 mb-8">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Desktop Loading Skeleton */}
          <div className="hidden md:block border rounded-md">
            <div className="p-4">
              <Skeleton className="h-8 w-full mb-4" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full mb-2" />
              ))}
            </div>
          </div>

          {/* Mobile Loading Skeleton */}
          <div className="md:hidden space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mb-8">
            <div className="flex items-start mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  {bookshelf?.name}
                  <div className="ml-4">
                    <UpdateShelfButton
                      oldName={bookshelf?.name || ""}
                      bookshelfName={bookshelf?.name || ""}
                      description={bookshelf?.description || ""}
                      onUpdate={handleUpdateShelf}
                    />
                    <DeleteBookshelfButton
                      bookshelfName={bookshelf?.name || ""}
                      onDelete={handleDeleteShelf}
                    />
                  </div>
                </h1>
                {bookshelf?.description && (
                  <p className="text-muted-foreground">
                    {bookshelf.description}
                  </p>
                )}
              </div>
            </div>
          </div>
          {books && books.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Title</TableHead>
                      <TableHead className="w-1/4">Author(s)</TableHead>
                      <TableHead className="w-1/6">Status</TableHead>
                      <TableHead className="w-1/4">Completion Date</TableHead>
                      <TableHead className="w-16">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.map((book) => (
                      <BookshelfBookRow
                        key={book.id}
                        book={book}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteBook}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {books.map((book) => (
                  <BookshelfBookCard
                    key={book.id}
                    book={book}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteBook}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No books found in this bookshelf.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
