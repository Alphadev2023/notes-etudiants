import { forwardRef, type InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...rest }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
            error ? "border-danger-400" : "border-neutral-300",
            className,
          )}
          {...rest}
        />
        {error && <p className="text-danger-600 text-xs mt-1">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
