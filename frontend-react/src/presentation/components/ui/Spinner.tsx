interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function Spinner({ size = "md" }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center py-8">
      <div
        className={`animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600 ${SIZE_CLASSES[size]}`}
      />
    </div>
  );
}
