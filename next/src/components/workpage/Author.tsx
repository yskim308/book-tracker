import type { Author } from "@/types";
import { useState, useEffect } from "react";

interface AuthorProps {
  authors: Author[] | null;
}

export default function AuthorComponent({ authors }: AuthorProps) {
  return (
    <div className="flex">
      {authors?.map((person: Author) => {
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
