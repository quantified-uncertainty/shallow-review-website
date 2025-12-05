import Link from "next/link";
import { Route } from "lucide-react";

interface AgendaLinkProps {
  sectionId: string;
  agendaId: string;
  name: string;
  className?: string;
}

export default function AgendaLink({
  sectionId,
  agendaId,
  name,
  className = "inline-flex items-center gap-1.5 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors",
}: AgendaLinkProps) {
  return (
    <Link
      href={`/${sectionId}/${agendaId}`}
      className={className}
    >
      <Route className="w-3.5 h-3.5" />
      {name}
    </Link>
  );
}
