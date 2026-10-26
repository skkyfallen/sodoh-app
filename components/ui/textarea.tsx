import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-28 w-full resize-y rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[15px] leading-6 text-[var(--ink)] transition-colors duration-200 placeholder:text-[var(--muted)] hover:border-[var(--brand)]/50 focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-[var(--danger)]",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
