"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";

// Define type for questions (from API)
interface Question {
  question: string;
  difficulty?: string;
  tag?: string;
  scored?: boolean;
}

interface StartResponse {
  question: string;
  difficulty?: string;
  tag?: string;
  scored?: boolean;
}

interface FinalReport {
  status?: string; // "finished" etc.
  questions_asked?: number;
  report_id?: number;
  score?: number;
  suitability?: string;
  summary?: string;
  scorecard?: Record<string, unknown>;
  strengths?: string[];
  areas_to_improve?: string[];
  next_steps?: string[];
  reasons?: string[];
  [k: string]: unknown;
}

interface AnswerResponse {
  result: boolean;
  next?: Question | null;
  final?: FinalReport | null;
}

const AudioInterviewPage: React.FC = () => {
  // ------- Config -------
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  const DEFAULT_MAX_QUESTIONS = 5;

  // ------- UI / flow state -------
  const [email, setEmail] = useState<string>("");
  const [maxQuestions, setMaxQuestions] = useState<number>(DEFAULT_MAX_QUESTIONS);
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [qIndex, setQIndex] = useState(0); // 0-based index of the *next* question
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ difficulty?: string; tag?: string; scored?: boolean } | null>(null);
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<
    Array<{
      question: string;
      answer: string;
      difficulty?: string;
      tag?: string;
      scored?: boolean;
    }>
  >([]);
  const [questionCache, setQuestionCache] = useState<Question[]>([]); // Cache backend questions
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [finalReport, setFinalReport] = useState<FinalReport | null>(null);

  // Initialize email from localStorage
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("user");
      if (storedData) {
        const user = JSON.parse(storedData);
        if (user?.email) {
          setEmail(user.email);
          console.log("Loaded email from localStorage:", user.email);
        } else {
          console.warn("No email found in localStorage");
        }
      } else {
        console.warn("No user data in localStorage");
      }
    } catch (e) {
      console.error("Failed to parse localStorage:", e);
      setError("Unable to load user data. Please enter your email manually.");
    }
  }, []);

  // Simple timer when "recording"
  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [started]);

  // Log API_BASE for debugging
  useEffect(() => {
    console.log("API_BASE:", API_BASE);
  }, [API_BASE]);

  // ------- API helpers -------
  const startInterview = useCallback(async () => {
    if (!API_BASE) {
      setError("API base URL is not configured.");
      console.error("API_BASE is undefined");
      return;
    }
    if (!email) {
      setError("Please provide a valid email.");
      console.error("Email is empty");
      return;
    }
    setLoading(true);
    setError(null);
    setFinished(false);
    setFinalReport(null);
    try {
      const url = `${API_BASE}/interview/start?email=${encodeURIComponent(email)}&max_questions=${encodeURIComponent(
        String(maxQuestions)
      )}`;
      console.log("Starting interview with URL:", url);
      const res = await fetch(url, { method: "POST" });
      console.log("API response status:", res.status);
      if (!res.ok) throw new Error(`Start failed (${res.status})`);
      const data: StartResponse = await res.json();
      console.log("API response data:", data);
      if (!data.question) throw new Error("No question returned from API");

      setStarted(true);
      setSeconds(0);
      setQIndex(0);
      setHistory([]);
      setAnswer("");
      setCurrentQuestion(data.question);
      setMeta({ difficulty: data.difficulty, tag: data.tag, scored: data.scored });
      setQuestionCache([{ question: data.question, difficulty: data.difficulty, tag: data.tag, scored: data.scored }]);
    } catch (e: any) {
      console.error("Start interview error:", e);
      setError(e?.message || "Failed to start interview.");
      setStarted(false);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, email, maxQuestions]);

  const submitAndNext = useCallback(async () => {
    if (!API_BASE) {
      setError("API base URL is not configured.");
      console.error("API_BASE is undefined");
      return;
    }
    if (!currentQuestion) return;
    setLoading(true);
    setError(null);
    try {
      // Record the answer immediately
      setHistory((h) => [
        ...h,
        { question: currentQuestion, answer: answer.trim(), difficulty: meta?.difficulty, tag: meta?.tag, scored: meta?.scored },
      ]);

      const url = `${API_BASE}/interview/answer?email=${encodeURIComponent(email)}&answer=${encodeURIComponent(
        answer.trim() || "(no answer)"
      )}&question=${encodeURIComponent(currentQuestion)}`;
      console.log("Submitting answer with URL:", url);
      const res = await fetch(url, { method: "POST" });
      console.log("API response status:", res.status);
      if (!res.ok) throw new Error(`Next failed (${res.status})`);

      const data: AnswerResponse = await res.json();
      console.log("API response data:", data);

      // Cache next question (if any)
      if (data.next?.question) {
        setQuestionCache((cache) => [
          ...cache,
          { question: data.next!.question, difficulty: data.next!.difficulty, tag: data.next!.tag, scored: data.next!.scored },
        ]);
      }

      const answeredCount = qIndex + 1; // we just answered currentQuestion

      // ---- PRIORITIZE 'finished' from backend ----
      if (data.final?.status === "finished") {
        // Reflect the just-answered question in progress
        setQIndex(answeredCount);
        setFinalReport(data.final || null);
        setCurrentQuestion(null);
        setMeta(null);
        setStarted(false);
        setFinished(true);
        setAnswer("");
        return;
      }

      // If we have a next question, proceed normally
      if (data.next && data.next.question) {
        setQIndex((i) => i + 1);
        const next = data.next;
        setCurrentQuestion(next.question);
        setMeta({ difficulty: next.difficulty, tag: next.tag, scored: next.scored });
        setAnswer("");
        return;
      }

      // No next question and not explicitly finished: try to keep going if room remains
      if (answeredCount < maxQuestions) {
        console.warn("No next question returned from API, attempting to reuse or fetch new question");
        if (questionCache.length > 0) {
          const cacheIndex = qIndex % questionCache.length; // Cycle through cached questions
          const nextQuestion = questionCache[cacheIndex];
          setQIndex(answeredCount);
          setCurrentQuestion(nextQuestion.question);
          setMeta({ difficulty: nextQuestion.difficulty, tag: nextQuestion.tag, scored: nextQuestion.scored });
          setAnswer("");
          setError("API didn't provide a next question. Reusing a previous one.");
        } else {
          // Fallback to calling /interview/start again
          try {
            const restartUrl = `${API_BASE}/interview/start?email=${encodeURIComponent(
              email
            )}&max_questions=${encodeURIComponent(String(maxQuestions))}`;
            console.log("Fetching new question with URL:", restartUrl);
            const restartRes = await fetch(restartUrl, { method: "POST" });
            console.log("API response status (restart):", restartRes.status);
            if (!restartRes.ok) throw new Error(`Restart failed (${restartRes.status})`);
            const newData: StartResponse = await restartRes.json();
            console.log("API response data (restart):", newData);
            if (!newData.question) throw new Error("No question returned from API");

            setQIndex(answeredCount);
            setCurrentQuestion(newData.question);
            setMeta({ difficulty: newData.difficulty, tag: newData.tag, scored: newData.scored });
            setAnswer("");
            setQuestionCache((cache) => [
              ...cache,
              { question: newData.question, difficulty: newData.difficulty, tag: newData.tag, scored: newData.scored },
            ]);
            setError("API didn't provide a next question. Fetched a new one to continue.");
          } catch (retryError: any) {
            console.error("Failed to fetch new question:", retryError);
            setError(retryError?.message || "Failed to fetch new question. Ending interview.");
            setQIndex(answeredCount);
            setCurrentQuestion(null);
            setMeta(null);
            setStarted(false);
            setFinished(true);
          }
        }
        return;
      }

      // Otherwise we're done due to reaching maxQuestions
      setQIndex(answeredCount);
      setCurrentQuestion(null);
      setMeta(null);
      setStarted(false);
      setFinished(true);
      setAnswer("");
    } catch (e: any) {
      console.error("Submit answer error:", e);
      setError(e?.message || "Failed to fetch next question. Attempting to reuse or fetch new question.");
      const answeredCount = qIndex + 1;

      // Fallback to cached question or restart if we still have room
      if (answeredCount < maxQuestions) {
        if (questionCache.length > 0) {
          const cacheIndex = qIndex % questionCache.length; // Cycle through cached questions
          const nextQuestion = questionCache[cacheIndex];
          setQIndex(answeredCount);
          setCurrentQuestion(nextQuestion.question);
          setMeta({ difficulty: nextQuestion.difficulty, tag: nextQuestion.tag, scored: nextQuestion.scored });
          setAnswer("");
        } else {
          try {
            const restartUrl = `${API_BASE}/interview/start?email=${encodeURIComponent(
              email
            )}&max_questions=${encodeURIComponent(String(maxQuestions))}`;
            console.log("Fetching new question with URL:", restartUrl);
            const restartRes = await fetch(restartUrl, { method: "POST" });
            console.log("API response status (restart):", restartRes.status);
            if (!restartRes.ok) throw new Error(`Restart failed (${restartRes.status})`);
            const newData: StartResponse = await restartRes.json();
            console.log("API response data (restart):", newData);
            if (!newData.question) throw new Error("No question returned from API");

            setQIndex(answeredCount);
            setCurrentQuestion(newData.question);
            setMeta({ difficulty: newData.difficulty, tag: newData.tag, scored: newData.scored });
            setAnswer("");
            setQuestionCache((cache) => [
              ...cache,
              { question: newData.question, difficulty: newData.difficulty, tag: newData.tag, scored: newData.scored },
            ]);
          } catch (retryError: any) {
            console.error("Failed to fetch new question:", retryError);
            setError(retryError?.message || "Failed to fetch new question. Ending interview.");
            setQIndex(answeredCount);
            setCurrentQuestion(null);
            setMeta(null);
            setStarted(false);
            setFinished(true);
          }
        }
      } else {
        setQIndex(answeredCount);
        setCurrentQuestion(null);
        setMeta(null);
        setStarted(false);
        setFinished(true);
      }
    } finally {
      setLoading(false);
    }
  }, [API_BASE, email, answer, currentQuestion, meta, qIndex, maxQuestions, questionCache]);

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
    setQuestionCache([]);
    setError(null);
    setFinished(false);
    setFinalReport(null);
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
      {`Time: ${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`}
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

  const qLabel =
    started && currentQuestion ? `Question ${qIndex + 1} of ${totalQuestions}` : finished ? "Interview Finished" : "";

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
            <div className="grid h-8 w-8 place-items-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
              <MicIcon cls="text-gray-600" />
            </div>
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
              <div className="text-lg font-semibold text-gray-900">Interview Summary</div>
              <div className="mt-3 text-sm text-gray-700">Thanks! Here are the questions you answered:</div>
              <div className="mt-4 space-y-3">
                {history.length === 0 ? (
                  <div className="text-sm text-gray-500">No answers recorded.</div>
                ) : (
                  history.map((h, i) => (
                    <div key={i} className="rounded-lg border border-gray-200 p-3">
                      <div className="text-[13px] font-semibold text-gray-800">
                        Q{i + 1}. {h.question}
                      </div>
                      <div className="mt-1 whitespace-pre-wrap text-[13px] text-gray-700">{h.answer}</div>
                      <div className="mt-1 text-[11px] text-gray-500">
                        {h.difficulty && <span className="mr-2">Difficulty: {h.difficulty}</span>}
                        {h.tag && <span>Tag: {h.tag}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Optional Final Feedback from backend */}
              {finalReport && (
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="text-sm font-semibold text-emerald-900">Automated Feedback</div>
                  <div className="mt-2 space-y-2 text-sm text-emerald-900">
                    {finalReport.summary && <div><span className="font-medium">Summary:</span> {finalReport.summary}</div>}
                    {"score" in finalReport && typeof finalReport.score === "number" && (
                      <div><span className="font-medium">Score:</span> {finalReport.score}</div>
                    )}
                    {finalReport.suitability && (
                      <div><span className="font-medium">Suitability:</span> {finalReport.suitability}</div>
                    )}
                    {Array.isArray(finalReport.strengths) && finalReport.strengths.length > 0 && (
                      <div>
                        <div className="font-medium">Strengths:</div>
                        <ul className="ml-5 list-disc">
                          {finalReport.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {Array.isArray(finalReport.areas_to_improve) && finalReport.areas_to_improve.length > 0 && (
                      <div>
                        <div className="font-medium">Areas to improve:</div>
                        <ul className="ml-5 list-disc">
                          {finalReport.areas_to_improve.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={resetAll}
                  className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200"
                >
                  Reset
                </button>
                <button
                  onClick={startInterview}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Start Again
                </button>
              </div>
            </div>
          </div>
        ) : (
          // READY SCREEN
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-gray-900">Microphone Preview</div>
              <div className="mt-4 rounded-xl border border-gray-200 bg-[#0b1320] p-6 text-center text-gray-300 place-items-center">
                <div className="mx-auto mb-3 grid h-60 w-10 place-items-center rounded-full">
                  <div className="place-items-center rounded-full bg-[#141c2b] w-20">
                    <MicIcon />
                  </div>
                </div>
                <div className="text-[13px] text-gray-300">Microphone will activate when interview starts</div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-gray-900">Interview Details</div>
                <div className="mt-4 space-y-4 text-[13px] text-gray-800">
                  <label className="block text-[13px]">
                    <div className="mb-1 font-semibold text-gray-900">Candidate Email</div>
                    <input
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                    />
                  </label>
                  <label className="block text-[13px]">
                    <div className="mb-1 font-semibold text-gray-900">Max Questions</div>
                    <input
                      type="number"
                      min={1}
                      max={25}
                      className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      value={maxQuestions}
                      onChange={(e) => setMaxQuestions(Number(e.target.value) || DEFAULT_MAX_QUESTIONS)}
                    />
                  </label>
                  <div className="font-semibold text-gray-900">Estimated Duration: 15–20 minutes</div>
                  <div className="text-gray-600">Each question has no time limit, but aim for 2–3 minutes per response.</div>
                  {error && (
                    <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-[12px] text-rose-700">{error}</div>
                  )}
                  <div className="my-2 h-px w-full bg-gray-200" />
                  <div className="font-semibold text-gray-900">Ready to begin?</div>
                  <button
                    onClick={() => {
                      console.log("Start Interview button clicked", { loading, email, API_BASE });
                      startInterview();
                    }}
                    disabled={loading || !email || !API_BASE}
                    className="mt-2 w-full cursor-pointer rounded-xl bg-emerald-600 px-4 py-2 text-center text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {loading ? "Starting..." : "Start Interview"}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-gray-900">Final Checklist</div>
                <div className="mt-3 space-y-2 text-[13px] text-gray-800">
                  <div className="flex items-center gap-2">
                    <Dot />
                    <div>Microphone is working</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dot />
                    <div>Quiet environment ready</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dot />
                    <div>Good lighting setup</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dot />
                    <div>CV ready for reference</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="relative rounded-xl border border-gray-200 bg-[#0b1320] p-6 text-center text-gray-300">
              <div className="absolute left-3 top-3">
                <RecPill />
              </div>
              <div className="mx-auto mb-3 grid h-60 w-12 place-items-center">
                <div className="h-12 w-12 place-items-center rounded-full bg-[#141c2b]">
                  <MicIcon />
                </div>
              </div>
              <div className="text-[13px] text-gray-300">Your audio feed</div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="text-base font-semibold text-gray-900">{qLabel}</div>
                <TimeChip small />
              </div>

              <div className="mt-4 min-h-[88px] rounded-xl border border-blue-200 bg-blue-50 p-4 text-[14px] leading-6 text-gray-900">
                {currentQuestion}
              </div>

              {(meta?.tag || meta?.difficulty) && (
                <div className="mt-2 flex gap-2 text-[11px] text-gray-600">
                  {meta?.tag && <span className="rounded-full bg-gray-100 px-2 py-0.5">tag: {meta.tag}</span>}
                  {meta?.difficulty && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5">difficulty: {meta.difficulty}</span>
                  )}
                </div>
              )}

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
                  onClick={() => {
                    console.log("Submit & Next button clicked", { qIndex, totalQuestions, currentQuestion });
                    submitAndNext();
                  }}
                  disabled={loading}
                  className={[
                    "flex-1 cursor-pointer rounded-xl bg-gray-100 px-4 py-2 text-center text-sm font-semibold text-gray-800 hover:bg-gray-200",
                    loading ? "opacity-60" : "",
                  ].join(" ")}
                >
                  {loading ? "Submitting..." : "Submit & Next"}
                </button>
                <button
                  onClick={() => {
                    console.log("End Interview button clicked");
                    endInterview();
                  }}
                  className="w-28 cursor-pointer rounded-xl bg-rose-500 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-rose-600"
                >
                  End
                </button>
              </div>

              {error && (
                <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-[12px] text-rose-700">{error}</div>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-2 text-[12px] font-semibold text-gray-700">Progress</div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-gray-400" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="mt-1 text-right text-[12px] text-gray-600">{progressPct}%</div>

              {history.length > 0 && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-[12px] font-semibold text-gray-700">
                    Review previous answers
                  </summary>
                  <div className="mt-2 space-y-2">
                    {history.map((h, i) => (
                      <div key={i} className="rounded-lg border border-gray-200 p-3">
                        <div className="text-[12px] font-semibold text-gray-800">
                          Q{i + 1}. {h.question}
                        </div>
                        <div className="mt-1 whitespace-pre-wrap text-[12px] text-gray-700">{h.answer}</div>
                        <div className="mt-1 text-[11px] text-gray-500">
                          {h.difficulty && <span className="mr-2">Difficulty: {h.difficulty}</span>}
                          {h.tag && <span>Tag: {h.tag}</span>}
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
};

export default AudioInterviewPage;
