import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[14px] px-5 text-sm font-semibold transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page)] active:translate-y-px [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--brand)] text-white shadow-[0_6px_16px_rgba(1,105,54,0.18)] hover:-translate-y-px hover:bg-[var(--brand-hover)] hover:shadow-[0_10px_24px_rgba(1,105,54,0.22)] dark:text-[#062a17]",
        dark: "bg-[#0d2b1c] text-white hover:-translate-y-px hover:bg-[#123722]",
        mint: "bg-[#a7f3d0] text-[#064e3b] hover:-translate-y-px hover:bg-white",
        outline:
          "border border-[var(--border)] bg-transparent text-[var(--ink)] hover:-translate-y-px hover:border-[var(--brand)] hover:bg-[var(--surface-soft)]",
        brandOutline:
          "border border-[var(--brand)] bg-transparent text-[var(--brand)] hover:-translate-y-px hover:bg-[var(--brand)] hover:text-white dark:hover:text-[#062a17]",
        ghost: "text-[var(--body)] hover:bg-[var(--surface-soft)] hover:text-[var(--ink)]",
        subtle:
          "bg-[var(--brand-soft)] text-[var(--brand)] hover:-translate-y-px hover:bg-[#d3f2e1]",
      },
      size: {
        sm: "min-h-9 px-4 text-[13px]",
        md: "min-h-11 px-5 text-sm",
        lg: "min-h-12 px-7 text-sm",
        icon: "size-11 rounded-[14px] p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
