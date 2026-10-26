import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      aria-busy="true"
      className="flex min-h-[60vh] flex-1 flex-col bg-[var(--page)] px-5 py-16 sm:px-8 md:px-12 md:py-20 lg:px-16"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
        <Skeleton className="h-12 w-3/4 max-w-xl sm:h-20" />
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Skeleton className="h-5 w-full max-w-2xl" />
          <Skeleton className="h-12 w-40 shrink-0" />
        </div>
        <Skeleton className="mt-10 min-h-[280px] flex-1 rounded-[24px_72px_24px_24px] sm:min-h-[380px]" />
      </div>
    </div>
  );
}
