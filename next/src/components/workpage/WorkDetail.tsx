import type { Work } from "@/types";
import Author from "./Author";
import Covers from "./Covers";

interface WorkDetailProps {
  work: Work;
}

export default function WorkDetail({ work }: WorkDetailProps) {
  console.log(work);
  return (
    <div>
      <h1>authors:</h1>
      <Author authors={work.authors} />
      <h1>Covers:</h1>
      <Covers keys={work.covers} />
      <h1>{work.description}</h1>
    </div>
  );
}
