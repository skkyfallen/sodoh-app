import type { Stat } from "@/types/content";

type Props = { stats?: Stat[] };

/** Accessible, content-led proof list. Empty data stays empty rather than inventing figures. */
export default function StatsStack({ stats = [] }: Props) {
  if (!stats.length) return null;

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <li key={stat.id} className="border-t border-[var(--border)] pt-4">
          <p className="display-font text-3xl font-semibold tracking-[-0.04em] text-[var(--brand)]">{stat.value}</p>
          <p className="mt-1 text-sm font-semibold text-[var(--ink)]">{stat.label}</p>
          {stat.sub && <p className="mt-1 text-sm leading-5 text-[var(--body)]">{stat.sub}</p>}
        </li>
      ))}
    </ul>
  );
}
