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
    typeof description === "string" // Check if it's directly a string
      ? description
      : typeof description === "object" && // Check if it's an object AND not null
          description !== null &&
          "value" in description && // Check if the object has a 'value' property
          typeof description.value === "string" // Ensure the 'value' property is a string
        ? description.value // If all true, use the value from the object
        : null; // Otherwise, default to null

  // Check if content overflows the container
  useEffect(() => {
    if (contentRef.current) {
      setHasOverflow(
        contentRef.current.scrollHeight > contentRef.current.clientHeight,
      );
    }
  }, [description]);

  //todo: fix the button for show more
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
            expanded ? "" : "max-h-[80px] md:max-h-[150px]"
          }`}
        >
          <p>{descriptionText}</p>
        </div>
        {hasOverflow && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-medium text-slate-700 hover:underline transition-colors"
          >
            {expanded ? "...show less" : "...show more"}
          </button>
        )}
      </div>
    </div>
  );
}
