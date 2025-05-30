import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CirclePlus } from "lucide-react";

export default function AddBookButton() {
  return (
    <Popover>
      <PopoverTrigger>
        <CirclePlus />
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}
