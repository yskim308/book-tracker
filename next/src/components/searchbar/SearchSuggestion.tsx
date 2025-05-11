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

  const coverBase = process.env.NEXT_PUBLIC_BOOK_COVER_BASE;
  if (!coverBase) {
    throw new Error("book cover link env variable not found");
  }

  let bookSrc = book.cover_edition_key
    ? `${coverBase}/b/olid/${book.cover_edition_key}-M.jpg`
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
    <Link href={`${book.key}`}>
      <div className="flex w-full p-1 hover:bg-gray-100 rounded-2xl">
        <div className="min-w-16 h-28 mr-2 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner />
            </div>
          )}
          <Image
            src={imageError ? "/images/questionMark.svg" : bookSrc}
            alt={book.title || "Book cover"}
            width={180}
            height={266}
            className={`w-16 h-28 object-cover ${loading ? "opacity-0" : "opacity-100"}`}
            onLoad={() => setLoading(false)}
            onError={() => {
              setImageError(true);
              setLoading(false);
            }}
          />
        </div>
        <div className="flex-grow">
          <h1 className="font-bold text-sm md:text-lg w-full">{book.title}</h1>
          <h1 className="font-light text-sm md:text-lg w-full">
            {authorString}
          </h1>
          <h1 className="font-thin text-xs md:text-xs">
            published: {book.first_publish_year}
          </h1>
        </div>
      </div>
    </Link>
  );
}
