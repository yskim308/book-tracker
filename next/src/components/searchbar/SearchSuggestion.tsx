import { SearchBook } from "@/types";
import { useState } from "react";
import { Spinner } from "@radix-ui/themes";
import Link from "next/link";
import Image from "next/image";

interface SearchSuggestionProps {
  book: SearchBook;
}

export default function SearchSuggestion({ book }: SearchSuggestionProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState<boolean>(false);

  let bookSrc = book.cover_edition_key
    ? `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`
    : "/images/questionMark.svg";

  let authorString: string;
  // setting author names
  if (!book.author_name) {
    authorString = "";
  } else if (book.author_name.length > 1) {
    authorString = `${book.author_name[0]} + ${book.author_name.length - 1} more`;
  } else {
    authorString = book.author_name[0];
  }

  return (
    <Link href={`/books/${book.key}`}>
      <div className="flex w-full my-1">
        <div className="w-16 h-32 mx-2 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner />
            </div>
          )}
          <Image
            src={imageError ? "/images/questionMark.svg" : bookSrc}
            alt={book.title || "Book cover"}
            width={100}
            height={100}
            className={`w-full h-auto ${loading ? "opacity-0" : "opacity-100"}`}
            onLoad={() => setLoading(false)}
            onError={() => {
              setImageError(true);
              setLoading(false);
            }}
          />
        </div>
        <div>
          <h1 className="font-bold text-sm lg:text-base">{book.title}</h1>
          <h1 className="font-light text-sm lg:text-base">{authorString}</h1>
        </div>
      </div>
    </Link>
  );
}
