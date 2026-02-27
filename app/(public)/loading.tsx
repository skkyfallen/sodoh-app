function Shimmer({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
  );
}

export default function HomeLoading() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-white px-6 pt-20 pb-24 md:px-20 md:pt-28 md:pb-32">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1 flex flex-col items-start gap-5">
            <Shimmer className="h-4 w-40" />
            <Shimmer className="h-14 w-full max-w-2xl" />
            <Shimmer className="h-6 w-3/4 max-w-lg" />
            <Shimmer className="h-6 w-2/3 max-w-md" />
            <div className="flex gap-4 mt-4">
              <Shimmer className="h-12 w-44 !rounded-full" />
              <Shimmer className="h-12 w-36 !rounded-full" />
            </div>
          </div>
          {/* StatsStack */}
          <div className="mt-16 lg:mt-0 shrink-0 w-full lg:w-[340px] flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-slate-100 bg-white px-6 py-5 flex items-center gap-5">
                <Shimmer className="h-10 w-16" />
                <div className="flex flex-col gap-2 flex-1">
                  <Shimmer className="h-4 w-28" />
                  <Shimmer className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Pillars ── */}
      <section className="px-6 py-20 md:px-20 bg-white">
        <div className="flex flex-col items-center gap-4 mb-20">
          <Shimmer className="h-12 w-72" />
          <Shimmer className="h-1 w-16 !rounded-full" />
        </div>
        <div className="relative flex flex-col gap-8 max-w-3xl mx-auto">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex items-start gap-6 ${["ml-0", "ml-0 md:ml-10", "ml-0 md:ml-20"][i]}`}
            >
              <Shimmer className="shrink-0 size-14 !rounded-full" />
              <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-7 flex flex-col gap-3">
                <Shimmer className="size-14 !rounded-2xl" />
                <Shimmer className="h-6 w-48" />
                <Shimmer className="h-4 w-full" />
                <Shimmer className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats band ── */}
      <section className="bg-[#102210] py-20 px-6 md:px-20">
        <div className="flex flex-wrap justify-center gap-10 md:gap-24">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="animate-pulse rounded-lg bg-white/10 h-16 w-28" />
              <div className="animate-pulse rounded-lg bg-white/10 h-4 w-24" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="px-6 py-24 md:px-20 bg-[#0df20d]/5">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
          <Shimmer className="h-20 w-20 !rounded-full" />
          <Shimmer className="h-8 w-full max-w-2xl" />
          <Shimmer className="h-8 w-3/4 max-w-xl" />
          <div className="flex flex-col items-center gap-3">
            <Shimmer className="size-16 !rounded-full" />
            <Shimmer className="h-5 w-36" />
            <Shimmer className="h-4 w-28" />
          </div>
        </div>
      </section>
    </>
  );
}
