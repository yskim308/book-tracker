import { SearchBook } from "@/types";

interface SearchSuggestionProps {
  book: SearchBook;
}

export default function SearchSuggestion({ book }: SearchSuggestionProps) {
  return (
    <div>
      <h1 className="font-bold">title: {book.volumeInfo.title}</h1>
      <h1>author: {book.volumeInfo.authors}</h1>
    </div>
  );
}
