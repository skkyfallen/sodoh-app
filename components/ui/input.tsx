import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "min-h-12 w-full rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 text-[15px] text-[var(--ink)] transition-colors duration-200 placeholder:text-[var(--muted)] hover:border-[var(--brand)]/50 focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-[var(--danger)]",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
