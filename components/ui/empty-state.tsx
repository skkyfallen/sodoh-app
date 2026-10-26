import { cn } from "@/lib/utils";

type Props = {
  title: string;
  body: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ title, body, action, className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3 rounded-[18px] border border-dashed border-[var(--border)] bg-[var(--surface-soft)] px-6 py-10",
        className
      )}
    >
      <p className="display-font text-xl font-semibold tracking-[-0.025em] text-[var(--ink)]">{title}</p>
      <p className="max-w-[52ch] text-sm leading-6 text-[var(--body)]">{body}</p>
      {action}
    </div>
  );
}

export function AdminEmptyState({ title, body, action, className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3 rounded-[12px] border border-dashed border-[var(--admin-border)] bg-[var(--admin-page)] px-6 py-10",
        className
      )}
    >
      <p className="display-font text-lg font-semibold tracking-[-0.02em] text-[var(--admin-ink)]">{title}</p>
      <p className="max-w-[52ch] text-sm leading-6 text-[var(--admin-muted)]">{body}</p>
      {action}
    </div>
  );
}
