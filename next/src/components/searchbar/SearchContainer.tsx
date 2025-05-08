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
    <div className="z-50 absolute bg-white border border-black rounded-3xl left-1/2 -translate-x-1/2 mt-2 w-10/12 lg:w-1/2 p-5">
      {books.length ? (
        books
          .slice(0, 10)
          .map((book: SearchBook) => (
            <SearchSuggestion key={book.key} book={book} />
          ))
      ) : (
        <h1>empty</h1>
      )}
    </div>
  );
}
