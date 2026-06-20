import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface QuickAccessLinkProps {
  label: string;
  to: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

export function QuickAccessLink({
  label,
  to,
  icon: Icon,
}: QuickAccessLinkProps) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between px-4 py-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
          <Icon size={18} className="text-neutral-500" />
        </div>
        <span className="text-sm font-medium text-neutral-700">{label}</span>
      </div>
      <ChevronRight size={18} className="text-neutral-400" />
    </Link>
  );
}
