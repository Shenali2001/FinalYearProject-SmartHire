"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ---------------- Types ---------------- */
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
  status?: string;
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

/* --------- Vendor-prefixed browser APIs typing --------- */
declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
    webkitSpeechGrammarList?: any;
    SpeechGrammarList?: any;
    webkitAudioContext?: typeof AudioContext;
  }
}

const AudioInterviewPage: React.FC = () => {
  /* ---------------- Config ---------------- */
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  const MAX_QUESTIONS = 10; // fixed

  /* ---------------- UI / Flow State ---------------- */
  const [email, setEmail] = useState<string>("");
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ difficulty?: string; tag?: string; scored?: boolean } | null>(null);
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<
    Array<{ question: string; answer: string; difficulty?: string; tag?: string; scored?: boolean }>
  >([]);
  const [questionCache, setQuestionCache] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [finalReport, setFinalReport] = useState<FinalReport | null>(null);

  /* ---------------- Hydration Guard ---------------- */
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);

  /* ---------------- TTS (Text-to-Speech) ---------------- */
  const [ttsSupported, setTtsSupported] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");
  const [ttsRate, setTtsRate] = useState(1.0);
  const [ttsPitch, setTtsPitch] = useState(1.0);
  const [ttsVolume, setTtsVolume] = useState(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    const supported = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    setTtsSupported(!!supported);
  }, [hydrated]);

  const loadVoices = useCallback(() => {
    if (!ttsSupported) return;
    const list = window.speechSynthesis.getVoices();
    if (list.length) {
      setVoices(list);
      if (!selectedVoiceURI) {
        const preferred =
          list.find((v) => v.default && /^en(-|_|$)/i.test(v.lang)) ||
          list.find((v) => /^en(-|_|$)/i.test(v.lang)) ||
          list[0];
        if (preferred) setSelectedVoiceURI(preferred.voiceURI);
      }
    }
  }, [ttsSupported, selectedVoiceURI]);

  useEffect(() => {
    if (!ttsSupported) return;
    loadVoices();

    const handler = () => loadVoices();
    if ("onvoiceschanged" in window.speechSynthesis) {
      (window.speechSynthesis as SpeechSynthesis & {
        onvoiceschanged: ((this: SpeechSynthesis, ev: Event) => any) | null;
      }).onvoiceschanged = handler;
    }
    const iv = setInterval(() => {
      if (window.speechSynthesis.getVoices().length) {
        loadVoices();
        clearInterval(iv);
      }
    }, 300);
    const stopPoll = setTimeout(() => clearInterval(iv), 4000);

    return () => {
      clearInterval(iv);
      clearTimeout(stopPoll);
      if ("onvoiceschanged" in window.speechSynthesis) {
        (window.speechSynthesis as SpeechSynthesis & {
          onvoiceschanged: ((this: SpeechSynthesis, ev: Event) => any) | null;
        }).onvoiceschanged = null;
      }
    };
  }, [ttsSupported, loadVoices]);

  const enableTTS = useCallback(() => {
    if (!ttsSupported) return;
    try { for (let i = 0; i < 3; i++) window.speechSynthesis.resume(); } catch {}
    setTtsEnabled(true);
  }, [ttsSupported]);

  const cancelSpeech = useCallback(() => {
    if (!ttsSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [ttsSupported]);

  type SpeakOpts = { onend?: () => void };
  const speakText = useCallback(
    async (text: string, opts?: SpeakOpts) => {
      if (!ttsSupported || !ttsEnabled || !text) {
        // still unlock flow
        opts?.onend?.();
        return;
      }

      let tries = 0;
      while (tries < 6 && window.speechSynthesis.getVoices().length === 0) {
        await new Promise((r) => setTimeout(r, 300));
        tries++;
      }

      window.speechSynthesis.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      const voice = voices.find((v) => v.voiceURI === selectedVoiceURI) || voices[0];
      if (voice) utter.voice = voice;
      utter.rate = Math.max(0.5, Math.min(2, ttsRate));
      utter.pitch = Math.max(0, Math.min(2, ttsPitch));
      utter.volume = Math.max(0, Math.min(1, ttsVolume));

      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => { setIsSpeaking(false); opts?.onend?.(); };
      utter.onerror = (e: any) => { setIsSpeaking(false); if (e?.error !== "interrupted" && e?.error !== "canceled") setError(`TTS error: ${e?.error || "unknown"}`); opts?.onend?.(); };

      window.speechSynthesis.speak(utter);
    },
    [ttsSupported, ttsEnabled, voices, selectedVoiceURI, ttsRate, ttsPitch, ttsVolume]
  );

  /* ---------------- STT (Speech-to-Text) + Mic Meter ---------------- */

  const sriLankaSeedLexicon = useRef<string[]>([
    "Colombo","Kandy","Gampaha","Galle","Matara","Negombo","Kurunegala","Ratnapura","Badulla","Anuradhapura",
    "Jaffna","Kalutara","Panadura","Maharagama","Dehiwala","Mount Lavinia","Moratuwa","Wattala","Kelaniya",
    "Nugegoda","Battaramulla","Homagama","Kadawatha","Ja-Ela","Ragama","Katunayake","Piliyandala",
    "Dasun","Kasun","Nuwan","Dinesh","Lakshan","Lahiru","Tharindu","Sandun","Supun","Isuru","Dinuka",
    "Ishara","Chamara","Thilina","Pradeep","Pramod","Buddhika","Roshan","Dilshan","Sachini","Nadeesha","Kavindu"
  ]).current;

  const [srSupported, setSrSupported] = useState(false);
  const [srListening, setSrListening] = useState(false);
  const [srInterim, setSrInterim] = useState("");
  const [srLang, setSrLang] = useState("en-LK");
  const srKeepAliveRef = useRef(false);
  const recRef = useRef<any | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  // Live mic meter
  const [micActive, setMicActive] = useState(false);
  const [micLevel, setMicLevel] = useState(0); // 0..1
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const startMeter = useCallback(async () => {
    try {
      if (!micStreamRef.current) {
        micStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      if (!audioCtxRef.current) {
        const AC = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AC();
      }
      const ctx = audioCtxRef.current!;
      const src = ctx.createMediaStreamSource(micStreamRef.current!);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.85;
      src.connect(analyser);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      setMicActive(true);

      const loop = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        const lvl = Math.min(1, Math.max(0, (rms - 0.02) * 3)); // noise gate
        setMicLevel(lvl);
        rafIdRef.current = requestAnimationFrame(loop);
      };
      rafIdRef.current = requestAnimationFrame(loop);
    } catch (e: any) {
      setError(e?.message || "Mic level meter failed.");
    }
  }, []);

  const stopMeter = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    setMicActive(false);
    setMicLevel(0);
    try { analyserRef.current?.disconnect(); } catch {}
    analyserRef.current = null;
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const support = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    setSrSupported(support);
  }, [hydrated]);

  const enableMic = useCallback(async () => {
    if (!hydrated) return;
    try {
      micStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e: any) {
      setError(e?.message || "Microphone permission denied.");
    }
  }, [hydrated]);

  // fuzzy autocorrect + candidate extraction
  const norm = (s: string) => s.normalize("NFC").toLowerCase();
  function levenshtein(a: string, b: string): number {
    const m = a.length, n = b.length;
    const dp = new Array(n + 1);
    for (let j = 0; j <= n; j++) dp[j] = j;
    for (let i = 1; i <= m; i++) {
      let prev = dp[0];
      dp[0] = i;
      for (let j = 1; j <= n; j++) {
        const tmp = dp[j];
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
        prev = tmp;
      }
    }
    return dp[n];
  }
  function autoCorrectWithLexicon(text: string, lexicon: string[]) {
    if (!lexicon.length) return text;
    const normLex = lexicon.map((w) => ({ raw: w, n: norm(w) }));
    return text.replace(/\p{L}+/gu, (token) => {
      const nt = norm(token);
      let best: { raw: string; n: string } | null = null;
      let bestDist = Infinity;
      for (const cand of normLex) {
        const d = levenshtein(nt, cand.n);
        if (d < bestDist) { best = cand; bestDist = d; }
      }
      const thresh = nt.length <= 4 ? 1 : nt.length <= 7 ? 2 : 3;
      if (best && bestDist <= thresh) return best.raw;
      return token;
    });
  }
  function extractCandidates(text: string): string[] {
    const out = new Set<string>();
    const words = text.match(/\b[\p{L}][\p{L}\-']+\b/gu) || [];
    for (const w of words) {
      if (/^[A-Z]/.test(w)) out.add(w);
      if (/[\'\-]/.test(w)) out.add(w);
      if (/(gama|goda|gala|giriya|pitiya|dala|pura|kotte|kanda|watta|wela|wewa)$/i.test(w)) out.add(w);
    }
    return Array.from(out);
  }

  const autoLexicon = useMemo(() => {
    const pool: string[] = [
      ...sriLankaSeedLexicon,
      ...(currentQuestion ? extractCandidates(currentQuestion) : []),
      ...history.flatMap((h) => extractCandidates(h.question)),
      ...history.flatMap((h) => extractCandidates(h.answer)),
      ...extractCandidates(answer),
    ];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const w of pool) {
      const n = norm(w);
      if (!seen.has(n) && w.length >= 3) {
        seen.add(n);
        out.push(w);
      }
      if (out.length >= 120) break;
    }
    return out;
  }, [sriLankaSeedLexicon, currentQuestion, history, answer]);

  /* ---------------- Lock while TTS plays ---------------- */

  const [questionLocked, setQuestionLocked] = useState(false);
  const questionLockedRef = useRef(false);
  const setLocked = useCallback((val: boolean) => {
    setQuestionLocked(val);
    questionLockedRef.current = val;
  }, []);

  const lockTimerRef = useRef<number | null>(null);

  const estimateReadMs = useCallback(
    (text: string) => {
      const words = text.trim().split(/\s+/).length;
      const baseWPM = 160;
      const rate = Math.max(0.5, Math.min(2, ttsRate || 1));
      const ms = (words / (baseWPM * rate)) * 60_000;
      return Math.min(12_000, Math.max(1500, Math.round(ms)));
    },
    [ttsRate]
  );

  /* ---------------- STT start/stop ---------------- */

  const startListening = useCallback(async () => {
    if (!srSupported || srListening || !hydrated || questionLockedRef.current || isFetchingNext) return;

    try {
      if (!micStreamRef.current) {
        try {
          micStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (e: any) {
          setError(e?.message || "Microphone permission denied.");
          return;
        }
      }

      const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!Ctor) return;
      const recog = new Ctor();
      recRef.current = recog;

      recog.lang = srLang;
      recog.continuous = true;
      recog.interimResults = true;
      recog.maxAlternatives = 1;

      try {
        const GrammarListCtor = window.SpeechGrammarList || window.webkitSpeechGrammarList;
        if (GrammarListCtor && autoLexicon.length) {
          const list = new GrammarListCtor();
          const esc = (w: string) => w.replace(/([\\;=|])/g, "\\$1");
          const lex = autoLexicon.slice(0, 120);
          const jsgf = `#JSGF V1.0; grammar hints; public <hint> = ${lex.map(esc).join(" | ")} ;`;
          list.addFromString(jsgf, 1.0);
          recog.grammars = list;
        }
      } catch { /* optional */ }

      srKeepAliveRef.current = true;
      setSrInterim("");

      recog.onstart = () => { setSrListening(true); startMeter(); };
      recog.onresult = (e: any) => {
        let interim = "";
        let finalChunk = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal) finalChunk += res[0].transcript;
          else interim += res[0].transcript;
        }
        if (finalChunk) {
          const corrected = autoCorrectWithLexicon(finalChunk, autoLexicon);
          setAnswer((prev) => (prev ? prev.replace(/\s*$/, " ") : "") + corrected.trim());
        }
        setSrInterim(interim);
      };
      recog.onerror = (e: any) => {
        const code = e?.error;
        if (code === "no-speech") setError("No speech detected. Try again.");
        else if (code === "audio-capture") setError("No microphone found or blocked.");
        else if (code === "not-allowed" || code === "service-not-allowed") setError("Mic permission denied or blocked.");
        else setError(`Speech recognition error: ${code || "unknown"}`);
      };
      recog.onend = () => {
        setSrListening(false);
        setSrInterim("");
        stopMeter();
        if (srKeepAliveRef.current && !questionLockedRef.current && !isFetchingNext) {
          try { recog.start(); } catch {}
        }
      };

      recog.start();
    } catch (err: any) {
      setError(err?.message || "Failed to start speech recognition.");
      setSrListening(false);
      srKeepAliveRef.current = false;
      stopMeter();
    }
  }, [srSupported, srListening, hydrated, srLang, autoLexicon, isFetchingNext, startMeter, stopMeter]);

  const stopListening = useCallback(() => {
    srKeepAliveRef.current = false;
    setSrListening(false);
    setSrInterim("");
    try {
      recRef.current?.stop?.();
      recRef.current?.abort?.();
    } catch {}
    stopMeter();
  }, [stopMeter]);

  useEffect(() => {
    return () => {
      stopListening();
      try { micStreamRef.current?.getTracks().forEach((t) => t.stop()); } catch {}
    };
  }, [stopListening]);

  /* ---------------- Lock & speak question each time ---------------- */

  const lockAndReadQuestion = useCallback(async (text: string) => {
    stopListening();
    cancelSpeech();

    setLocked(true);

    const unlock = () => {
      setLocked(false);
      if (srSupported && !isFetchingNext) {
        try { startListening(); } catch {}
      }
    };

    if (ttsSupported && ttsEnabled) {
      await speakText(text, { onend: unlock });
    } else {
      const ms = estimateReadMs(text);
      if (lockTimerRef.current) window.clearTimeout(lockTimerRef.current);
      lockTimerRef.current = window.setTimeout(() => {
        lockTimerRef.current = null;
        unlock();
      }, ms) as unknown as number;
    }
  }, [stopListening, cancelSpeech, ttsSupported, ttsEnabled, speakText, estimateReadMs, startListening, srSupported, setLocked, isFetchingNext]);

  const lastSpokenRef = useRef<string | null>(null);
  useEffect(() => {
    if (!started || !currentQuestion) return;
    if (lastSpokenRef.current === currentQuestion) return;
    lastSpokenRef.current = currentQuestion;
    lockAndReadQuestion(currentQuestion);
  }, [started, currentQuestion, lockAndReadQuestion]);

  useEffect(() => {
    if (!started) {
      setLocked(false);
      if (lockTimerRef.current) {
        window.clearTimeout(lockTimerRef.current);
        lockTimerRef.current = null;
      }
    }
  }, [started, setLocked]);

  /* ---------------- Init & Timer ---------------- */
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("user");
      if (storedData) {
        const user = JSON.parse(storedData);
        if (user?.email) setEmail(user.email);
      }
    } catch {
      setError("Unable to load user data. Please enter your email manually.");
    }
  }, []);

  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [started]);

  /* ---------------- API Helpers ---------------- */
  const startInterview = useCallback(async () => {
    if (!API_BASE) { setError("API base URL is not configured."); return; }
    if (!email) { setError("Please provide a valid email."); return; }
    setLoading(true);
    setError(null);
    setFinished(false);
    setFinalReport(null);
    try {
      const url = `${API_BASE}/interview/start?email=${encodeURIComponent(email)}&max_questions=${encodeURIComponent(String(MAX_QUESTIONS))}`;
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) throw new Error(`Start failed (${res.status})`);
      const data: StartResponse = await res.json();
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
      setError(e?.message || "Failed to start interview.");
      setStarted(false);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, email]);

  const submitAndNext = useCallback(async () => {
    if (!API_BASE) { setError("API base URL is not configured."); return; }
    if (!currentQuestion) return;
    if (questionLocked) { setError("Please wait until the question finishes playing."); return; }

    setLoading(true);
    setIsFetchingNext(true);
    setError(null);
    try {
      setHistory((h) => [
        ...h,
        { question: currentQuestion, answer: answer.trim(), difficulty: meta?.difficulty, tag: meta?.tag, scored: meta?.scored },
      ]);

      const url = `${API_BASE}/interview/answer?email=${encodeURIComponent(email)}&answer=${encodeURIComponent(
        answer.trim() || "(no answer)"
      )}&question=${encodeURIComponent(currentQuestion)}`;
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) throw new Error(`Next failed (${res.status})`);

      const data: AnswerResponse = await res.json();

      cancelSpeech();
      stopListening();

      if (data.next?.question) {
        setQuestionCache((cache) => [
          ...cache,
          { question: data.next!.question, difficulty: data.next!.difficulty, tag: data.next!.tag, scored: data.next!.scored },
        ]);
      }

      const answeredCount = qIndex + 1;

      if (data.final?.status === "finished") {
        setQIndex(answeredCount);
        setFinalReport(data.final || null);
        setCurrentQuestion(null);
        setMeta(null);
        setStarted(false);
        setFinished(true);
        setAnswer("");
        return;
      }

      if (data.next && data.next.question) {
        setQIndex((i) => i + 1);
        const next = data.next;
        setCurrentQuestion(next.question);
        setMeta({ difficulty: next.difficulty, tag: next.tag, scored: next.scored });
        setAnswer("");
        return;
      }

      if (answeredCount < MAX_QUESTIONS) {
        if (questionCache.length > 0) {
          const cacheIndex = qIndex % questionCache.length;
          const nextQuestion = questionCache[cacheIndex];
          setQIndex(answeredCount);
          setCurrentQuestion(nextQuestion.question);
          setMeta({ difficulty: nextQuestion.difficulty, tag: nextQuestion.tag, scored: nextQuestion.scored });
          setAnswer("");
          setError("API didn't provide a next question. Reusing a previous one.");
          return;
        } else {
          try {
            const restartUrl = `${API_BASE}/interview/start?email=${encodeURIComponent(
              email
            )}&max_questions=${encodeURIComponent(String(MAX_QUESTIONS))}`;
            const restartRes = await fetch(restartUrl, { method: "POST" });
            if (!restartRes.ok) throw new Error(`Restart failed (${restartRes.status})`);
            const newData: StartResponse = await restartRes.json();
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
            return;
          } catch (retryError: any) {
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
        setAnswer("");
      }
    } catch (e: any) {
      setError(e?.message || "Failed to fetch next question.");
      const answeredCount = qIndex + 1;

      if (answeredCount < MAX_QUESTIONS) {
        if (questionCache.length > 0) {
          const cacheIndex = qIndex % questionCache.length;
          const nextQuestion = questionCache[cacheIndex];
          setQIndex(answeredCount);
          setCurrentQuestion(nextQuestion.question);
          setMeta({ difficulty: nextQuestion.difficulty, tag: nextQuestion.tag, scored: nextQuestion.scored });
          setAnswer("");
        } else {
          try {
            const restartUrl = `${API_BASE}/interview/start?email=${encodeURIComponent(
              email
            )}&max_questions=${encodeURIComponent(String(MAX_QUESTIONS))}`;
            const restartRes = await fetch(restartUrl, { method: "POST" });
            if (!restartRes.ok) throw new Error(`Restart failed (${restartRes.status})`);
            const newData: StartResponse = await restartRes.json();
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
      setIsFetchingNext(false);
      setLoading(false);
    }
  }, [API_BASE, email, answer, currentQuestion, meta, qIndex, questionCache, questionLocked, cancelSpeech, stopListening]);

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
    setIsSpeaking(false);
    setIsFetchingNext(false);
    cancelSpeech();
    stopListening();
    setLocked(false);
    if (lockTimerRef.current) {
      window.clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }
  }, [cancelSpeech, stopListening, setLocked]);

  /* ---------------- Derived ---------------- */
  const totalQuestions = MAX_QUESTIONS;
  const progressPct = Math.min(100, Math.round((qIndex / totalQuestions) * 100));
  const qLabel = started && currentQuestion ? `Question ${qIndex + 1} of ${totalQuestions}` : finished ? "Interview Finished" : "";

  /* ---------------- UI atoms ---------------- */
  const TimeChip = ({ small = false }: { small?: boolean }) => (
    <div className={["rounded-full bg-gray-100 text-gray-700", small ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"].join(" ")}>
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

  // ✅ Mic animation ONLY when output speaking OR input level above gate
  const MicBubble: React.FC<{ outSpeaking: boolean; level: number }> = ({ outSpeaking, level }) => {
    const voiceLevel = Math.max(0, Math.min(1, level));
    const talking = voiceLevel > 0.06; // tweakable gate
    const active = outSpeaking || talking;

    const scale = outSpeaking ? 1.1 : (talking ? 1 + voiceLevel * 0.35 : 1);
    const glow = outSpeaking ? 0.25 : (talking ? 0.10 + voiceLevel * 0.25 : 0);

    return (
      <div className="relative h-20 w-20">
        {active && (
          <>
            <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" aria-hidden="true" />
            <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" style={{ animationDelay: "180ms" }} aria-hidden="true" />
          </>
        )}
        <div
          className={`relative grid h-20 w-20 place-items-center rounded-full bg-[#141c2b] ring-1 ${active ? "ring-emerald-400/50" : "ring-white/10"}`}
          style={{ boxShadow: active ? `0 0 0 8px rgba(16,185,129,${glow})` : undefined, transition: "box-shadow 120ms linear" }}
        >
          <div
            className={`grid h-12 w-12 place-items-center rounded-full ${active ? "bg-emerald-500/10" : "bg-[#111827]"}`}
            style={{ transform: `scale(${scale})`, transition: "transform 100ms linear" }}
          >
            <MicIcon cls={active ? "text-emerald-400" : "text-gray-300"} />
          </div>
        </div>
      </div>
    );
  };

  const SoundIcon = ({ cls = "text-gray-600" }: { cls?: string }) => (
    <svg className={cls} width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 10v4h4l5 4V6l-5 4H4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 8a5 5 0 010 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
  const ReplayIcon = ({ cls = "text-gray-600" }: { cls?: string }) => (
    <svg className={cls} width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 5V2L8 6l4 4V7a5 5 0 11-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const Dot = ({ color = "bg-emerald-500" }: { color?: string }) => <div className={["h-2 w-2 rounded-full", color].join(" ")} />;

  /* ---------------- Overlay while fetching next question ---------------- */
  const FetchingOverlay: React.FC<{ visible: boolean }> = ({ visible }) => {
    if (!visible) return null;
    return (
      <div
        className="pointer-events-auto absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px]"
        aria-live="polite"
        aria-busy="true"
        role="status"
      >
        <div className="flex flex-col items-center gap-3 text-gray-800">
          <div className="h-10 w-10 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" aria-hidden="true" />
          <div className="text-sm font-semibold">Preparing your next question…</div>
          <div className="text-xs text-gray-600">Analyzing your response and generating a tailored follow-up</div>
          <div className="mt-1 flex items-center gap-1" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-gray-600 animate-bounce" />
            <span className="h-2 w-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="h-2 w-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  };

  /* ---------------- Render ---------------- */
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

            {/* TTS toggle */}
            <button
              onClick={() => {
                if (!hydrated || !ttsSupported) return;
                if (!ttsEnabled) enableTTS(); else cancelSpeech();
                setTtsEnabled((v) => !v);
              }}
              className={[
                "grid h-8 place-items-center rounded-lg border px-3 text-xs font-semibold",
                hydrated && ttsEnabled ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-600",
              ].join(" ")}
              title={!hydrated ? "Initializing…" : ttsSupported ? (ttsEnabled ? "Mute" : "Enable Read Aloud") : "TTS not supported on this browser"}
              disabled={!hydrated || !ttsSupported}
            >
              <div className="flex items-center gap-2">
                <SoundIcon cls={hydrated && ttsEnabled ? "text-emerald-700" : "text-gray-500"} />
                <span>{hydrated ? (ttsEnabled ? (isSpeaking ? "Speaking…" : "Read Aloud") : "Enable Voice") : "Initializing…"}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      {!started ? (
        finished ? (
          /* -------- FINISHED SCREEN -------- */
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
                      <div className="text-[13px] font-semibold text-gray-800">Q{i + 1}. {h.question}</div>
                      <div className="mt-1 whitespace-pre-wrap text-[13px] text-gray-700">{h.answer}</div>
                    </div>
                  ))
                )}
              </div>

              {finalReport && (
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="text-sm font-semibold text-emerald-900">Automated Feedback</div>
                  <div className="mt-2 space-y-2 text-sm text-emerald-900">
                    {finalReport.summary && <div><span className="font-medium">Summary:</span> {finalReport.summary}</div>}
                    {"score" in finalReport && typeof finalReport.score === "number" && <div><span className="font-medium">Score:</span> {finalReport.score}</div>}
                    {finalReport.suitability && <div><span className="font-medium">Suitability:</span> {finalReport.suitability}</div>}
                    {Array.isArray(finalReport.strengths) && finalReport.strengths.length > 0 && (
                      <div>
                        <div className="font-medium">Strengths:</div>
                        <ul className="ml-5 list-disc">{finalReport.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                      </div>
                    )}
                    {Array.isArray(finalReport.areas_to_improve) && finalReport.areas_to_improve.length > 0 && (
                      <div>
                        <div className="font-medium">Areas to improve:</div>
                        <ul className="ml-5 list-disc">{finalReport.areas_to_improve.map((s, i) => <li key={i}>{s}</li>)}</ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button onClick={resetAll} className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200">Reset</button>
                <button onClick={startInterview} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Start Again</button>
              </div>
            </div>
          </div>
        ) : (
          /* -------- READY SCREEN -------- */
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-gray-900">Microphone Preview</div>
              <div className="mt-4 rounded-xl border border-gray-200 bg-[#0b1320] p-6 text-center text-gray-300 place-items-center">
                <div className="mx-auto mb-3 grid h-60 w-full place-items-center">
                  <MicBubble outSpeaking={isSpeaking} level={srListening ? micLevel : 0} />
                </div>
                <div className="text-[13px] text-gray-300">Microphone will activate when interview starts</div>
              </div>

              {/* TTS + STT Controls */}
              {!hydrated ? (
                <div className="mt-3 h-10 w-full animate-pulse rounded-lg bg-gray-100" />
              ) : (
                <>
                  {!ttsSupported && (
                    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-800">
                      Your browser doesn't support Text-to-Speech. Try Chrome or Edge.
                    </div>
                  )}

                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                    {ttsSupported && (
                      <>
                        <label className="block text-[13px]">
                          <div className="mb-1 font-semibold text-gray-900">Voice</div>
                          <select
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                            value={selectedVoiceURI}
                            onChange={(e) => setSelectedVoiceURI(e.target.value)}
                          >
                            {voices.map((v) => (
                              <option key={v.voiceURI} value={v.voiceURI}>
                                {v.name} ({v.lang})
                              </option>
                            ))}
                            {voices.length === 0 && <option value="">Default</option>}
                          </select>
                        </label>
                        <label className="block text-[13px]">
                          <div className="mb-1 font-semibold text-gray-900">Rate</div>
                          <input type="range" min={0.5} max={2} step={0.1} value={ttsRate} onChange={(e) => setTtsRate(Number(e.target.value))} />
                        </label>
                        <label className="block text-[13px]">
                          <div className="mb-1 font-semibold text-gray-900">Pitch</div>
                          <input type="range" min={0} max={2} step={0.1} value={ttsPitch} onChange={(e) => setTtsPitch(Number(e.target.value))} />
                        </label>
                        <label className="block text-[13px] md:col-span-3">
                          <div className="mb-1 font-semibold text-gray-900">Volume</div>
                          <input type="range" min={0} max={1} step={0.05} value={ttsVolume} onChange={(e) => setTtsVolume(Number(e.target.value))} />
                        </label>
                        <button
                          onClick={enableTTS}
                          disabled={!ttsSupported}
                          className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60 md:col-span-3"
                        >
                          {ttsEnabled ? "Voice Enabled ✓" : "Enable Voice (unlock sound)"}
                        </button>
                      </>
                    )}

                    {!srSupported ? (
                      <div className="md:col-span-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-800">
                        Voice input isn’t supported on this browser. Chrome/Edge Desktop & Android are best.
                      </div>
                    ) : (
                      <>
                        <label className="block text-[13px] md:col-span-2">
                          <div className="mb-1 font-semibold text-gray-900">Speech Recognition Language</div>
                          <select
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                            value={srLang}
                            onChange={(e) => setSrLang(e.target.value)}
                          >
                            <option value="en-LK">English (Sri Lanka)</option>
                            <option value="en-US">English (US)</option>
                            <option value="en-GB">English (UK)</option>
                            <option value="en-AU">English (Australia)</option>
                            <option value="si-LK">Sinhala (Sri Lanka)</option>
                            <option value="ta-LK">Tamil (Sri Lanka)</option>
                          </select>
                        </label>
                        <div className="flex items-end gap-2 md:col-span-1">
                          <button
                            onClick={enableMic}
                            className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
                          >
                            Enable Mic
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
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
                  {error && <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-[12px] text-rose-700">{error}</div>}
                  <div className="my-2 h-px w-full bg-gray-200" />
                  <div className="font-semibold text-gray-900">Ready to begin?</div>
                  <button
                    onClick={startInterview}
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
        /* -------- ACTIVE INTERVIEW -------- */
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="relative rounded-xl border border-gray-200 bg-[#0b1320] p-6 text-center text-gray-300">
              <div className="absolute left-3 top-3"><RecPill /></div>
              <div className="mx-auto mb-3 grid h-60 w-full place-items-center">
                <MicBubble outSpeaking={isSpeaking} level={srListening ? micLevel : 0} />
              </div>
              <div className="text-[13px] text-gray-300">Your audio feed</div>
            </div>
          </div>

          <div className="space-y-6">
            <div
              className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              aria-busy={isFetchingNext ? true : undefined}
            >
              <FetchingOverlay visible={isFetchingNext} />

              <div className="flex items-start justify-between">
                <div className="text-base font-semibold text-gray-900">{qLabel}</div>
                <div className="flex items-center gap-2">
                  <TimeChip small />

                  <button
                    onClick={() => { startListening(); }}
                    disabled={!hydrated || !srSupported || srListening || questionLocked || isFetchingNext}
                    className="grid h-7 place-items-center rounded-lg border border-gray-200 px-2 text-[11px] text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    title={
                      isFetchingNext
                        ? "Preparing your next question…"
                        : questionLocked
                        ? "Please listen to the question first"
                        : (!hydrated ? "Initializing…" : srSupported ? "Start speaking" : "Not supported on this browser")
                    }
                  >
                    Start Speaking
                  </button>
                  <button
                    onClick={stopListening}
                    disabled={!hydrated || !srSupported || !srListening || isFetchingNext}
                    className="grid h-7 place-items-center rounded-lg border border-gray-200 px-2 text-[11px] text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    title={!hydrated ? "Initializing…" : "Stop speech capture"}
                  >
                    Stop
                  </button>

                  <button
                    onClick={() => { if (currentQuestion) { lockAndReadQuestion(currentQuestion); } }}
                    disabled={!hydrated || !currentQuestion || isFetchingNext}
                    className="grid h-7 place-items-center rounded-lg border border-gray-200 px-2 text-[11px] text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    title={!hydrated ? "Initializing…" : "Replay question (locks answering)"}
                  >
                    <div className="flex items-center gap-1"><ReplayIcon /><span>Replay</span></div>
                  </button>
                </div>
              </div>

              <div className={`mt-4 min-h-[88px] rounded-xl border p-4 text-[14px] leading-6 text-gray-900 ${isFetchingNext ? "border-gray-200 bg-gray-50 animate-pulse" : "border-blue-200 bg-blue-50"}`}>
                {isFetchingNext ? "Generating the next question…" : currentQuestion}
              </div>

              {/* Removed tag/difficulty chips */}

              <div className="mt-4 relative">
                <textarea
                  className={`h-28 w-full resize-y rounded-xl border p-3 text-sm outline-none ${
                    questionLocked || isFetchingNext ? "border-amber-300 bg-amber-50 text-gray-500" : "border-gray-300 focus:border-emerald-500"
                  }`}
                  placeholder={
                    isFetchingNext
                      ? "Please wait—your next question is on the way…"
                      : (questionLocked ? "Please wait—listening will start after the question finishes…" : "Speak or type your answer here...")
                  }
                  value={answer}
                  onChange={(e) => !(questionLocked || isFetchingNext) && setAnswer(e.target.value)}
                  readOnly={questionLocked || isFetchingNext}
                />
                {(questionLocked || isFetchingNext) && (
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-amber-200/60" />
                )}
                {!!srInterim && !(questionLocked || isFetchingNext) && (
                  <div className="mt-2 text-[12px] italic text-gray-500">
                    Live transcript: {srInterim}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={submitAndNext}
                  disabled={loading || questionLocked || isFetchingNext}
                  className={[
                    "flex-1 cursor-pointer rounded-xl px-4 py-2 text-center text-sm font-semibold",
                    (loading || questionLocked || isFetchingNext)
                      ? "bg-gray-100 text-gray-500 opacity-60"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200",
                  ].join(" ")}
                  title={
                    isFetchingNext
                      ? "Preparing your next question…"
                      : (questionLocked ? "Please wait until the question finishes" : "Submit your answer and go next")
                  }
                >
                  {isFetchingNext ? "Fetching next…" : (loading ? "Submitting..." : "Submit & Next")}
                </button>
              </div>

              {questionLocked && !isFetchingNext && (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-800">
                  Please listen to the question. Answer input will unlock automatically.
                </div>
              )}
              {error && (
                <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-[12px] text-rose-700">
                  {error}
                </div>
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
                  <summary className="cursor-pointer text-[12px] font-semibold text-gray-700">Review previous answers</summary>
                  <div className="mt-2 space-y-2">
                    {history.map((h, i) => (
                      <div key={i} className="rounded-lg border border-gray-200 p-3">
                        <div className="text-[12px] font-semibold text-gray-800">Q{i + 1}. {h.question}</div>
                        <div className="mt-1 whitespace-pre-wrap text-[12px] text-gray-700">{h.answer}</div>
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
