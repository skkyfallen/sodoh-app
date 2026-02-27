/* ── About page skeleton loader ──────────────────────────────
   Next.js App Router automatically renders this component
   while the async AboutPage is resolving its data fetches.
   Mirrors the section layout of page.tsx so there is no
   layout shift when content arrives.
──────────────────────────────────────────────────────────── */

function Shimmer({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
  );
}

export default function AboutLoading() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-white px-6 pt-20 pb-24 md:px-20 md:pt-28 md:pb-32">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:gap-16">
          {/* Left text column */}
          <div className="flex-1 flex flex-col items-start gap-5">
            <Shimmer className="h-4 w-32" />
            <Shimmer className="h-12 w-full max-w-xl" />
            <Shimmer className="h-6 w-3/4 max-w-lg" />
            <Shimmer className="h-6 w-2/3 max-w-md" />
            <div className="flex gap-4 mt-4">
              <Shimmer className="h-12 w-40 !rounded-full" />
              <Shimmer className="h-12 w-36 !rounded-full" />
            </div>
          </div>
          {/* Right stats column */}
          <div className="mt-16 lg:mt-0 flex flex-col gap-5 w-full lg:w-[340px] shrink-0">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-5 rounded-2xl border border-slate-100 bg-white px-6 py-5"
              >
                <Shimmer className="h-8 w-14" />
                <Shimmer className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Do ── */}
      <section className="px-6 md:px-20 py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto flex flex-col gap-5">
          <Shimmer className="h-10 w-48" />
          <Shimmer className="h-1 w-16 !rounded-full" />
          <Shimmer className="h-5 w-full" />
          <Shimmer className="h-5 w-[95%]" />
          <Shimmer className="h-5 w-[90%]" />
          <Shimmer className="h-5 w-[93%]" />
          <Shimmer className="h-5 w-[85%]" />
        </div>
      </section>

      {/* ── Our Journey ── */}
      <section className="px-6 md:px-20 py-20 bg-white">
        <div className="flex flex-col items-center gap-4 mb-16">
          <Shimmer className="h-12 w-64" />
          <Shimmer className="h-1 w-16 !rounded-full" />
        </div>
        <div className="relative flex flex-col gap-8 max-w-3xl mx-auto">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex items-start gap-6 ${
                ["ml-0", "ml-0 md:ml-10", "ml-0 md:ml-20", "ml-0 md:ml-10", "ml-0"][i]
              }`}
            >
              <Shimmer className="shrink-0 size-14 !rounded-full" />
              <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-7 flex flex-col gap-3">
                <Shimmer className="h-5 w-20 !rounded-full" />
                <Shimmer className="h-6 w-48" />
                <Shimmer className="h-4 w-full" />
                <Shimmer className="h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── What We Stand For ── */}
      <section className="px-6 md:px-20 py-20 bg-slate-50">
        <div className="flex flex-col gap-4 mb-12">
          <Shimmer className="h-10 w-56" />
          <Shimmer className="h-1 w-20 !rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-4 p-6 rounded-2xl border border-slate-100 bg-white"
            >
              <Shimmer className="size-12 !rounded-xl" />
              <Shimmer className="h-5 w-32" />
              <Shimmer className="h-4 w-full" />
              <Shimmer className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Meet the Team ── */}
      <section className="px-6 md:px-20 py-20 bg-white">
        <div className="flex flex-col gap-4 mb-12">
          <Shimmer className="h-10 w-44" />
          <Shimmer className="h-1 w-20 !rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-4 p-6 rounded-2xl border border-slate-100 bg-white"
            >
              <Shimmer className="size-16 !rounded-2xl" />
              <Shimmer className="h-5 w-40" />
              <Shimmer className="h-3 w-32" />
              <Shimmer className="h-4 w-full" />
              <Shimmer className="h-4 w-11/12" />
              <Shimmer className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="mx-6 md:mx-20 mb-16 mt-4 rounded-2xl bg-slate-100 py-16 px-8 md:px-16">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-5">
          <Shimmer className="h-12 w-72" />
          <Shimmer className="h-5 w-96 max-w-full" />
          <Shimmer className="h-14 w-48 !rounded-full" />
        </div>
      </section>
    </>
  );
}
