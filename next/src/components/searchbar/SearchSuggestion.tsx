import { SearchBook } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface SearchSuggestionProps {
  book: SearchBook;
}

export default function SearchSuggestion({ book }: SearchSuggestionProps) {
  return (
    <Link href={`/books/${book.id}`}>
      <div className="flex">
        <div>
          <Image
            src={book.volumeInfo.imageLinks.thumbnail}
            alt="image"
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
