"use client";
import { SearchBook } from "@/types";
import { useEffect, useState } from "react";
import SearchContainer from "./SearchContainer";
import Image from "next/image";

export default function BookSearchbar() {
  const [value, setValue] = useState<string>("");
  const [debounceValue, setDebounceValue] = useState<string>("");
  const [books, setBooks] = useState<SearchBook[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // set the debounce value on delay, on change of value;
  const debounceDelay = 200;
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  // search the books api endpoint when the debounce value changes

  const searchBase = process.env.NEXT_PUBLIC_BOOK_SEARCH_BASE;
  if (!searchBase) {
    throw new Error("environment variable for search not found");
  }

  useEffect(() => {
    const search = async () => {
      try {
        let searchQuery = debounceValue.split(" ").join("+");
        if (!searchQuery) {
          setBooks([]);
          return;
        }
        setLoading(true);
        console.log("searching now??");
        const url = `${searchBase}/search.json?q=${searchQuery}`;
        const response = await fetch(url);
        const data = await response.json(); // toodo: set types for the data receieved
        const books: SearchBook[] = data.docs;
        setLoading(false);
        console.log("searching done");
        setBooks(books);
      } catch (e: unknown) {
        console.log(e);
      }
    };

    search();
  }, [debounceValue]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValue("");
  };
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full flex justify-center"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <div className="relative w-3/4 lg:w-2/5">
          <input
            type="text"
            placeholder="search for books"
            value={value}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus: ring-indigo-500 text-gray-700 placeholder-gray-400 bg-gray-100 w-full"
          />
          <div className="absolute top-0 right-0 bottom-0 flex items-center p-2 pointer-events-none">
            <Image
              src="/images/searchIcon.svg"
              className="h-7 w-7"
              width={20}
              height={20}
              alt="search"
            />
          </div>
        </div>
      </form>
      {open && (
        <div
          onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
          onClick={() => setOpen(false)}
        >
          <SearchContainer books={books} loading={loading} />
        </div>
      )}
    </div>
  );
}
