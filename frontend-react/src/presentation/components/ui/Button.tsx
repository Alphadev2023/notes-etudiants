import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "success" | "warning" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-700",
  success: "bg-success-600 text-white hover:bg-success-700",
  warning: "bg-warning-500 text-white hover:bg-warning-600",
  danger: "bg-danger-600 text-white hover:bg-danger-700",
  ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100",
};

export function Button({
  variant = "primary",
  isLoading = false,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={clsx(
        "px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...rest}
    >
      {isLoading ? "Chargement..." : children}
    </button>
  );
}
