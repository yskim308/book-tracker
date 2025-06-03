"use client";
import { TableCell, TableRow } from "@/components/ui/table";
import type React from "react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState, useCallback } from "react";
import AddToShelf from "./AddToShelf";

interface BookshelfBookRowProps {
  book: UserBook;
  onStatusChange: (
    externalId: string,
    newStatus: "READ" | "TO_READ" | "READING",
  ) => Promise<void>;
  onDelete: (externalId: string) => Promise<void>;
}

export function BookshelfBookRow({
  book,
  onStatusChange,
  onDelete,
}: BookshelfBookRowProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedTitle, setExpandedTitle] = useState(false);
  const [expandedAuthor, setExpandedAuthor] = useState(false);

  const navigateToBook = () => {
    router.push(`/works/${book.externalId}`);
  };

  const handleStatusChange = async (value: string) => {
    await onStatusChange(
      book.externalId,
      value as "READ" | "TO_READ" | "READING",
    );
  };

  const handleDelete = useCallback(async () => {
    try {
      await onDelete(book.externalId);
    } finally {
      setShowDeleteDialog(false);
      setTimeout(() => {
        document.body.focus();
      }, 100);
    }
  }, [book.externalId, onDelete]);

  const handleDeleteClick = () => {
    setIsDropdownOpen(false);
    setShowDeleteDialog(true);
  };

  const handleDialogClose = useCallback((open: boolean) => {
    setShowDeleteDialog(open);
    if (!open) {
      setTimeout(() => {
        document.body.focus();
        document.body.style.pointerEvents = "auto";
      }, 100);
    }
  }, []);

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTitle(!expandedTitle);
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedAuthor(!expandedAuthor);
  };

  const authorText = book.author.join(", ");

  return (
    <>
      <TableRow className="cursor-pointer hover:bg-muted/50">
        <TableCell
          className="w-1/3 max-w-0"
          onClick={expandedTitle ? handleTitleClick : navigateToBook}
        >
          <div
            className={`font-medium cursor-pointer ${expandedTitle ? "whitespace-normal break-words" : "truncate"}`}
            onClick={handleTitleClick}
            title={book.title}
          >
            {book.title}
          </div>
        </TableCell>

        <TableCell
          className="w-1/4 max-w-0"
          onClick={expandedAuthor ? handleAuthorClick : navigateToBook}
        >
          <div
            className={`cursor-pointer ${expandedAuthor ? "whitespace-normal break-words" : "truncate"}`}
            onClick={handleAuthorClick}
            title={authorText}
          >
            {authorText}
          </div>
        </TableCell>

        <TableCell className="w-1/6" onClick={(e) => e.stopPropagation()}>
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

        <TableCell className="w-1/4" onClick={navigateToBook}>
          {book.completionDate
            ? format(new Date(book.completionDate), "MMM d, yyyy")
            : "-"}
        </TableCell>

        <TableCell className="w-16" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <AddToShelf book={book} />
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDeleteClick}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {showDeleteDialog && (
        <AlertDialog open={showDeleteDialog} onOpenChange={handleDialogClose}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove "{book.title}" from this bookshelf. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => handleDialogClose(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
