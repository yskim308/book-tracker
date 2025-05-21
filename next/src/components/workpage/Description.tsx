"use client";

import { useState, useRef, useEffect } from "react";

interface DescriptionProps {
  description: string | { value: string } | undefined;
}

export default function Description({ description }: DescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Parse the description to handle different formats
  const descriptionText =
    typeof description === "string"
      ? description
      : description && typeof description === "object" && "value" in description
        ? description.value
        : null;

  // Check if content overflows the container
  useEffect(() => {
    if (contentRef.current) {
      setHasOverflow(
        contentRef.current.scrollHeight > contentRef.current.clientHeight,
      );
    }
  }, [description]);

  if (!descriptionText) {
    return (
      <div>
        <h2 className="text-lg font-medium text-slate-700">Description</h2>
        <p className="text-slate-500 italic">No description available</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-slate-700">Description</h2>
      <div className="relative">
        <div
          ref={contentRef}
          className={`prose prose-slate max-w-none overflow-hidden transition-all duration-300 ${
            expanded ? "" : "max-h-[150px]"
          }`}
        >
          <p>{descriptionText}</p>
        </div>

        {hasOverflow && !expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
        )}

        {hasOverflow && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </div>
  );
}
