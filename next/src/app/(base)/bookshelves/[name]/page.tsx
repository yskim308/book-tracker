"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { UserBook } from "@/types";

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
  const router = useRouter();
  const bookshelfName = params.name as string;
  const [books, setBooks] = useState<UserBook[] | null>(null);
  const [bookshelf, setBookshelf] = useState<BookShelf | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;

  useEffect(() => {
    const getBooks = async () => {
      try {
        console.log("getting books");
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
    } catch (err) {
      console.error("Error updating book status:", err);
      // You could add a toast notification here
    }
  };

  const navigateToBook = (externalId: string) => {
    router.push(`/works/${externalId}`);
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
          <div className="border rounded-md">
            <div className="p-4">
              <Skeleton className="h-8 w-full mb-4" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full mb-2" />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{bookshelf?.name}</h1>
            {bookshelf?.description && (
              <p className="text-muted-foreground">{bookshelf.description}</p>
            )}
          </div>

          {books && books.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Title</TableHead>
                    <TableHead className="w-1/4">Author(s)</TableHead>
                    <TableHead className="w-1/6">Status</TableHead>
                    <TableHead className="w-1/4">Completion Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books.map((book) => (
                    <TableRow
                      key={book.id}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell
                        onClick={() => navigateToBook(book.externalId)}
                      >
                        <div className="font-medium">{book.title}</div>
                      </TableCell>
                      <TableCell
                        onClick={() => navigateToBook(book.externalId)}
                      >
                        {book.author.join(", ")}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={book.status}
                          onValueChange={(value) =>
                            handleStatusChange(
                              book.externalId,
                              value as "READ" | "TO_READ" | "READING",
                            )
                          }
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TO_READ">To Read</SelectItem>
                            <SelectItem value="READING">Reading</SelectItem>
                            <SelectItem value="READ">Read</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell
                        onClick={() => navigateToBook(book.externalId)}
                      >
                        {book.completionDate
                          ? format(new Date(book.completionDate), "MMM d, yyyy")
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
