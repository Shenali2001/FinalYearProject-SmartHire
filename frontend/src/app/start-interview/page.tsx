// "use client";
// import React, { useEffect, useMemo, useRef, useState } from "react";

// export default function AudioInterviewPage() {
//   const totalQuestions = 5;

//   const [started, setStarted] = useState(false);
//   const [seconds, setSeconds] = useState(0);
//   const [qIndex, setQIndex] = useState(0); // 0-based

//   const questions = useMemo(
//     () => [
//       "I see from your CV that you have experience with React and Next.js. Can you walk me through a specific project where you used these technologies and what challenges you faced?",
//       "Tell me about a time you optimized a backend API. What was slow, how did you measure it, and what improved?",
//       "Describe a complex UI you built. How did you break it down and manage state?",
//       "How do you approach testing in full‑stack apps? Tools and strategies?",
//       "What’s a recent technical decision you’re proud of and why?",
//     ],
//     []
//   );

//   // Simple timer when recording
//   useEffect(() => {
//     if (!started) return;
//     const t = setInterval(() => setSeconds((s) => s + 1), 1000);
//     return () => clearInterval(t);
//   }, [started]);

//   const reset = () => {
//     setStarted(false);
//     setSeconds(0);
//     setQIndex(0);
//   };

//   const next = () => {
//     if (qIndex < totalQuestions - 1) setQIndex((i) => i + 1);
//   };

//   const progressPct = Math.round((qIndex / totalQuestions) * 100);

//   const TimeChip = ({ small = false }: { small?: boolean }) => (
//     <div
//       className={[
//         "rounded-full bg-gray-100 text-gray-700",
//         small ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
//       ].join(" ")}
//     >
//       {`Time: ${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
//         seconds % 60
//       ).padStart(2, "0")}`}
//     </div>
//   );

//   const RecPill = () => (
//     <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
//       <div className="h-2 w-2 rounded-full bg-red-600"></div>
//       <div>Recording</div>
//     </div>
//   );

//   const MicIcon = ({ cls = "text-gray-300" }: { cls?: string }) => (
//     <svg width="34" height="34" viewBox="0 0 24 24" fill="none" className={cls} xmlns="http://www.w3.org/2000/svg">
//       <path d="M12 14a3 3 0 003-3V7a3 3 0 10-6 0v4a3 3 0 003 3z" stroke="currentColor" strokeWidth="1.6"/>
//       <path d="M5 11a7 7 0 0014 0M12 18v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
//     </svg>
//   );

//   const Dot = ({ color = "bg-emerald-500" }: { color?: string }) => (
//     <div className={["h-2 w-2 rounded-full", color].join(" ")}></div>
//   );

//   return (
//     <div className="min-h-[100dvh] bg-white">
//       {/* Top bar */}
//       <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
//         <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
//           <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
//             {!started ? (
//               <div className="rounded-full bg-gray-100 px-3 py-1 text-xs">Interview Ready</div>
//             ) : (
//               <RecPill />
//             )}
//             {started && <TimeChip />}
//           </div>
//           <div className="flex items-center gap-2">
//             {/* Mic icon button (visual only) */}
//             <div className="grid h-8 w-8 place-items-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
//               <MicIcon cls="text-gray-600" />
//             </div>
//             {/* Placeholder for settings */}
//             <div className="grid h-8 w-8 place-items-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.6"/>
//                 <path d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06a2 2 0 01-2.83 2.83l-.06-.06A1.7 1.7 0 0015 19.4a1.7 1.7 0 00-1 .6 1.7 1.7 0 00-.4 1v.2a2 2 0 01-4 0v-.2a1.7 1.7 0 00-.4-1 1.7 1.7 0 00-1-.6 1.7 1.7 0 00-1.88-.34l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.7 1.7 0 004.6 15a1.7 1.7 0 00-.6-1 1.7 1.7 0 00-1-.4H3a2 2 0 010-4h.2a1.7 1.7 0 001-.4 1.7 1.7 0 00.6-1A1.7 1.7 0 004.6 4.6l-.06-.06A2 2 0 017.37 1.7l.06.06A1.7 1.7 0 009 2.6c.23-.05.47-.05.7 0A1.7 1.7 0 0011 2a2 2 0 014 0c.34.02.67.13.96.3.29.18.54.42.74.7l.06-.06A2 2 0 0119.4 4.6L19.34 4.66A1.7 1.7 0 0020 6c0 .23 0 .47-.06.7.27.21.49.47.64.76A1.7 1.7 0 0021.4 9h.2a2 2 0 010 4h-.2a1.7 1.7 0 00-1 .4 1.7 1.7 0 00-.6 1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main content grid */}
//       {!started ? (
//         // READY SCREEN
//         <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
//           {/* Left: Mic Preview */}
//           <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//             <div className="text-sm font-semibold text-gray-900">Microphone Preview</div>
//             <div className="mt-4 rounded-xl border border-gray-200 bg-[#0b1320] p-6 text-center text-gray-300 place-items-center">
//               <div className="mx-auto mb-3 grid h-60 w-10 place-items-center rounded-full ">
//                  <div className="place-items-center rounded-full bg-[#141c2b] w-20 ">              
//                      <MicIcon />
//                  </div>
//               </div>
//               <div className="text-[13px] text-gray-300">Microphone will activate when interview starts</div>
//             </div>
//           </div>

//           {/* Right: Details + Start */}
//           <div className="space-y-6">
//             <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//               <div className="text-sm font-semibold text-gray-900">Interview Details</div>
//               <div className="mt-4 space-y-4 text-[13px] text-gray-800">
//                 <div className="font-semibold text-gray-900">Questions: {totalQuestions}</div>
//                 <div className="text-gray-600">
//                   You'll be asked a series of questions. Take your time to answer thoughtfully.
//                 </div>
//                 <div className="font-semibold text-gray-900">Estimated Duration: 15–20 minutes</div>
//                 <div className="text-gray-600">
//                   Each question has no time limit, but aim for 2–3 minutes per response.
//                 </div>
//                 <div className="my-2 h-px w-full bg-gray-200" />
//                 <div className="font-semibold text-gray-900">Ready to begin?</div>
//                 <div
//                   onClick={() => setStarted(true)}
//                   className="mt-2 w-full cursor-pointer rounded-xl bg-emerald-600 px-4 py-2 text-center text-sm font-semibold text-white shadow hover:bg-emerald-700"
//                 >
//                   Start Interview
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//               <div className="text-sm font-semibold text-gray-900">Final Checklist</div>
//               <div className="mt-3 space-y-2 text-[13px] text-gray-800">
//                 <div className="flex items-center gap-2"><Dot /><div>Microphone is working</div></div>
//                 <div className="flex items-center gap-2"><Dot /><div>Quiet environment ready</div></div>
//                 <div className="flex items-center gap-2"><Dot /><div>Good lighting setup</div></div>
//                 <div className="flex items-center gap-2"><Dot /><div>CV ready for reference</div></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         // RECORDING SCREEN
//         <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
//           {/* Left: Audio feed (dark panel) */}
//           <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//             <div className="relative rounded-xl border border-gray-200 bg-[#0b1320] p-6 text-center text-gray-300">
//               {/* REC pill */}
//               <div className="absolute left-3 top-3"> <RecPill /> </div>
//               <div className="mx-auto mb-3 grid h-60 w-12 place-items-center">
//                 <div className="h-12 w-12 place-items-center rounded-full bg-[#141c2b]">
//                      <MicIcon /></div>
//               </div>
//               <div className="text-[13px] text-gray-300">Your audio feed</div>
//             </div>
//           </div>

//           {/* Right: Question Panel */}
//           <div className="space-y-6">
//             <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//               <div className="flex items-start justify-between">
//                 <div className="text-base font-semibold text-gray-900">{`Question ${qIndex + 1} of ${totalQuestions}`}</div>
//                 <TimeChip small />
//               </div>
//               <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-[14px] leading-6 text-gray-900">
//                 {questions[qIndex]}
//               </div>
//               <div className="mt-3 text-[12px] leading-6 text-gray-600">
//                 Take your time to provide a thoughtful response. Speak clearly and maintain a steady pace.
//               </div>
//               <div className="mt-4 flex items-center gap-3">
//                 <div
//                   onClick={next}
//                   className={[
//                     "flex-1 cursor-pointer rounded-xl bg-gray-100 px-4 py-2 text-center text-sm font-semibold text-gray-800 hover:bg-gray-200",
//                     qIndex >= totalQuestions - 1 ? "pointer-events-none opacity-50" : "",
//                   ].join(" ")}
//                 >
//                   Next Question
//                 </div>
//                 <div
//                   onClick={reset}
//                   className="w-28 cursor-pointer rounded-xl bg-rose-500 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-rose-600"
//                 >
//                   End
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//               <div className="mb-2 text-[12px] font-semibold text-gray-700">Progress</div>
//               <div className="h-2 w-full rounded-full bg-gray-200">
//                 <div
//                   className="h-2 rounded-full bg-gray-400"
//                   style={{ width: `${progressPct}%` }}
//                 />
//               </div>
//               <div className="mt-1 text-right text-[12px] text-gray-600">{progressPct}%</div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/**
 * AudioInterviewPage — wired to your FastAPI interview API
 * Endpoints used:
 *   POST /interview/start?email=...&max_questions=...
 *   POST /interview/answer?email=...&answer=...&question=...
 *
 * Fixes included:
 * - Submit & Next no longer resets to the Start screen — we keep `started=true`.
 * - If API doesn't return a next question, we show an error but stay on the interview UI.
 * - Progress is based on the selected max questions.
 *
 * Configuration:
 *   - NEXT_PUBLIC_API_BASE (optional) e.g. http://127.0.0.1:8000
 *   - CORS on FastAPI must allow your Next.js origin.
 */
export default function AudioInterviewPage() {
  // ------- Config -------
  const DEFAULT_API_BASE = "http://127.0.0.1:8000"; // fallback if env not set
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || DEFAULT_API_BASE;
  const DEFAULT_MAX_QUESTIONS = 10; // you can tweak via UI

  // ------- UI / flow state -------
  const [email, setEmail] = useState("hiruni123@gmail.com");
  const [maxQuestions, setMaxQuestions] = useState<number>(DEFAULT_MAX_QUESTIONS);

  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const [qIndex, setQIndex] = useState(0); // 0-based index of the *next* question number to display
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ difficulty?: string; tag?: string; scored?: boolean } | null>(null);

  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<Array<{
    question: string;
    answer: string;
    difficulty?: string;
    tag?: string;
    scored?: boolean;
  }>>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  // Simple timer when "recording"
  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [started]);

  // ------- API helpers -------
  const startInterview = useCallback(async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    setFinished(false);
    try {
      const url = `${API_BASE}/interview/start?email=${encodeURIComponent(email)}&max_questions=${encodeURIComponent(String(maxQuestions))}`;
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) throw new Error(`Start failed (${res.status})`);
      const data: { question?: string; difficulty?: string; tag?: string; scored?: boolean } = await res.json();
      if (!data.question) throw new Error("No question returned from API");

      // initialize interview state
      setStarted(true);
      setSeconds(0);
      setQIndex(0);
      setHistory([]);
      setAnswer("");
      setCurrentQuestion(data.question);
      setMeta({ difficulty: data.difficulty, tag: data.tag, scored: data.scored });
    } catch (e: any) {
      setError(e?.message || "Failed to start interview");
      setStarted(false);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, email, maxQuestions]);

  const submitAndNext = useCallback(async () => {
    if (!currentQuestion) return;
    setLoading(true);
    setError(null);
    try {
      // Persist the just-answered question locally
      setHistory((h) => [
        ...h,
        { question: currentQuestion, answer: answer.trim(), difficulty: meta?.difficulty, tag: meta?.tag, scored: meta?.scored },
      ]);

      const url = `${API_BASE}/interview/answer?email=${encodeURIComponent(email)}&answer=${encodeURIComponent(
        answer.trim() || "(no answer)"
      )}&question=${encodeURIComponent(currentQuestion)}`;
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) throw new Error(`Next failed (${res.status})`);

      const data: { question?: string; difficulty?: string; tag?: string; scored?: boolean } = await res.json();

      // If API did not return another question, do NOT reset UI. Show an error and stay here.
      if (!data?.question) {
        setError("API did not return a next question. Please try again.");
        return;
      }

      // Move to next question
      setQIndex((i) => i + 1);
      setCurrentQuestion(data.question);
      setMeta({ difficulty: data.difficulty, tag: data.tag, scored: data.scored });
      setAnswer("");

      // If we've reached or exceeded the maxQuestions budget, mark finished (defensive guard)
      if (qIndex + 1 >= maxQuestions - 1) {
        // The next submit will exceed the budget; let the user continue or end manually.
      }
    } catch (e: any) {
      setError(e?.message || "Failed to fetch next question");
    } finally {
      setLoading(false);
    }
  }, [API_BASE, email, answer, currentQuestion, meta, qIndex, maxQuestions]);

  const endInterview = useCallback(() => {
    setStarted(false);
    setFinished(true);
  }, []);

  const resetAll = useCallback(() => {
    setStarted(false);
    setSeconds(0);
    setQIndex(0);
    setCurrentQuestion(null);
    setMeta(null);
    setAnswer("");
    setHistory([]);
    setError(null);
    setFinished(false);
  }, []);

  const totalQuestions = useMemo(() => maxQuestions, [maxQuestions]);
  const progressPct = Math.min(100, Math.round((qIndex / totalQuestions) * 100));

  // --- Small UI atoms ---
  const TimeChip = ({ small = false }: { small?: boolean }) => (
    <div
      className={[
        "rounded-full bg-gray-100 text-gray-700",
        small ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
      ].join(" ")}
    >
      {`Time: ${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
        seconds % 60
      ).padStart(2, "0")}`}
    </div>
  );

  const RecPill = () => (
    <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
      <div className="h-2 w-2 rounded-full bg-red-600"></div>
      <div>Recording</div>
    </div>
  );

  const MicIcon = ({ cls = "text-gray-300" }: { cls?: string }) => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" className={cls} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 14a3 3 0 003-3V7a3 3 0 10-6 0v4a3 3 0 003 3z" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M5 11a7 7 0 0014 0M12 18v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );

  const Dot = ({ color = "bg-emerald-500" }: { color?: string }) => (
    <div className={["h-2 w-2 rounded-full", color].join(" ")}></div>
  );

  const qLabel = started && currentQuestion ? `Question ${qIndex + 1} of ${totalQuestions}` : finished ? "Interview Finished" : "";

  return (
    <div className="min-h-[100dvh] bg-white">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            {!started ? (
              <div className="rounded-full bg-gray-100 px-3 py-1 text-xs">{finished ? "Interview Done" : "Interview Ready"}</div>
            ) : (
              <RecPill />
            )}
            {started && <TimeChip />}
          </div>
          <div className="flex items-center gap-2">
            {/* Mic icon button (visual only) */}
            <div className="grid h-8 w-8 place-items-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
              <MicIcon cls="text-gray-600" />
            </div>
            {/* Placeholder for settings */}
            <div className="grid h-8 w-8 place-items-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06a2 2 0 01-2.83 2.83l-.06-.06A1.7 1.7 0 0015 19.4a1.7 1.7 0 00-1 .6 1.7 1.7 0 00-.4 1v.2a2 2 0 01-4 0v-.2a1.7 1.7 0 00-.4-1 1.7 1.7 0 00-1-.6 1.7 1.7 0 00-1.88-.34l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.7 1.7 0 004.6 15a1.7 1.7 0 00-.6-1 1.7 1.7 0 00-1-.4H3a2 2 0 010-4h.2a1.7 1.7 0 001-.4 1.7 1.7 0 00.6-1A1.7 1.7 0 004.6 4.6l-.06-.06A2 2 0 017.37 1.7l.06.06A1.7 1.7 0 009 2.6c.23-.05.47-.05.7 0A1.7 1.7 0 0011 2a2 2 0 014 0c.34.02.67.13.96.3.29.18.54.42.74.7l.06-.06A2 2 0 0119.4 4.6L19.34 4.66A1.7 1.7 0 0020 6c0 .23 0 .47-.06.7.27.21.49.47.64.76A1.7 1.7 0 0021.4 9h.2a2 2 0 010 4h-.2a1.7 1.7 0 00-1 .4 1.7 1.7 0 00-.6 1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      {!started ? (
        finished ? (
          // FINISHED SCREEN
          <div className="mx-auto max-w-3xl px-6 py-10">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="text-lg font-semibold text-gray-900">Interview summary</div>
              <div className="mt-3 text-sm text-gray-700">Thanks! Here are the questions you answered:</div>
              <div className="mt-4 space-y-3">
                {history.length === 0 ? (
                  <div className="text-sm text-gray-500">No answers recorded.</div>
                ) : (
                  history.map((h, i) => (
                    <div key={i} className="rounded-lg border border-gray-200 p-3">
                      <div className="text-[13px] font-semibold text-gray-800">Q{i + 1}. {h.question}</div>
                      <div className="mt-1 whitespace-pre-wrap text-[13px] text-gray-700">{h.answer}</div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={resetAll} className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200">Reset</button>
                <button onClick={startInterview} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Start Again</button>
              </div>
            </div>
          </div>
        ) : (
          // READY SCREEN
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
            {/* Left: Mic Preview */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-gray-900">Microphone Preview</div>
              <div className="mt-4 rounded-xl border border-gray-200 bg-[#0b1320] p-6 text-center text-gray-300 place-items-center">
                <div className="mx-auto mb-3 grid h-60 w-10 place-items-center rounded-full ">
                  <div className="place-items-center rounded-full bg-[#141c2b] w-20 ">
                    <MicIcon />
                  </div>
                </div>
                <div className="text-[13px] text-gray-300">Microphone will activate when interview starts</div>
              </div>
            </div>

            {/* Right: Details + Start */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-gray-900">Interview Details</div>
                <div className="mt-4 space-y-4 text-[13px] text-gray-800">
                  <label className="block text-[13px]">
                    <div className="mb-1 font-semibold text-gray-900">Candidate email</div>
                    <input
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                    />
                  </label>
                  <label className="block text-[13px]">
                    <div className="mb-1 font-semibold text-gray-900">Max questions</div>
                    <input
                      type="number"
                      min={1}
                      max={25}
                      className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      value={maxQuestions}
                      onChange={(e) => setMaxQuestions(Number(e.target.value) || 1)}
                    />
                  </label>
                  <div className="font-semibold text-gray-900">Estimated Duration: 15–20 minutes</div>
                  <div className="text-gray-600">
                    Each question has no time limit, but aim for 2–3 minutes per response.
                  </div>
                  {error && (
                    <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-[12px] text-rose-700">
                      {error}
                    </div>
                  )}
                  <div className="my-2 h-px w-full bg-gray-200" />
                  <div className="font-semibold text-gray-900">Ready to begin?</div>
                  <button
                    onClick={startInterview}
                    disabled={loading || !email}
                    className="mt-2 w-full cursor-pointer rounded-xl bg-emerald-600 px-4 py-2 text-center text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {loading ? "Starting..." : "Start Interview"}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-gray-900">Final Checklist</div>
                <div className="mt-3 space-y-2 text-[13px] text-gray-800">
                  <div className="flex items-center gap-2"><Dot /><div>Microphone is working</div></div>
                  <div className="flex items-center gap-2"><Dot /><div>Quiet environment ready</div></div>
                  <div className="flex items-center gap-2"><Dot /><div>Good lighting setup</div></div>
                  <div className="flex items-center gap-2"><Dot /><div>CV ready for reference</div></div>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        // RECORDING SCREEN
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
          {/* Left: Audio feed (dark panel) */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="relative rounded-xl border border-gray-200 bg-[#0b1320] p-6 text-center text-gray-300">
              {/* REC pill */}
              <div className="absolute left-3 top-3"> <RecPill /> </div>
              <div className="mx-auto mb-3 grid h-60 w-12 place-items-center">
                <div className="h-12 w-12 place-items-center rounded-full bg-[#141c2b]">
                  <MicIcon />
                </div>
              </div>
              <div className="text-[13px] text-gray-300">Your audio feed</div>
            </div>
          </div>

          {/* Right: Question Panel */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="text-base font-semibold text-gray-900">{qLabel}</div>
                <TimeChip small />
              </div>

              {/* Question card */}
              <div className="mt-4 min-h-[88px] rounded-xl border border-blue-200 bg-blue-50 p-4 text-[14px] leading-6 text-gray-900">
                {currentQuestion}
              </div>

              {/* Meta */}
              {(meta?.tag || meta?.difficulty) && (
                <div className="mt-2 flex gap-2 text-[11px] text-gray-600">
                  {meta?.tag && <span className="rounded-full bg-gray-100 px-2 py-0.5">tag: {meta.tag}</span>}
                  {meta?.difficulty && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5">difficulty: {meta.difficulty}</span>
                  )}
                </div>
              )}

              {/* Answer input */}
              <div className="mt-4">
                <textarea
                  className="h-28 w-full resize-y rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-emerald-500"
                  placeholder="Speak or type your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={submitAndNext}
                  disabled={loading}
                  className={["flex-1 cursor-pointer rounded-xl bg-gray-100 px-4 py-2 text-center text-sm font-semibold text-gray-800 hover:bg-gray-200", loading ? "opacity-60" : ""].join(" ")}
                >
                  {loading ? "Submitting..." : "Submit & Next"}
                </button>
                <button
                  onClick={endInterview}
                  className="w-28 cursor-pointer rounded-xl bg-rose-500 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-rose-600"
                >
                  End
                </button>
              </div>

              {error && (
                <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-[12px] text-rose-700">
                  {error}
                </div>
              )}
            </div>

            {/* Progress */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-2 text-[12px] font-semibold text-gray-700">Progress</div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-gray-400" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="mt-1 text-right text-[12px] text-gray-600">{progressPct}%</div>

              {/* History (compact) */}
              {history.length > 0 && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-[12px] font-semibold text-gray-700">Review previous answers</summary>
                  <div className="mt-2 space-y-2">
                    {history.map((h, i) => (
                      <div key={i} className="rounded-lg border border-gray-200 p-3">
                        <div className="text-[12px] font-semibold text-gray-800">Q{i + 1}. {h.question}</div>
                        <div className="mt-1 whitespace-pre-wrap text-[12px] text-gray-700">{h.answer}</div>
                        <div className="mt-1 text-[11px] text-gray-500">
                          {h.tag && <span className="mr-2">tag: {h.tag}</span>}
                          {h.difficulty && <span>difficulty: {h.difficulty}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * FastAPI CORS (add to your server once):
 *
 * from fastapi.middleware.cors import CORSMiddleware
 * app.add_middleware(
 *   CORSMiddleware,
 *   allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
 *   allow_credentials=True,
 *   allow_methods=["*"],
 *   allow_headers=["*"]
 * )
 */
