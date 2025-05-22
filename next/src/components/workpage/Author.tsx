import type { Author } from "@/types";
import { useState, useEffect } from "react";

interface AuthorProps {
  authors: {
    author: {
      key: string;
    };
  }[];
}

export default function Author({ authors }: AuthorProps) {
  const [componentAuthors, setComponentAuthors] = useState<Author[] | null>(
    null,
  );

  const apiEndpoint = process.env.NEXT_PUBLIC_BOOK_SEARCH_BASE;

  // getting tue author info when work changes
  useEffect(() => {
    const getAuthor = async () => {
      try {
        const promises = authors.map(async (authorObject) => {
          const response = await fetch(
            `${apiEndpoint}${authorObject.author.key}.json`,
          );
          return await response.json();
        });

        const fetchedData: Author[] = await Promise.all(promises);
        setComponentAuthors(fetchedData);
      } catch (e) {
        console.log(e);
      }
    };
    getAuthor();
  }, []);

  return (
    <div className="flex">
      {componentAuthors?.map((person: Author) => {
        return (
          <h1
            key={person.key}
            className="px-2 mx-1 py-1 bg-blue-100 text-slate-800 rounded-md font-md"
          >
            {person.name}
          </h1>
        );
      })}
    </div>
  );
}
