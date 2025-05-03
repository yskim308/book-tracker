"use client";
import { SearchBook } from "@/types";
import { useEffect, useState } from "react";
import SearchContainer from "./SearchContainer";

export default function BookSearchbar() {
  const [value, setValue] = useState<string>("");
  const [debounceValue, setDebounceValue] = useState<string>("");
  const [books, setBooks] = useState<SearchBook[]>([]);

  // set the debounce value on delay, on change of value;
  const debounceDelay = 300;
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  // search the books api endpoint when the debounce value changes
  const booksApiEndpoint: string | undefined =
    process.env.NEXT_PUBLIC_BOOKS_API_ENDPOINT;
  if (!booksApiEndpoint) {
    throw new Error("api endpoint not defined in env variables");
  }

  const apiKey: string | undefined = process.env.NEXT_PUBLIC_BOOKS_API_KEY;
  if (!apiKey) {
    throw new Error("api key not defined");
  }

  useEffect(() => {
    const search = async () => {
      try {
        let searchQuery = debounceValue.split(" ").join("+");
        if (!searchQuery) {
          setBooks([]);
          return;
        }
        const response = await fetch(
          `${booksApiEndpoint}/?q=${searchQuery}&key=${apiKey}`,
        );
        const data = await response.json(); // toodo: set types for the data receieved
        const books: SearchBook[] = data.items;
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
    <div className="mx-auto">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="search for books"
          value={value}
          onChange={handleChange}
        />
      </form>
      <SearchContainer books={books} />
    </div>
  );
}
