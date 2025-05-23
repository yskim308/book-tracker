"use client";

import type { Edition, Work } from "@/types";
import { useEffect, useState } from "react";
import { EditionCard } from "./edition-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface EditionsContainerProps {
  work: Work;
}

interface EditionsResponse {
  entries: Edition[];
}

export default function EditionsContainer({ work }: EditionsContainerProps) {
  const [editions, setEditions] = useState<Edition[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookBase = process.env.NEXT_PUBLIC_BOOK_SEARCH_BASE;
  if (!bookBase) {
    throw new Error("Environment variable for book search base not set");
  }

  useEffect(() => {
    const getEditions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${bookBase}${work.key}/editions.json`);

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data: EditionsResponse = await response.json();
        setEditions(data.entries);
      } catch (e) {
        console.error("Error fetching editions:", e);
        setError(e instanceof Error ? e.message : "Failed to fetch editions");
      } finally {
        setLoading(false);
      }
    };

    getEditions();
  }, [work, bookBase]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Editions
        </h2>
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full h-[250px]">
            <Skeleton className="h-full w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load editions: {error}</AlertDescription>
      </Alert>
    );
  }

  if (!editions || editions.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No editions found</AlertTitle>
        <AlertDescription>
          No editions were found for this work.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <BookOpen className="h-5 w-5" />
        Editions ({editions.length})
      </h2>
      <div>
        {editions.map((edition, index) => (
          <EditionCard key={`${edition.key || index}`} edition={edition} />
        ))}
      </div>
    </div>
  );
}
