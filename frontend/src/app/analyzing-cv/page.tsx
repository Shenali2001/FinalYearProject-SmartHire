// "use client";
// import React from "react";
// import Image from "next/image";

// export default function AnalyzingPage() {
//   const progress = 17; // set dynamically if you like
  
//   const Step = ({
//     icon,
//     title,
//     desc,
//     active = false,
//     badge,
//   }: {
//     icon: React.ReactNode;
//     title: string;
//     desc: string;
//     active?: boolean;
//     badge?: string;
//   }) => (
//     <div
//       className={[
//         "flex items-start gap-4 rounded-2xl border bg-white p-5 shadow-sm",
//         active
//           ? "border-blue-300/70 bg-blue-50/40 ring-1 ring-blue-400/60"
//           : "border-gray-200",
//       ].join(" ")}
//     >
//       <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-100 text-gray-700">
//         {icon}
//       </div>
//       <div className="flex-1">
//         <div className="flex items-center gap-2">
//           <div className="text-base font-semibold text-gray-900">{title}</div>
//           {badge && (
//             <div className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
//               {badge}
//             </div>
//           )}
//         </div>
//         <div className="mt-1 text-sm text-gray-600">{desc}</div>
//       </div>
//     </div>
//   );

//   const Dot = ({ cls = "bg-blue-500" }: { cls?: string }) => (
//     <div className={["mt-2 h-1.5 w-1.5 rounded-full", cls].join(" ")}></div>
//   );

//   return (
//     <div className="min-h-[100dvh] bg-white antialiased">
//       <div className="mx-auto max-w-3xl px-6 pb-24 pt-10">
//         {/* Logo */}
//         <div className="mx-auto grid h-20 w-40 place-items-center rounded-3xl bg-blue-100 ring-8 ring-blue-50">
//           <Image src="/images/CommonImages/logoBlack.png" alt="Brand logo" width={100} height={50} className="object-contain" />
//         </div>

//         {/* Title & Subtitle */}
//         <div className="mt-5 text-center text-2xl font-extrabold tracking-tight text-gray-900">
//           AI Analyzing Your CV
//         </div>
//         <div className="mx-auto mt-2 max-w-xl text-center text-sm text-gray-600">
//           Our intelligent system is reviewing your background to create personalized
//           interview questions
//         </div>

//         {/* Progress Card */}
//         <div className="mx-auto mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//           <div className="flex items-center justify-between text-[12px] font-semibold text-gray-700">
//             <div>Analysis Progress</div>
//             <div>{progress}%</div>
//           </div>
//           <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
//             <div
//               className="h-2 rounded-full bg-gray-900"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//         </div>

//         {/* Steps */}
//         <div className="mt-6 space-y-4">
//           <Step
//             active
//             badge="In Progress"
//             title="Parsing CV Content"
//             desc="Extracting text and analyzing document structure"
//             icon={
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4"/>
//                 <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.4"/>
//               </svg>
//             }
//           />
//           <Step
//             title="Identifying Key Skills"
//             desc="Analyzing technical and soft skills mentioned"
//             icon={
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4"/>
//                 <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
//               </svg>
//             }
//           />
//           <Step
//             title="Analyzing Experience"
//             desc="Evaluating projects, education, and work history"
//             icon={
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M4 10h16M7 6h10M6 14h12M9 18h6" stroke="currentColor" strokeWidth="1.4"/>
//               </svg>
//             }
//           />
//           <Step
//             title="Generating Questions"
//             desc="Creating personalized interview questions based on your profile"
//             icon={
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M12 20h.01M8 9a4 4 0 118 0c0 2-2 3-2 3h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             }
//           />
//         </div>

//         {/* What AI looks for */}
//         <div className="mx-auto mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
//           <div className="text-center text-base font-semibold text-gray-900">What Our AI is Looking For</div>
//           <div className="mt-4 grid gap-8 md:grid-cols-2">
//             <div>
//               <div className="text-sm font-semibold text-gray-900">Technical Skills</div>
//               <div className="mt-2 space-y-2 text-sm text-gray-700">
//                 <div className="flex items-start gap-2"><Dot cls="bg-blue-500"/><div>Programming languages</div></div>
//                 <div className="flex items-start gap-2"><Dot cls="bg-blue-500"/><div>Frameworks & libraries</div></div>
//                 <div className="flex items-start gap-2"><Dot cls="bg-blue-500"/><div>Tools & technologies</div></div>
//               </div>
//             </div>
//             <div>
//               <div className="text-sm font-semibold text-gray-900">Experience & Projects</div>
//               <div className="mt-2 space-y-2 text-sm text-gray-700">
//                 <div className="flex items-start gap-2"><Dot cls="bg-green-500"/><div>Project complexity</div></div>
//                 <div className="flex items-start gap-2"><Dot cls="bg-green-500"/><div>Problem‑solving approach</div></div>
//                 <div className="flex items-start gap-2"><Dot cls="bg-green-500"/><div>Achievement highlights</div></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUploadStore } from "../utils/upload-store";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

type StepStatus = "idle" | "running" | "success" | "error";
type StepsState = {
  parsing: StepStatus;
  skills: StepStatus;
  experience: StepStatus;
  questions: StepStatus;
};

export default function AnalyzingPage() {
  const router = useRouter();
  const { file, jobTypeId, positionId, reset } = useUploadStore();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token") || localStorage.getItem("token")
      : null;

  const [uploadPct, setUploadPct] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [cvId, setCvId] = useState<string | number | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const [steps, setSteps] = useState<StepsState>({
    parsing: "idle",
    skills: "idle",
    experience: "idle",
    questions: "idle",
  });

  const workingRef = useRef<boolean>(true);

  const setStep = (
    k: keyof StepsState,
    v: StepStatus | ((prev: StepStatus) => StepStatus)
  ) => setSteps((s) => ({ ...s, [k]: typeof v === "function" ? (v as any)(s[k]) : v }));

  // Lightweight animation of steps while we're uploading/posting
  useEffect(() => {
    // if we already errored or finished, don't animate
    if (error) return;

    // kick off animation sequence
    setStep("parsing", "running");

    const t1 = setTimeout(() => setStep("skills", "running"), 800);
    const t2 = setTimeout(() => setStep("experience", "running"), 1600);
    const t3 = setTimeout(() => setStep("questions", "running"), 2400);

    // gentle progress drift while work is ongoing
    const drift = setInterval(() => {
      setProgress((p) => (workingRef.current ? Math.min(95, p + 2) : p));
    }, 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(drift);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  // Main pipeline (upload → POST /cv → complete)
  useEffect(() => {
    (async () => {
      try {
        if (!token) {
          router.push("/login");
          return;
        }
        if (!file || !jobTypeId || !positionId) {
          router.replace("/submit-cv");
          return;
        }

        // 1) Upload to Firebase (drives the Upload progress bar)
        const path = `cv/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, path);
        const task = uploadBytesResumable(storageRef, file);

        await new Promise<void>((resolve, reject) => {
          task.on(
            "state_changed",
            (snap) => {
              const pct = (snap.bytesTransferred / snap.totalBytes) * 100;
              setUploadPct(pct);
            },
            (err) => reject(err),
            () => resolve()
          );
        });

        const downloadURL = await getDownloadURL(task.snapshot.ref);

        // 2) Tell backend to save/analyze (no status endpoint used)
        const resp = await fetch(`${API_BASE_URL}/cv`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cv_url: downloadURL,
            job_type_id: jobTypeId,
            job_position_id: positionId,
          }),
        });

        if (!resp.ok) {
          let msg = "API error while saving CV";
          try {
            const j = await resp.json();
            msg = j?.detail || msg;
          } catch {}
          throw new Error(msg);
        }

        // If your backend returns an id / result_url, grab them (optional)
        const data = await resp.json().catch(() => ({} as any));
        const id = data?.id ?? data?.cv_id ?? data?.uuid ?? null;
        if (id) setCvId(id);
        if (data?.result_url) setResultUrl(data.result_url);

        // 3) Mark everything as completed (since analysis is “done” after upload+POST)
        workingRef.current = false;
        setUploadPct(100);
        setProgress(100);
        setStep("parsing", "success");
        setStep("skills", "success");
        setStep("experience", "success");
        setStep("questions", "success");
      } catch (e: any) {
        workingRef.current = false;
        setError(e?.message || "Something went wrong.");
        // Mark any running/idle steps as failed
        setStep("parsing", (s) => (s === "success" ? s : "error"));
        setStep("skills", (s) => (s === "success" ? s : "error"));
        setStep("experience", (s) => (s === "success" ? s : "error"));
        setStep("questions", (s) => (s === "success" ? s : "error"));
      } finally {
        // clear in-memory payload (optional)
        reset();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Step = ({
    icon,
    title,
    desc,
    status = "idle",
  }: {
    icon: React.ReactNode;
    title: string;
    desc: string;
    status?: StepStatus;
  }) => {
    const isActive = status === "running";
    const isOk = status === "success";
    const isErr = status === "error";
    return (
      <div
        className={[
          "flex items-start gap-4 rounded-2xl border bg-white p-5 shadow-sm",
          isActive
            ? "border-blue-300/70 bg-blue-50/40 ring-1 ring-blue-400/60"
            : isOk
            ? "border-green-300/60 bg-green-50/30"
            : isErr
            ? "border-red-300/60 bg-red-50/30"
            : "border-gray-200",
        ].join(" ")}
      >
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-100 text-gray-700">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="text-base font-semibold text-gray-900">{title}</div>
            {isActive && (
              <div className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                In Progress
              </div>
            )}
            {isOk && (
              <div className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                Completed
              </div>
            )}
            {isErr && (
              <div className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                Failed
              </div>
            )}
          </div>
          <div className="mt-1 text-sm text-gray-600">{desc}</div>
        </div>
      </div>
    );
  };

  const Dot = ({ cls = "bg-blue-500" }: { cls?: string }) => (
    <div className={["mt-2 h-1.5 w-1.5 rounded-full", cls].join(" ")}></div>
  );

  return (
    <div className="min-h-[100dvh] bg-white antialiased">
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-10">
        {/* Logo */}
        <div className="mx-auto grid h-20 w-40 place-items-center rounded-3xl bg-blue-100 ring-8 ring-blue-50">
          <Image
            src="/images/CommonImages/logoBlack.png"
            alt="Brand logo"
            width={100}
            height={50}
            className="object-contain"
          />
        </div>

        {/* Title & Subtitle */}
        <div className="mt-5 text-center text-2xl font-extrabold tracking-tight text-gray-900">
          AI Analyzing Your CV
        </div>
        <div className="mx-auto mt-2 max-w-xl text-center text-sm text-gray-600">
          We’re uploading your file and preparing personalized interview questions.
        </div>

        {/* Upload progress */}
        <div className="mx-auto mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-[12px] font-semibold text-gray-700">
            <div>{uploadPct < 100 ? "Uploading CV" : "Upload Complete"}</div>
            <div>{Math.round(uploadPct)}%</div>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-gray-900"
              style={{ width: `${Math.round(uploadPct)}%` }}
            />
          </div>
        </div>

        {/* Analysis Progress */}
        <div className="mx-auto mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-[12px] font-semibold text-gray-700">
            <div>Analysis Progress</div>
            <div>{Math.round(progress)}%</div>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-gray-900"
              style={{ width: `${Math.round(progress)}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="mt-6 space-y-4">
          <Step
            status={steps.parsing}
            title="Parsing CV Content"
            desc="Extracting text and analyzing document structure"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4" />
                <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            }
          />
          <Step
            status={steps.skills}
            title="Identifying Key Skills"
            desc="Analyzing technical and soft skills mentioned"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
                <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            }
          />
          <Step
            status={steps.experience}
            title="Analyzing Experience"
            desc="Evaluating projects, education, and work history"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 10h16M7 6h10M6 14h12M9 18h6" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            }
          />
          <Step
            status={steps.questions}
            title="Generating Questions"
            desc="Creating personalized interview questions based on your profile"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 20h.01M8 9a4 4 0 118 0c0 2-2 3-2 3h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
        </div>

        {/* What AI looks for */}
        <div className="mx-auto mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-center text-base font-semibold text-gray-900">
            What Our AI is Looking For
          </div>
          <div className="mt-4 grid gap-8 md:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-gray-900">Technical Skills</div>
              <div className="mt-2 space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2"><Dot cls="bg-blue-500" /><div>Programming languages</div></div>
                <div className="flex items-start gap-2"><Dot cls="bg-blue-500" /><div>Frameworks & libraries</div></div>
                <div className="flex items-start gap-2"><Dot cls="bg-blue-500" /><div>Tools & technologies</div></div>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Experience & Projects</div>
              <div className="mt-2 space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2"><Dot cls="bg-green-500" /><div>Project complexity</div></div>
                <div className="flex items-start gap-2"><Dot cls="bg-green-500" /><div>Problem-solving approach</div></div>
                <div className="flex items-start gap-2"><Dot cls="bg-green-500" /><div>Achievement highlights</div></div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Optional: show a results button when done */}
          {!error && progress === 100 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  if (resultUrl) {
                    window.location.href = resultUrl;
                  } else if (cvId) {
                    router.push(`/start-interview`);
                  }
                }}
                className="rounded-xl bg-black px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
              >
                Join Interview
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
