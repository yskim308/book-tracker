"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useUserState } from "@/context/UserContext";

const handleCreateBookshelf = async (
  bookshelfName: string,
  description: string,
) => {
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;

  const response = await fetch(`${backendBase}/bookshelves/create`, {
    method: "POST", // Changed to POST since you're creating data
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bookshelfName,
      description,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create bookshelf");
  }

  return response.json();
};

export default function CreateBookshelfButton() {
  const [open, setOpen] = useState(false);
  const [bookshelfName, setBookshelfName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { refetchBookshelves } = useUserState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookshelfName.trim()) {
      toast.error("bookshelf name is required");
      return;
    }

    setIsLoading(true);

    try {
      await handleCreateBookshelf(bookshelfName, description);

      toast.success("bookshelf created");

      // Reset form and close modal
      setBookshelfName("");
      setDescription("");
      setOpen(false);
      refetchBookshelves();
    } catch (error) {
      toast.error("error in creating bookshelf");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Bookshelf</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Bookshelf</DialogTitle>
          <DialogDescription>
            Add a new bookshelf to organize your books. Give it a name and
            optional description.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={bookshelfName}
                onChange={(e) => setBookshelfName(e.target.value)}
                placeholder="Enter bookshelf name"
                disabled={isLoading}
                required
                autoComplete="off"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter bookshelf description (optional)"
                disabled={isLoading}
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              onClick={() => setOpen(false)}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Bookshelf
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
