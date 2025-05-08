import { SearchBook } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface SearchSuggestionProps {
  book: SearchBook;
}

export default function SearchSuggestion({ book }: SearchSuggestionProps) {
  const bookSrc = `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-S.jpg`;
  let authorString: string;
  if (!book.author_name) {
    authorString = "";
  } else if (book.author_name.length > 1) {
    authorString = `${book.author_name[0]} + ${book.author_name.length - 1} more`;
  } else {
    authorString = book.author_name[0];
  }
  return (
    <Link href={`/books/${book.key}`}>
      <div className="flex w-full my-2">
        <div className="w-16">
          <Image
            src={bookSrc ? bookSrc : "/images/questionMark.svg"}
            alt="no image"
            width={100}
            height={100}
            className="w-full h-auto"
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
