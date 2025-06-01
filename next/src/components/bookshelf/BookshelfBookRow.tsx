"use client";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import type { UserBook } from "@/types";

interface BookshelfBookRowProps {
  book: UserBook;
  onStatusChange: (
    externalId: string,
    newStatus: "READ" | "TO_READ" | "READING",
  ) => Promise<void>;
}

export function BookshelfBookRow({
  book,
  onStatusChange,
}: BookshelfBookRowProps) {
  const router = useRouter();

  const navigateToBook = () => {
    router.push(`/works/${book.externalId}`);
  };

  const handleStatusChange = async (value: string) => {
    await onStatusChange(
      book.externalId,
      value as "READ" | "TO_READ" | "READING",
    );
  };

  return (
    <TableRow className="cursor-pointer hover:bg-muted/50">
      <TableCell onClick={navigateToBook}>
        <div className="font-medium">{book.title}</div>
      </TableCell>
      <TableCell onClick={navigateToBook}>{book.author.join(", ")}</TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Select value={book.status} onValueChange={handleStatusChange}>
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
      <TableCell onClick={navigateToBook}>
        {book.completionDate
          ? format(new Date(book.completionDate), "MMM d, yyyy")
          : "-"}
      </TableCell>
    </TableRow>
  );
}
