import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  /** Display height in px; width scales from the source aspect ratio. */
  size?: number;
  /** Dark tile suits light surfaces; bare mark suits dark surfaces. */
  variant?: "tile" | "bare";
  className?: string;
  priority?: boolean;
};

/**
 * Official Sodoh emblem (server component, no client JS).
 * Decorative: keep the link's accessible name on the parent anchor.
 */
export function BrandMark({ size = 40, variant = "tile", className, priority = false }: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden",
        variant === "tile" && "rounded-[12px] bg-[#0c2418] shadow-sm ring-1 ring-black/10",
        className
      )}
      style={
        variant === "tile"
          ? { width: size, height: size, padding: Math.max(4, Math.round(size * 0.1)) }
          : { width: Math.round(size * 1.59), height: size }
      }
    >
      <Image
        src="/brand/sodoh-mark.png"
        alt=""
        width={256}
        height={161}
        priority={priority}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
