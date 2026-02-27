"use client";

import { useState } from "react";
import type { Stat } from "@/types/content";

type Props = {
  stats?: Stat[];
};

const defaultStats: Stat[] = [
  { id: "1", value: "500+", label: "Farms Partnered",  sub: "Across 12 Nigerian states", display_order: 1 },
  { id: "2", value: "12",   label: "States Served",    sub: "North, South, East and West", display_order: 2 },
  { id: "3", value: "98%",  label: "On-Time Delivery", sub: "Cold-chain monitored end-to-end", display_order: 3 },
];

const CARD_HEADER = 70;  // px — header row height
const CARD_SUB    = 40;  // px — subtext drawer height
const CARD_GAP    = 12;  // px — gap between expanded cards
const STACK_STEP  = 8;   // px — peek offset between stacked cards

export default function StatsStack({ stats: propStats }: Props) {
  const stats = propStats && propStats.length > 0 ? propStats : defaultStats;
  const [expanded, setExpanded] = useState(false);

  // Card 0 = front of deck (no rotation, y=0), cards behind peek below
  const stackRotations = [0, 3, -5];
  const collapsedY = (i: number) => i * STACK_STEP;
  const expandedY  = (i: number) => i * (CARD_HEADER + CARD_SUB + CARD_GAP);
  // z-index NEVER changes — eliminates the mid-animation reorder glitch
  const zIndex = (i: number) => stats.length - i;

  const containerHeight = expanded
    ? stats.length * (CARD_HEADER + CARD_SUB + CARD_GAP) - CARD_GAP
    : CARD_HEADER + (stats.length - 1) * STACK_STEP + 16;

  return (
    <div
      className="w-full lg:w-[340px] shrink-0 mt-16 lg:mt-0 select-none"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div
        className="relative w-full"
        style={{
          height: `${containerHeight}px`,
          transition: "height 500ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="absolute left-0 right-0 rounded-2xl border border-slate-200 bg-white overflow-hidden"
            style={{
              zIndex: zIndex(i),
              transform: expanded
                ? `translateY(${expandedY(i)}px) rotate(0deg)`
                : `translateY(${collapsedY(i)}px) rotate(${stackRotations[i]}deg)`,
              boxShadow: expanded
                ? "0 4px 20px rgba(0,0,0,0.08)"
                : "0 6px 24px rgba(0,0,0,0.10)",
              transition: `transform 450ms cubic-bezier(0.34,1.56,0.64,1) ${
                expanded ? i * 70 : (stats.length - 1 - i) * 70
              }ms, box-shadow 300ms ease`,
            }}
          >
            {/* Header — always visible */}
            <div className="flex items-center gap-4 px-6 py-5">
              <span className="text-3xl font-black text-[#016936] leading-none shrink-0 whitespace-nowrap">
                {stat.value}
              </span>
              <span className="text-slate-800 text-sm font-bold leading-snug">
                {stat.label}
              </span>
            </div>

            {/* Sub-text — slides open on hover */}
            <div
              className="px-6 text-slate-500 text-sm leading-relaxed font-medium overflow-hidden border-t border-slate-100"
              style={{
                maxHeight: expanded ? `${CARD_SUB}px` : "0px",
                paddingTop: expanded ? "10px" : "0px",
                paddingBottom: expanded ? "14px" : "0px",
                transition: `max-height 350ms ease ${
                  expanded ? i * 70 + 180 : 0
                }ms, padding 350ms ease ${
                  expanded ? i * 70 + 180 : 0
                }ms`,
              }}
            >
              {stat.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
