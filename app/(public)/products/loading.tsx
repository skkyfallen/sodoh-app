function Shimmer({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
  );
}

export default function ProductsLoading() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-white px-6 pt-20 pb-24 md:px-20 md:pt-28 md:pb-32">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1 flex flex-col items-start gap-5">
            <Shimmer className="h-4 w-36" />
            <Shimmer className="h-14 w-full max-w-xl" />
            <Shimmer className="h-6 w-3/4 max-w-lg" />
            <Shimmer className="h-6 w-2/3 max-w-md" />
            <Shimmer className="mt-4 h-12 w-44 !rounded-full" />
          </div>
          {/* Stats cards */}
          <div className="mt-16 lg:mt-0 grid grid-cols-1 gap-5 w-full lg:w-[340px] shrink-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-5 rounded-2xl border border-slate-100 bg-white px-6 py-5">
                <Shimmer className="h-8 w-14" />
                <Shimmer className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products grid ── */}
      <section className="px-6 md:px-20 py-16">
        <div className="mb-12 flex flex-col gap-4">
          <Shimmer className="h-10 w-64" />
          <Shimmer className="h-1 w-20 !rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col gap-4 p-6 rounded-2xl border border-slate-100 bg-white">
              <Shimmer className="size-12 !rounded-xl" />
              <Shimmer className="w-full aspect-video !rounded-xl" />
              <Shimmer className="h-6 w-40" />
              <Shimmer className="h-3 w-28" />
              <Shimmer className="h-4 w-full" />
              <Shimmer className="h-4 w-4/5" />
              <Shimmer className="h-9 w-full !rounded-xl" />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="mx-6 md:mx-20 mb-16 rounded-2xl bg-slate-100 py-16 px-8 md:px-16">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-5">
          <Shimmer className="h-12 w-80" />
          <Shimmer className="h-5 w-96 max-w-full" />
          <Shimmer className="h-14 w-52 !rounded-full" />
        </div>
      </section>
    </>
  );
}
