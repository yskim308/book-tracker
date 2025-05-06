import { SearchBook } from "@/types";
import SearchSuggestion from "./SearchSuggestion";

interface SearchContainerProps {
  books: SearchBook[];
}

export default function SearchContainer({ books }: SearchContainerProps) {
  if (!books) {
    return null;
  }
  return (
    <div className="z-50 absolute bg-white border border-black rounded-3xl p-3 left-1/2 -translate-x-1/2 mt-2">
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
