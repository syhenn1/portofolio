"use client";

import { useEffect, useState } from "react";
import { FiGithub } from "react-icons/fi";

type CalendarDay = {
  date: string;
  count: number;
  level: number;
};

type CalendarData = {
  weeks: CalendarDay[][];
  monthLabels: { label: string; col: number }[];
  total: number;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const LEVEL_COLORS = [
  "rgba(0,0,0,0.055)",
  "rgba(255,106,0,0.3)",
  "rgba(255,106,0,0.5)",
  "rgba(255,106,0,0.72)",
  "rgba(255,106,0,0.95)",
];

function buildCalendar(contributions: { date: string; count: number; level: number }[]): CalendarData {
  const weeks: CalendarDay[][] = [];
  const monthLabels: { label: string; col: number }[] = [];
  let currentWeek: CalendarDay[] = [];
  let lastMonth = -1;

  contributions.forEach((day, i) => {
    const d = new Date(day.date + "T00:00:00");
    const dow = d.getDay();

    if (dow === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    const month = d.getMonth();
    if (month !== lastMonth && dow <= 1) {
      monthLabels.push({ label: MONTHS[month], col: weeks.length });
      lastMonth = month;
    }

    currentWeek.push({
      date: day.date,
      count: day.count,
      level: day.level,
    });

    if (i === contributions.length - 1 && currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
  });

  const total = contributions.reduce((sum, d) => sum + d.count, 0);
  return { weeks, monthLabels, total };
}

export default function GitHubCalendar({ username }: { username: string }) {
  const [data, setData] = useState<CalendarData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchContributions() {
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        setData(buildCalendar(json.contributions));
      } catch {
        setError(true);
      }
    }
    fetchContributions();
  }, [username]);

  const cellSize = 11;
  const cellGap = 3;
  const step = cellSize + cellGap;

  return (
    <div className="overflow-hidden">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <FiGithub size={18} style={{ color: "var(--em2)" }} />
          <span className="mono text-sm font-semibold text-gray-700">
            {data && (
              <span>
                <span className="gtx">{data.total.toLocaleString()}</span>
                {" contributions in the last year"}
              </span>
            )}
            {!data && !error && "Loading contributions..."}
            {error && "GitHub Contributions"}
          </span>
        </div>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mono text-xs font-medium"
          style={{ color: "var(--muted)" }}
        >
          @{username}
        </a>
      </div>

      {data && (
        <div>
          <svg
            viewBox={`0 0 ${data.weeks.length * step + 30} ${7 * step + 24}`}
            width="100%"
            style={{ display: "block", height: "auto" }}
          >
            {data.monthLabels.map((m, i) => (
              <text
                key={`${m.label}-${i}`}
                x={m.col * step + 30}
                y={10}
                fill="#8a8a86"
                fontSize={10}
                fontFamily="var(--font-mono, 'JetBrains Mono', monospace)"
              >
                {m.label}
              </text>
            ))}
            {data.weeks.map((week, wi) =>
              week.map((day) => {
                const d = new Date(day.date + "T00:00:00");
                const di = d.getDay();
                return (
                  <rect
                    key={day.date}
                    x={wi * step + 30}
                    y={di * step + 18}
                    width={cellSize}
                    height={cellSize}
                    rx={2.5}
                    fill={LEVEL_COLORS[day.level]}
                    style={{ transition: "fill 0.2s" }}
                  >
                    <title>{`${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}`}</title>
                  </rect>
                );
              })
            )}
          </svg>
        </div>
      )}

      {!data && !error && (
        <div className="flex items-center justify-center py-8">
          <div
            className="w-5 h-5 border-2 rounded-full animate-spin"
            style={{ borderColor: "rgba(255,106,0,0.3)", borderTopColor: "var(--em)" }}
          />
        </div>
      )}

      <div className="flex items-center justify-end gap-2 mt-2">
        <span className="mono text-[10px]" style={{ color: "#8a8a86" }}>Less</span>
        {LEVEL_COLORS.map((color, i) => (
          <div
            key={i}
            style={{ width: cellSize, height: cellSize, borderRadius: 2.5, background: color }}
          />
        ))}
        <span className="mono text-[10px]" style={{ color: "#8a8a86" }}>More</span>
      </div>
    </div>
  );
}
