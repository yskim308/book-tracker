"use client";
import type { Work, Author, Edition } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const bookId = params.id;

  const apiEndpoint = process.env.NEXT_PUBLIC_BOOK_SEARCH_BASE;
  const [work, setWork] = useState<Work | null>(null);
  const [authors, setAuthors] = useState<Author[] | null>(null);
  const [editions, setEditions] = useState<Edition[] | null>(null);

  // getting the work on reload
  useEffect(() => {
    const getWork = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/works/${bookId}.json`);
        const data: Work = await response.json();
        setWork(data);
      } catch (e) {
        console.log(e);
      }
    };

    getWork();
  }, []);

  // getting tue author info when work changes
  useEffect(() => {
    const getAuthor = async () => {
      try {
        const promises = work.authors.map(async (authorObject) => {
          const response = await fetch(
            `${apiEndpoint}${authorObject.author.key}.json`,
          );
          return await response.json();
        });

        const fetchedData: Author[] = await Promise.all(promises);
        setAuthors(fetchedData);
      } catch (e) {
        console.log(e);
      }
    };

    if (work && work.authors) {
      getAuthor();
    }
  }, [work]);

  return (
    <div>
      <h1>from book page:</h1>
      <h1>{work?.title}</h1>
      <h1>{work?.authors[0].author.key}</h1>
    </div>
  );
}
