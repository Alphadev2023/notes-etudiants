import type { ComponentType } from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ComponentType<{ size?: number; className?: string }>;
  variant?: "primary" | "success" | "warning" | "danger";
}

const VARIANT_CLASSES: Record<NonNullable<StatCardProps["variant"]>, string> = {
  primary: "bg-primary-50 text-primary-600",
  success: "bg-success-50 text-success-600",
  warning: "bg-warning-50 text-warning-600",
  danger: "bg-danger-50 text-danger-600",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  variant = "primary",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${VARIANT_CLASSES[variant]}`}
      >
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-neutral-800">{value}</p>
        <p className="text-sm text-neutral-500">{label}</p>
      </div>
    </div>
  );
}
