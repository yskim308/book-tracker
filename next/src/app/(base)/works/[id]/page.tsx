"use client";
import type { Work, Author, Edition } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import WorkDetail from "@/components/workpage/WorkDetail";

export default function Page() {
  const params = useParams();
  const bookId = params.id;

  const apiEndpoint = process.env.NEXT_PUBLIC_BOOK_SEARCH_BASE;
  const [work, setWork] = useState<Work | null>(null);
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

  return (
    <div>
      <h1>from book page:</h1>
      <h1>{work?.title}</h1>
      <h1>work detail component</h1>
      {work && <WorkDetail work={work} />}
    </div>
  );
}
