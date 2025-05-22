import { SearchBook } from "@/types";
import SearchSuggestion from "./SearchSuggestion";
import { ScrollArea } from "@radix-ui/themes";
import { Spinner } from "@radix-ui/themes";

interface SearchContainerProps {
  books: SearchBook[];
  loading: boolean;
}

export default function SearchContainer({
  books,
  loading,
}: SearchContainerProps) {
  if (!books) {
    return null;
  }
  return (
    <div className="z-50 absolute bg-white shadow-lg rounded-3xl left-1/2 -translate-x-1/2 mt-2 w-3/4 lg:w-2/5 p-5">
      {loading ? (
        <div className="w-full flex justify-center">
          <Spinner size="3" />
        </div>
      ) : (
        <ScrollArea className="max-h-[50vh]">
          {books.length ? (
            books
              .slice(0, 10)
              .map((book: SearchBook) => (
                <SearchSuggestion key={book.key} book={book} />
              ))
          ) : (
            <h1 className="font-thin flex justify-center">search for books</h1>
          )}
        </ScrollArea>
      )}
    </div>
  );
}
