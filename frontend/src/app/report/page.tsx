"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type CandidateFeedback = {
  summary?: string;
  strengths?: string[];
  areas_to_improve?: string[];
  next_steps?: string[];
  resources?: string[];
  suitability?: string;
  is_suitable?: boolean;
  overall_rating?: number;
  hire_recommendation?: string;
  scorecard?: {
    easy?: { asked: number; correct: number };
    medium?: { asked: number; correct: number };
    hard?: { asked: number; correct: number };
    accuracy_pct?: number;
    [k: string]: any;
  };
};

type FinalReport = {
  report_id?: number;
  score?: number;
  questions_asked?: number;
  ended_by?: string;
  feedback?: CandidateFeedback;
  [k: string]: any;
};

export default function ReportPage() {
  const router = useRouter();
  const params = useSearchParams();
  const rid = params.get("rid") || undefined;

  const [report, setReport] = useState<FinalReport | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("finalReport");
      if (raw) setReport(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const fb: CandidateFeedback | null = useMemo(() => {
    if (!report) return null;
    return (report.feedback as CandidateFeedback) ?? null;
  }, [report]);

  const accuracy = fb?.scorecard?.accuracy_pct ?? null;

  const ScoreChip = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px]">
      <div className="text-gray-600">{label}:</div>
      <div className="font-semibold text-gray-900">{value ?? "—"}</div>
    </div>
  );

  const List = ({ items, bullet = "bg-emerald-500" }: { items?: string[]; bullet?: string }) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mt-2 space-y-2">
        {items.map((t, i) => (
          <div key={i} className="flex items-start gap-2 text-[13px] leading-6 text-gray-700">
            <div className={["mt-2 h-1.5 w-1.5 rounded-full", bullet].join(" ")}></div>
            <div className="flex-1 break-words">{t}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-[100dvh] bg-white">
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-14">
        {/* Header Icon */}
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
            <path d="M20 7l-9 9-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Title */}
        <div className="mt-4 text-center text-3xl font-extrabold tracking-tight text-gray-900">Interview Feedback</div>
   

        {!fb ? (
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-[13px] leading-6 text-amber-900">
            <div className="font-semibold">No feedback data found</div>
            <div className="mt-1 text-amber-800">Go back to the interview page and finish an interview to see your report.</div>
            <div
              onClick={() => router.push("/")}
              className="mx-auto mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
            >
              <div>Return to Dashboard</div>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Card */}
            <div className="mx-auto mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm">
              <div className="mb-5 text-center text-base font-semibold text-emerald-900">Candidate Summary</div>

              <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ScoreChip label="Questions Asked" value={report?.questions_asked ?? "—"} />
                  <ScoreChip label="Score" value={report?.score ?? "—"} />
                  <ScoreChip label="Accuracy" value={accuracy !== null ? `${accuracy}%` : "—"} />
                  <ScoreChip label="Suitability" value={fb?.suitability ?? "—"} />
                </div>

                {fb?.summary && (
                  <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-[13px] leading-6 text-gray-800">
                    {fb.summary}
                  </div>
                )}
              </div>

              {/* Two Columns: Strengths / Improvements */}
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-[15px] font-extrabold tracking-tight text-gray-900">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                    <div>Key Strengths</div>
                  </div>
                  <List items={fb.strengths} bullet="bg-emerald-500" />
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-[15px] font-extrabold tracking-tight text-gray-900">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-orange-600">
                      <path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="1.6"/>
                    </svg>
                    <div>Areas to Improve</div>
                  </div>
                  <List items={fb.areas_to_improve} bullet="bg-orange-500" />
                </div>
              </div>

              {/* Next Steps & Resources */}
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-2 text-[13px] font-extrabold tracking-tight text-gray-900">Next Steps</div>
                  <List items={fb.next_steps} bullet="bg-blue-500" />
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-2 text-[13px] font-extrabold tracking-tight text-gray-900">Suggested Resources</div>
                  <List items={fb.resources} bullet="bg-purple-500" />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <div
                  onClick={() => window.print()}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow hover:bg-gray-50"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-700">
                    <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>Download / Print</div>
                </div>

                <div
                  onClick={() => router.push("/")}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M12 17a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="1.6"/>
                    <path d="M17 9V7a5 5 0 10-10 0v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                  <div>Return to Dashboard</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center text-[13px] leading-6 text-gray-700">
              <div className="font-semibold text-gray-800">Thank you for using Smart Hire</div>
              <div className="mt-1 text-gray-600">
                A detailed analysis has been generated from your interview session.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
