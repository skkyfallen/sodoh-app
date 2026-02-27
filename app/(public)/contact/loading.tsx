function Shimmer({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
  );
}

export default function ContactLoading() {
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
            <Shimmer className="mt-6 h-12 w-44 !rounded-full" />
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

      {/* ── Form + Details grid ── */}
      <main className="px-6 md:px-20 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact form skeleton */}
        <div className="flex flex-col gap-5">
          <Shimmer className="h-8 w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Shimmer className="h-4 w-16" />
              <Shimmer className="h-11 w-full !rounded-xl" />
            </div>
            <div className="flex flex-col gap-2">
              <Shimmer className="h-4 w-16" />
              <Shimmer className="h-11 w-full !rounded-xl" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Shimmer className="h-4 w-20" />
            <Shimmer className="h-11 w-full !rounded-xl" />
          </div>
          <div className="flex flex-col gap-2">
            <Shimmer className="h-4 w-20" />
            <Shimmer className="h-36 w-full !rounded-xl" />
          </div>
          <Shimmer className="h-12 w-40 !rounded-full" />
        </div>

        {/* Contact details + map skeleton */}
        <div className="flex flex-col gap-8">
          <div className="bg-white p-8 rounded-xl border border-slate-100">
            <Shimmer className="h-7 w-52 mb-8" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 mb-6 last:mb-0">
                <Shimmer className="size-12 !rounded-lg shrink-0" />
                <div className="flex flex-col gap-2">
                  <Shimmer className="h-5 w-28" />
                  <Shimmer className="h-4 w-44" />
                </div>
              </div>
            ))}
          </div>
          <Shimmer className="w-full h-64 !rounded-xl" />
        </div>
      </main>

      {/* ── FAQ ── */}
      <section className="px-6 md:px-20 py-20 bg-[#0df20d]/5">
        <div className="max-w-3xl mx-auto">
          <Shimmer className="h-9 w-72 mx-auto mb-12" />
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-100">
                <Shimmer className="h-6 w-3/4 mb-3" />
                <Shimmer className="h-4 w-full" />
                <Shimmer className="h-4 w-5/6 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
