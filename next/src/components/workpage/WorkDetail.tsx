import type { Work, Author } from "@/types";
import AuthorComponent from "./Author";
import Covers from "./Covers";
import Subjects from "./Subjects";
import Description from "./Description";
import { ScrollArea } from "@/components/ui/scroll-area";
import EditionsContainer from "../edition/EditionsContainer";
import AddBookButton from "./AddBookButton";
import { useState, useEffect } from "react";

interface WorkDetailProps {
  work: Work;
}

export default function WorkDetail({ work }: WorkDetailProps) {
  const [componentAuthors, setComponentAuthors] = useState<Author[] | null>(
    null,
  );

  const apiEndpoint = process.env.NEXT_PUBLIC_BOOK_SEARCH_BASE;

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
        setComponentAuthors(fetchedData);
      } catch (e) {
        console.log(e);
      }
    };
    getAuthor();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="flex-col items-center px-4 ring-4 ring-blue-50 py-2 rounded-lg">
        <Covers keys={work.covers} />
        <ScrollArea className="h-[300px] md:h-[500px] mt-5">
          <div className="flex flex-col space-y-3 px-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {work.title}
                <AddBookButton />
              </h1>
              <div className="mt-1">
                <h2 className="text-lg font-medium text-slate-700">Authors</h2>
                <AuthorComponent authors={componentAuthors} />
              </div>
            </div>

            <Description description={work.description} />

            {work.subjects && work.subjects.length > 0 && (
              <Subjects subjects={work.subjects} />
            )}
          </div>
        </ScrollArea>
      </div>
      <div>
        <EditionsContainer work={work} />
      </div>
    </div>
  );
}
