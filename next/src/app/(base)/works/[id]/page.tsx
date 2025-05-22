"use client";
import type { Work, Edition } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import WorkDetail from "@/components/workpage/WorkDetail";

export default function Page() {
  const params = useParams();
  const bookId = params.id;
  const apiEndpoint = process.env.NEXT_PUBLIC_BOOK_SEARCH_BASE;
  const [work, setWork] = useState<Work | null>(null);
  const [editions, setEditions] = useState<Edition[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // getting the work on reload
  useEffect(() => {
    const getWork = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${apiEndpoint}/works/${bookId}.json`);
        const data: Work = await response.json();
        console.log(data);
        setWork(data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    getWork();
  }, [bookId, apiEndpoint]);

  return (
    <div className="container mx-auto py-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-64">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin mb-4"></div>
          <p className="text-gray-600">Loading book details...</p>
        </div>
      ) : work ? (
        <WorkDetail work={work} />
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No book information found</p>
        </div>
      )}
    </div>
  );
}
