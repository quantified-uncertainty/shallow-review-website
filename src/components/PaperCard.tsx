import { Paper } from "@/lib/types";

interface PaperCardProps {
  paper: Paper;
}

export default function PaperCard({ paper }: PaperCardProps) {
  return (
    <div className="py-1">
      <a
        href={paper.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 hover:underline"
      >
        {paper.title}
      </a>
      {paper.authors && (
        <span className="text-gray-500 text-sm ml-2">— {paper.authors}</span>
      )}
    </div>
  );
}
