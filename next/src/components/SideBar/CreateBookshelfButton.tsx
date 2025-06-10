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

export default function CreateBookshelfButton() {
  const [open, setOpen] = useState(false);
  const [bookshelfName, setBookshelfName] = useState("");
  const [description, setDescription] = useState("");
  const { refetchBookshelves, authFetch } = useUserState();

  const handleCreateBookshelf = async (
    bookshelfName: string,
    description: string,
  ) => {
    const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;

    const response = await authFetch(`${backendBase}/bookshelves/create`, {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookshelfName.trim()) {
      toast.error("bookshelf name is required");
      return;
    }

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
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={() => setOpen(false)}>
              Create Bookshelf
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
