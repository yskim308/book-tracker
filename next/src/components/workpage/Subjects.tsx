"use client";

import { useState } from "react";

interface SubjectsProps {
  subjects: string[];
}

export default function Subjects({ subjects }: SubjectsProps) {
  const [showAll, setShowAll] = useState<boolean>(false);

  if (!subjects || subjects.length === 0) {
    return null;
  }

  const displaySubjects = showAll ? subjects : subjects.slice(0, 5);
  const hasMore: boolean = subjects.length > 5;

  return (
    <div>
      <h2 className="text-lg font-medium text-slate-700">Subjects</h2>
      <div className="mt-2 flex flex-wrap gap-2">
        {displaySubjects.map((subject, index) => (
          <span
            key={index}
            className="inline-flex items-center rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-slate-800"
          >
            {subject}
          </span>
        ))}
        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-1 text-sm font-medium hover:underline"
          >
            {showAll ? "show less" : `...${subjects.length - 5} more`}
          </button>
        )}
      </div>
    </div>
  );
}
