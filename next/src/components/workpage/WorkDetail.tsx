import type { Work } from "@/types";
import Author from "./Author";
import Covers from "./Covers";
import Subjects from "./Subjects";
import Description from "./Description";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WorkDetailProps {
  work: Work;
}

export default function WorkDetail({ work }: WorkDetailProps) {
  return (
    //todo fix scroll area
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="flex justify-center px-4">
        <Covers keys={work.covers} />
      </div>
      <ScrollArea className="h-72">
        <div className="flex flex-col space-y-3 px-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {work.title}
            </h1>
            <div className="mt-1">
              <h2 className="text-lg font-medium text-slate-700">Authors</h2>
              <Author authors={work.authors} />
            </div>
          </div>

          <Description description={work.description} />

          {work.subjects && work.subjects.length > 0 && (
            <Subjects subjects={work.subjects} />
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
