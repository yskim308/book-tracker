import { SearchBook } from "@/types";
import SearchSuggestion from "./SearchSuggestion";

interface SearchContainerProps {
  books: SearchBook[];
}

export default function SearchContainer({ books }: SearchContainerProps) {
  return (
    <div className="absolute">
      {books
        ? books.map((book: SearchBook) => (
            <SearchSuggestion key={book.id} book={book} />
          ))
        : null}
    </div>
  );
}
