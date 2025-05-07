import { SearchBook } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface SearchSuggestionProps {
  book: SearchBook;
}

export default function SearchSuggestion({ book }: SearchSuggestionProps) {
  let bookSrc: string;
  if (!book.volumeInfo.imageLinks) {
    bookSrc = "";
  } else {
    bookSrc = book.volumeInfo.imageLinks.thumbnail;
  }
  let authorString: string;
  if (!book.volumeInfo.authors) {
    authorString = "";
  } else if (book.volumeInfo.authors.length > 1) {
    authorString = `${book.volumeInfo.authors[0]} + ${book.volumeInfo.authors.length - 1} more`;
  } else {
    authorString = book.volumeInfo.authors[0];
  }
  return (
    <Link href={`/books/${book.id}`}>
      <div className="flex w-full my-2">
        <div className="w-16">
          <Image
            src={bookSrc ? bookSrc : "/images/questionMark.svg"}
            alt="no image"
            width={100}
            height={100}
            className=" w-full"
          />
        </div>
        <div>
          <h1 className="font-bold text-sm lg:text-base">
            {book.volumeInfo.title}
          </h1>
          <h1 className="font-light text-sm lg:text-base">{authorString}</h1>
        </div>
      </div>
    </Link>
  );
}
