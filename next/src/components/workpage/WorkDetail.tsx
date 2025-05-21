import type { Work } from "@/types";
import Author from "./Author";
import Covers from "./Covers";
import Subjects from "./Subjects";

interface WorkDetailProps {
  work: Work;
}

export default function WorkDetail({ work }: WorkDetailProps) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="flex justify-center px-4">
        <Covers keys={work.covers} />
      </div>
      <div className="flex flex-col space-y-6 px-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {work.title}
          </h1>
          <div className="mt-4">
            <h2 className="text-lg font-medium text-slate-700">Authors</h2>
            <Author authors={work.authors} />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-slate-700">Description</h2>
          <div className="mt-2 prose prose-slate max-w-none">
            {typeof work.description === "string" ? (
              <p>{work.description}</p>
            ) : (
              <p className="text-slate-500 italic">No description available</p>
            )}
          </div>
        </div>

        {work.subjects && work.subjects.length > 0 && (
          <Subjects subjects={work.subjects} />
        )}
      </div>
    </div>
  );
}
