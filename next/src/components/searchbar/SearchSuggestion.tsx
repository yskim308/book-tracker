import { SearchBook } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface SearchSuggestionProps {
  book: SearchBook;
}

export default function SearchSuggestion({ book }: SearchSuggestionProps) {
  let bookSrc = book.volumeInfo.imageLinks.thumbnail;
  return (
    <Link href={`/books/${book.id}`}>
      <div className="flex">
        <div>
          <Image
            src={bookSrc ? bookSrc : "images/questionMark.svg"}
            alt="images/questionMark.svg"
            width={30}
            height={50}
          />
        </div>
        <div></div>
        <h1 className="font-bold">title: {book.volumeInfo.title}</h1>
        <h1>author: {book.volumeInfo.authors}</h1>
      </div>
    </Link>
  );
}
