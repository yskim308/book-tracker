import type { UserBook } from "@/types";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EditDateButton {
  book: UserBook;
}
export default function EditDateButton({ book }: EditDateButton) {
  const [date, setDate] = useState<Date | undefined>(
    new Date(book.completionDate),
  );
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-col">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              id="date"
              className="justify-between font-normal"
            >
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
