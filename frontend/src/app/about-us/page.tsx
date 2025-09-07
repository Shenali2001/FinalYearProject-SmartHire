"use client";
import React from "react";

export default function AboutSmartHire() {
  const cards = [
    {
      title: "Our Mission",
      body:
        "To transform the hiring process by leveraging artificial intelligence to create fair, efficient, and insightful candidate evaluations while maintaining the highest standards of ethics and privacy.",
    },
    {
      title: "Our Vision",
      body:
        "A world where talent is recognized and opportunities are accessible to everyone, regardless of background, through unbiased and intelligent recruitment processes.",
    },
    {
      title: "AI‑Powered Technology",
      body:
        "Our advanced AI algorithms analyze candidate responses, body language, and communication patterns to provide comprehensive insights while ensuring fairness and eliminating unconscious bias.",
    },
    {
      title: "Secure & Ethical",
      body:
        "We prioritize candidate privacy and data security, implementing industry‑leading encryption and following strict ethical guidelines in all our AI‑driven processes.",
    },
  ];

  return (
    <div className="min-h-[100dvh] bg-white">
      <div className="mx-auto max-w-5xl px-6 pb-20 pt-14">
        {/* Title */}
        <div className="text-center text-3xl font-extrabold tracking-tight text-gray-900">About Smart Hire</div>
        <div className="mx-auto mt-3 max-w-2xl text-center text-sm text-gray-600">
          Revolutionizing recruitment through AI‑powered interview technology
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {cards.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="text-lg font-semibold text-gray-900">{c.title}</div>
              <div className="mt-3 text-[15px] leading-7 text-gray-700">
                {c.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
