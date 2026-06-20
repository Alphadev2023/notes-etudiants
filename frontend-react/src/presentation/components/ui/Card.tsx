import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-white rounded-xl shadow-sm border border-neutral-200 p-5",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
