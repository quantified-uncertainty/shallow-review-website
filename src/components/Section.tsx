import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface SectionProps {
  id: string;
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  card?: boolean;
}

export default function Section({ id, title, icon: Icon, children, className = "", card = false }: SectionProps) {
  return (
    <section id={id} className={`scroll-mt-20 ${className}`}>
      <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-4">
        {Icon && <Icon className="w-5 h-5 text-blue-600" />}
        {title}
      </h2>
      {card ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
