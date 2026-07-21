"use client";

import { motion } from "framer-motion";
import { statsData, socialLinks } from "@/lib/data";
import GitHubCalendar from "@/components/GitHubCalendar";

const ghUser = socialLinks.github.split("/").pop()!;

export default function Stats() {
  return (
    <section id="stats" className="relative z-10 px-3 sm:px-5 md:-mt-12 pb-24 sm:pb-32">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
        {/* Stats (left) + Trophies (right) in one container */}
        <motion.div
          className="stat-bar w-full overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-start divide-y lg:divide-y-0 lg:divide-x divide-black/10">
            {/* Left — Stats */}
            <div className="grid grid-cols-3 divide-x divide-black/10">
              {statsData.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center justify-center text-center py-4 px-3">
                  <stat.Icon size={22} className="mb-2" style={{ color: "var(--em)" }} />
                  <div className="text-2xl sm:text-3xl font-black gtx mb-1">{stat.n}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
            {/* Right — Trophies */}
            <div className="flex items-center px-3 py-3 overflow-x-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://github-trophies.vercel.app/?username=${ghUser}&theme=darkhub&row=1&margin-w=4&no-bg=true&no-frame=true`}
                alt="GitHub Trophies"
                className="w-full min-w-80"
              />
            </div>
          </div>
        </motion.div>

        {/* GitHub Contributions — wide bar below */}
        <motion.div
          className="stat-bar overflow-hidden w-full"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="px-4 py-3">
            <GitHubCalendar username={ghUser} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
