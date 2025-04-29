import { SearchBook } from "@/types";
import SearchSuggestion from "./SearchSuggestion";

interface SearchContainerProps {
  books: SearchBook[];
}

export default function SearchContainer({ books }: SearchContainerProps) {
  return (
    <div className="absolute">
      {books.length ? (
        books.map((book: SearchBook) => (
          <SearchSuggestion key={book.id} book={book} />
        ))
      ) : (
        <h1>empty</h1>
      )}
    </div>
  );
}
