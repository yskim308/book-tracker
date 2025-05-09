import { SearchBook } from "@/types";
import SearchSuggestion from "./SearchSuggestion";
import { ScrollArea } from "@radix-ui/themes";

interface SearchContainerProps {
  books: SearchBook[];
}

export default function SearchContainer({ books }: SearchContainerProps) {
  if (!books) {
    return null;
  }
  return (
    <div className="z-50 absolute bg-white shadow-lg rounded-3xl left-1/2 -translate-x-1/2 mt-2 w-3/4 lg:w-2/5 p-5">
      <ScrollArea className="max-h-1/4">
        {books.length ? (
          books
            .slice(0, 10)
            .map((book: SearchBook) => (
              <SearchSuggestion key={book.key} book={book} />
            ))
        ) : (
          <h1>empty</h1>
        )}
      </ScrollArea>
    </div>
  );
}
