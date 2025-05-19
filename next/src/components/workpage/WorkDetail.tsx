import type { Work } from "@/types";
import Author from "./Author";

interface WorkDetailProps {
  work: Work;
}

export default function WorkDetail({ work }: WorkDetailProps) {
  return (
    <div>
      <h1>authors:</h1>
      <Author authors={work.authors} />
    </div>
  );
}
