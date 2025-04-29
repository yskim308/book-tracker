import { SearchBook } from "@/types";
import Link from "next/link";

interface SearchSuggestionProps {
  book: SearchBook;
}

export default function SearchSuggestion({ book }: SearchSuggestionProps) {
  return (
    <div>
      <Link href={`/books/${book.id}`}>
        <h1 className="font-bold">title: {book.volumeInfo.title}</h1>
        <h1>author: {book.volumeInfo.authors}</h1>
      </Link>
    </div>
  );
}
