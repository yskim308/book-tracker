import { SearchBook } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface SearchSuggestionProps {
  book: SearchBook;
}

export default function SearchSuggestion({ book }: SearchSuggestionProps) {
  let bookSrc = book.volumeInfo.imageLinks.thumbnail;
  let authorString: string;
  if (book.volumeInfo.authors.length > 1) {
    authorString = `${book.volumeInfo.authors[0]} + ${book.volumeInfo.authors.length - 1} more`;
  } else {
    authorString = book.volumeInfo.authors[0];
  }
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
        <div>
          <h1 className="font-bold">{book.volumeInfo.title}</h1>
          <h1 className="font-light">{authorString}</h1>
        </div>
      </div>
    </Link>
  );
}
