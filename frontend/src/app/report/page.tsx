"use client";
import React from "react";

// Save as: app/interview-complete/page.tsx (Next.js App Router)
// TailwindCSS required. Entire layout uses <div> elements and inline SVGs (no h1/p/button tags).

export default function InterviewCompletePage() {
  const grade = "B+"; // set from your backend
  const scores = [
    { label: "React/Frontend", value: 85, color: "text-emerald-600" },
    { label: "Backend", value: 78, color: "text-blue-600" },
    { label: "Problem Solving", value: 72, color: "text-orange-600" },
    { label: "Communication", value: 80, color: "text-purple-600" },
  ];

  const Bullet = ({ children, color = "bg-emerald-500" }: { children: React.ReactNode; color?: string }) => (
    <div className="flex items-start gap-2 text-[13px] leading-6 text-gray-700">
      <div className={["mt-2 h-1.5 w-1.5 rounded-full", color].join(" ")}></div>
      <div className="flex-1">{children}</div>
    </div>
  );

  const SectionTitle = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <div className="mb-2 flex items-center gap-2 text-[15px] font-extrabold tracking-tight text-gray-900">
      <div>{icon}</div>
      <div>{text}</div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-white">
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-14">
        {/* Header Icon */}
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-600">
            <path d="M20 7l-9 9-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Title */}
        <div className="mt-4 text-center text-3xl font-extrabold tracking-tight text-gray-900">Interview Complete!</div>
        <div className="mx-auto mt-2 max-w-xl text-center text-sm text-gray-600">
          AI is preparing your personalized assessment summary
        </div>

        {/* Summary Card */}
        <div className="mx-auto mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm">
          <div className="mb-5 text-center text-base font-semibold text-emerald-900">Your Interview Summary</div>

          {/* Overall Assessment */}
          <div className="rounded-xl border border-emerald-200 bg-white p-6 text-center shadow-sm">
            <div className="text-[13px] font-extrabold uppercase tracking-wide text-gray-800">Overall Assessment</div>
            <div className="mt-3 text-4xl font-black text-emerald-600">{grade}</div>
            <div className="mx-auto mt-2 max-w-md text-[13px] text-gray-700">
              Strong performance with good technical knowledge
            </div>
          </div>

          {/* Two Columns: Strengths / Improvements */}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <SectionTitle
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-600">
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                }
                text="Key Strengths"
              />
              <div className="space-y-2">
                <Bullet>Clear explanation of React and Next.js concepts</Bullet>
                <Bullet>Good understanding of database design principles</Bullet>
                <Bullet>Demonstrated problem‑solving approach</Bullet>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <SectionTitle
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-600">
                    <path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="1.6"/>
                  </svg>
                }
                text="Areas to Improve"
              />
              <div className="space-y-2">
                <Bullet color="bg-orange-500">Could elaborate more on algorithm complexity</Bullet>
                <Bullet color="bg-orange-500">Consider discussing testing strategies</Bullet>
                <Bullet color="bg-orange-500">Provide more specific project examples</Bullet>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 text-[13px] font-extrabold tracking-tight text-gray-900">Technical Skills Assessment</div>
            <div className="grid gap-6 sm:grid-cols-4">
              {scores.map((s) => (
                <div key={s.label} className="text-center">
                  <div className={["text-2xl font-black", s.color].join(" ")}>{s.value}%</div>
                  <div className="mt-2 text-[12px] text-gray-600">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <div className="mb-2 text-[13px] font-extrabold tracking-tight text-gray-900">AI Recommendation</div>
            <div className="text-[13px] leading-6 text-gray-700">
              <span className="font-semibold text-blue-700">Candidate shows strong potential for a mid‑level developer role.</span>
              <span className="ml-1">Technical foundation is solid with good practical experience. Recommend focusing on advanced algorithms and system design concepts for senior positions.</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <div className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow hover:bg-gray-50">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-700">
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>Download Preliminary Report</div>
            </div>
            <div className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M12 17a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M17 9V7a5 5 0 10-10 0v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              <div>Return to Dashboard</div>
            </div>
          </div>
        </div>

        {/* Footer Thank You */}
        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center text-[13px] leading-6 text-gray-700">
          <div className="font-semibold text-gray-800">Thank you for using Smart Hire's AI Interview Platform</div>
          <div className="mt-1 text-gray-600">
            We'll notify you via email once your detailed analysis is ready and when the hiring team reviews your interview.
          </div>
        </div>
      </div>
    </div>
  );
}
