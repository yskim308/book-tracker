import type { Work } from "@/types";
import Author from "./Author";
import Covers from "./Covers";

interface WorkDetailProps {
  work: Work;
}

export default function WorkDetail({ work }: WorkDetailProps) {
  console.log(work);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="flex justify-center mx-15">
        <Covers keys={work.covers} />
      </div>
      <div>
        <h1>authors:</h1>
        <Author authors={work.authors} />
        <h1>Covers:</h1>
      </div>
    </div>
  );
}
