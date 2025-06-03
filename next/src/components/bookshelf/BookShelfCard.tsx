"use client";
import { Card, CardContent } from "@/components/ui/card";
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
import { MoreHorizontal, Trash2, Calendar } from "lucide-react";
import { useState, useCallback } from "react";
import AddToShelf from "./AddToShelf";

interface BookshelfBookCardProps {
  book: UserBook;
  onStatusChange: (
    externalId: string,
    newStatus: "READ" | "TO_READ" | "READING",
  ) => Promise<void>;
  onDelete: (externalId: string) => Promise<void>;
}

export function BookshelfBookCard({
  book,
  onStatusChange,
  onDelete,
}: BookshelfBookCardProps) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "READ":
        return "text-green-600 bg-green-50 border-green-200";
      case "READING":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "TO_READ":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "TO_READ":
        return "To Read";
      case "READING":
        return "Reading";
      case "READ":
        return "Read";
      default:
        return status;
    }
  };

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={navigateToBook}
      >
        <CardContent className="px-4">
          <div className="space-y-3">
            {/* Title and Author Section */}
            <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
              {/* Title */}
              <div
                className={`font-semibold text-lg leading-tight cursor-pointer flex items-center ${
                  expandedTitle
                    ? "whitespace-normal break-words"
                    : "line-clamp-2"
                }`}
                onClick={handleTitleClick}
                title={book.title}
              >
                {book.title}
                {/* Actions Dropdown */}
                <DropdownMenu
                  open={isDropdownOpen}
                  onOpenChange={setIsDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 shrink-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <AddToShelf book={book} />
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
              </div>

              {/* Author */}
              <div
                className={`text-sm text-muted-foreground cursor-pointer ${
                  expandedAuthor
                    ? "whitespace-normal break-words"
                    : "line-clamp-1"
                }`}
                onClick={handleAuthorClick}
                title={authorText}
              >
                {authorText}
              </div>
            </div>

            {/* Status and Actions Row */}
            <div
              className="flex items-center justify-between gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Status and Date */}
              <div className="flex-1 space-y-2">
                {/* Status Select */}
                <Select value={book.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TO_READ">To Read</SelectItem>
                    <SelectItem value="READING">Reading</SelectItem>
                    <SelectItem value="READ">Read</SelectItem>
                  </SelectContent>
                </Select>

                {/* Completion Date */}
                {book.completionDate && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {format(new Date(book.completionDate), "MMM d, yyyy")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
