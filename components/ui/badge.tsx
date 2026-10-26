import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex min-h-6 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold leading-5 transition-colors",
  {
    variants: {
      variant: {
        brand: "border-[var(--border)] bg-[var(--brand-soft)] text-[var(--brand)]",
        dark: "border-white/25 bg-white/10 text-white",
        mint: "border-[#a7f3d0]/40 bg-[#a7f3d0]/15 text-[#a7f3d0]",
        neutral: "border-[var(--admin-border)] bg-[var(--admin-page)] text-[var(--admin-muted)]",
        success: "border-[#bfe6cd] bg-[#e4f0da] text-[#145c34]",
        info: "border-[#c4d9ec] bg-[#e8eff6] text-[#244d6d]",
        warning: "border-[#f0dfb8] bg-[#faf3e0] text-[#7a5a12]",
        danger: "border-[#f3c1c1] bg-[#fdecec] text-[#a12323]",
      },
    },
    defaultVariants: { variant: "brand" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
