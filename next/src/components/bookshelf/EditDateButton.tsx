import type { UserBook } from "@/types";
import { useState } from "react";
import { Calendar as CalendarIcon, CalendarCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EditDateButton {
  book: UserBook;
  onSubmit: (book: UserBook, date: Date) => void;
}
export default function EditDateButton({ book, onSubmit }: EditDateButton) {
  const [date, setDate] = useState<Date | undefined>(
    new Date(book.completionDate),
  );
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!date) {
      return;
    }
    onSubmit(book, date);
    setOpen(false);
  };

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
            <div className="flex justify-center mb-2">
              <Button variant="outline" onClick={() => handleSubmit()}>
                <h1>Submit</h1>
                <CalendarCheck />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
