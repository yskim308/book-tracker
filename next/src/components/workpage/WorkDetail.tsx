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
      <div className="flex-col items-center px-4 ring-4 ring-blue-50 py-2 rounded-lg">
        <Covers keys={work.covers} />
        <ScrollArea className="h-[300px] md:h-[450px] mt-5">
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
      <div>
        <h1>hello world</h1>
      </div>
    </div>
  );
}
