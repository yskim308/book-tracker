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
import { MoreHorizontal, Trash2, Plus } from "lucide-react";
import { useState, useCallback } from "react";

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
      // Force focus back to document body to ensure page is interactive
      setTimeout(() => {
        document.body.focus();
      }, 100);
    }
  }, [book.externalId, onDelete]);

  const handleAddToOtherShelf = () => {
    setIsDropdownOpen(false);
    // TODO: Implement add to other shelf functionality
    console.log("Add to other shelf:", book.title);
  };

  const handleDeleteClick = () => {
    setIsDropdownOpen(false);
    setShowDeleteDialog(true);
  };

  const handleDialogClose = useCallback((open: boolean) => {
    setShowDeleteDialog(open);
    if (!open) {
      // Ensure page is interactive after dialog closes
      setTimeout(() => {
        document.body.focus();
        document.body.style.pointerEvents = "auto";
      }, 100);
    }
  }, []);

  return (
    <>
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
        <TableCell onClick={(e) => e.stopPropagation()}>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleAddToOtherShelf}>
                <Plus className="mr-2 h-4 w-4" />
                Add to other shelf
              </DropdownMenuItem>
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
