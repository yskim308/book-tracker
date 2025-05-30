import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CirclePlus } from "lucide-react";
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

export default function AddBookButton() {
  const { bookshelves, refetchBookshelves } = useUserState();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <CirclePlus className="h-6 w-6 cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <p className="text-sm font-medium mb-2">Add to Bookshelf</p>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a bookshelf" />
          </SelectTrigger>
          <SelectContent>
            {bookshelves.length > 0 ? (
              bookshelves.map((shelf) => (
                <SelectItem key={shelf.name} value={shelf.name}>
                  {shelf.name}
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
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"READ"}>
              <BookCheck />
              read
            </SelectItem>
            <SelectItem value={"TO_READ"}>
              <BookDashed />
              to-read
            </SelectItem>
            <SelectItem value={"READING"}>
              <BookOpen />
              reading
            </SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="my-2">
          add book
        </Button>
      </PopoverContent>
    </Popover>
  );
}
