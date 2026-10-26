import * as React from "react";
import { cn } from "@/lib/utils";

function TableShell({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[12px] border border-[var(--admin-border)] bg-[var(--admin-surface)]",
        className
      )}
      {...props}
    />
  );
}

function TableScroller({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("overflow-x-auto", className)} {...props} />;
}

const AdminTable = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <table ref={ref} className={cn("w-full text-sm", className)} {...props} />
  )
);
AdminTable.displayName = "AdminTable";

function AdminTHead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-[var(--admin-page)]", className)} {...props} />;
}

function AdminTH({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "whitespace-nowrap px-4 py-3 text-left text-[13px] font-semibold capitalize tracking-normal text-[var(--admin-muted)]",
        className
      )}
      {...props}
    />
  );
}

function AdminTD({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("px-4 py-3 align-middle text-[var(--admin-ink)]", className)} {...props} />
  );
}

export { TableShell, TableScroller, AdminTable, AdminTHead, AdminTH, AdminTD };
