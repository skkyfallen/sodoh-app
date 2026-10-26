"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  question: string;
  answer: string;
};

export function Accordion({ items, className }: { items: Item[]; className?: string }) {
  const [openId, setOpenId] = React.useState<string | null>(null);

  return (
    <div className={cn("divide-y divide-[var(--border)] border-y border-[var(--border)]", className)}>
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id} className="group">
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`faq-panel-${item.id}`}
              id={`faq-button-${item.id}`}
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex min-h-[4.25rem] w-full list-none items-center justify-between gap-5 rounded-lg py-5 text-left transition-colors hover:bg-[var(--surface-soft)]/60 focus-visible:outline-[var(--focus)]"
            >
              <span className="text-base font-semibold leading-6 text-[var(--ink)] md:text-lg">
                {item.question}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-[10px] border text-xl leading-none transition-all duration-300",
                  open
                    ? "rotate-45 border-[var(--brand)] bg-[var(--brand)] text-white dark:text-[#062a17]"
                    : "border-[var(--border)] text-[var(--brand)] group-hover:border-[var(--brand)]"
                )}
              >
                +
              </span>
            </button>
            <div
              id={`faq-panel-${item.id}`}
              role="region"
              aria-labelledby={`faq-button-${item.id}`}
              aria-hidden={!open}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="max-w-[70ch] pb-6 pr-10 text-sm leading-6 text-[var(--body)] md:text-[15px] md:leading-7">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
