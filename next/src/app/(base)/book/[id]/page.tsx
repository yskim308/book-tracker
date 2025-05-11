"use client";
import type { SearchBook } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const bookId = params.id;

  const apiEndpoint = process.env.NEXT_PUBLIC_BOOKS_API_ENDPOINT;

  const [book, setBook] = useState<SearchBook | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/${bookId}`);
        const data = await response.json();
        console.log(data.volumeInfo);
        setBook(data);
      } catch (e) {
        console.log(e);
      }
    };

    getData();
  }, []);

  return (
    <div>
      <h1>from book page:</h1>
      <h1>title: {book?.volumeInfo.title}</h1>
    </div>
  );
}
