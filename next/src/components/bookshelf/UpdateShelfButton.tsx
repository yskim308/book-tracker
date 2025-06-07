"use client";
import { useState, useEffect } from "react";
import type React from "react";

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
import { Edit } from "lucide-react";

interface UpdateShelfButtonProps {
  bookshelfName: string;
  description: string;
  onUpdate: (name: string, description: string) => void;
}

export default function UpdateShelfButton({
  bookshelfName,
  description,
  onUpdate,
}: UpdateShelfButtonProps) {
  const [updatedName, setUpdatedName] = useState<string>(bookshelfName);
  const [updatedDescription, setUpdatedDescription] =
    useState<string>(description);
  const [isOpen, setIsOpen] = useState(false);

  // Reset form values when props change or dialog opens
  useEffect(() => {
    if (isOpen) {
      setUpdatedName(bookshelfName);
      setUpdatedDescription(description);
    }
  }, [isOpen, bookshelfName, description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(updatedName, updatedDescription);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit Shelf
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Bookshelf</DialogTitle>
          <DialogDescription>
            Make changes to your bookshelf details here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                placeholder="Enter bookshelf name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
                placeholder="Enter bookshelf description"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
