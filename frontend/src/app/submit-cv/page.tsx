// "use client";
// import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// // TODO: adjust this import to your actual firebase util path
// import { storage } from "../utils/firebase"; // if your file lives at app/submit-cv/page.tsx, this likely resolves. Otherwise: "../../utils/firebase"

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

// type JobType = { id: number; name: string };
// type JobPosition = { id: number; name: string; type_id: number };

// export default function SubmitCv() {
//   // --- selections ---
//   const [jobTypes, setJobTypes] = useState<JobType[]>([]);
//   const [positions, setPositions] = useState<JobPosition[]>([]);
//   const [selectedJobType, setSelectedJobType] = useState<number | null>(null);
//   const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

//   // --- upload state ---
//   const [dragActive, setDragActive] = useState(false);
//   const [file, setFile] = useState<File | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [showLoginModal, setShowLoginModal] = useState(false);

//   const inputRef = useRef<HTMLInputElement | null>(null);

//   const allowedExt = useMemo(() => ["pdf"], []);
//   const allowedMime = useMemo(() => ["application/pdf"], []);
//   const maxSizeBytes = 10 * 1024 * 1024; // 10MB

//   const token = useMemo(() =>
//     // support both keys just in case older code stored "token"
//     (typeof window !== "undefined" && (localStorage.getItem("access_token") || localStorage.getItem("token"))) || null,
//   []);

//   // ------------ helpers ------------
//   const onFile = useCallback(
//   (f: File) => {
//     setError(null);
//     const ext = f.name.split(".").pop()?.toLowerCase();
//     const typeOk = allowedMime.includes(f.type); // strict MIME check
//     const extOk = !!ext && allowedExt.includes(ext);

//     if (!typeOk || !extOk) {
//       setError("PDF only. Max 10MB.");
//       setFile(null);
//       return;
//     }
//     if (f.size > maxSizeBytes) {
//       setError("PDF only. Max 10MB.");
//       setFile(null);
//       return;
//     }
//     setFile(f);
//   },
//   [allowedExt, allowedMime]
// );


//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
//     if (e.type === "dragleave") setDragActive(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       onFile(e.dataTransfer.files[0]);
//     }
//   };

//   const browse = () => inputRef.current?.click();

//   // ------------ fetch job types & positions ------------
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const resp = await fetch(`${API_BASE_URL}/jobs/types`);
//         if (!resp.ok) throw new Error("Failed to load job types");
//         const data: JobType[] = await resp.json();
//         if (!cancelled) setJobTypes(data || []);
//       } catch (e: any) {
//         if (!cancelled) setError(e.message || "Could not fetch job types");
//       }
//     })();
//     return () => { cancelled = true; };
//   }, []);

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       if (!selectedJobType) { setPositions([]); setSelectedPosition(null); return; }
//       try {
//         const resp = await fetch(`${API_BASE_URL}/jobs/types/${selectedJobType}/positions`);
//         if (!resp.ok) throw new Error("Failed to load positions");
//         const data: JobPosition[] = await resp.json();
//         if (!cancelled) setPositions(data || []);
//       } catch (e: any) {
//         if (!cancelled) setError(e.message || "Could not fetch positions");
//       }
//     })();
//     return () => { cancelled = true; };
//   }, [selectedJobType]);

//   // ------------ submit flow (Firebase upload + API POST) ------------
//   const submit = async () => {
//     if (!selectedJobType || !selectedPosition || !file) {
//       setError("Please select a job type, position, and choose a CV file.");
//       return;
//     }
//     if (!token) {
//       setShowLoginModal(true);
//       return;
//     }

//     try {
//       setError(null);
//       setUploading(true);
//       setProgress(0);

//       const path = `cv/${Date.now()}_${file.name}`;
//       const storageRef = ref(storage, path);
//       const task = uploadBytesResumable(storageRef, file);

//       await new Promise<void>((resolve, reject) => {
//         task.on(
//           "state_changed",
//           (snap) => {
//             const pct = (snap.bytesTransferred / snap.totalBytes) * 100;
//             setProgress(pct);
//           },
//           (err) => reject(err),
//           () => resolve()
//         );
//       });

//       const downloadURL = await getDownloadURL(task.snapshot.ref);

//       const resp = await fetch(`${API_BASE_URL}/cv`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           cv_url: downloadURL,
//           job_type_id: selectedJobType,
//           job_position_id: selectedPosition,
//         }),
//       });

//       if (!resp.ok) {
//         let msg = "API error while saving CV";
//         try { const j = await resp.json(); msg = j?.detail || msg; } catch {}
//         throw new Error(msg);
//       }

//       // success UI
//       alert("CV uploaded successfully!");
//       setFile(null);
//       setProgress(0);
//     } catch (e: any) {
//       console.error(e);
//       setError(e.message || "Something went wrong during upload.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const Divider = () => <div className="my-4 h-px w-full bg-gray-200" />;
//   const Bullet = ({ children }: { children: React.ReactNode }) => (
//     <div className="flex gap-2 text-[13px] leading-6 text-gray-800"><div className="select-none">•</div><div className="flex-1">{children}</div></div>
//   );
//   const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
//     <div className="flex items-center gap-3"><div className="text-gray-800">{icon}</div><div className="text-lg font-extrabold tracking-tight text-gray-900">{title}</div></div>
//   );

//   const SAMPLE_CV_URL = "https://firebasestorage.googleapis.com/v0/b/smarthire-ai-interview.firebasestorage.app/o/sampleCv%2Fsample_templete_cv_downloard.pdf?alt=media&token=679d0c4c-9d26-42d4-ab68-798c8c88151c"

//   return (
//     <div className="min-h-[100dvh] bg-gradient-to-b from-white to-gray-50">
//       {/* HEADER */}
//       <div className="mx-auto max-w-7xl px-6 pt-10">
//         <div className="rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-sm backdrop-blur">
//           <div className="flex flex-col items-center gap-2 text-center md:flex-row md:items-end md:justify-between md:text-left">
//             <div>
//               <div className="text-3xl font-bold tracking-tight text-gray-900">Submit Your Application</div>
//               <div className="mt-1 text-sm text-gray-600">Upload your CV and select your preferences to get started.</div>
//             </div>
//             <div className="flex items-center gap-3 text-xs text-gray-700">
//               {[{ n: 1, label: "Job Type" }, { n: 2, label: "Position" }, { n: 3, label: "Upload CV" }].map((s) => (
//                 <div key={s.n} className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
//                   <div className="grid h-6 w-6 place-items-center rounded-full bg-gray-900 text-[11px] font-bold text-white">{s.n}</div>
//                   <div>{s.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* GRID */}
//       <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-6 lg:grid-cols-3">
//         {/* LEFT: FORM */}
//         <div className="lg:col-span-2">
//           {/* Card 1 */}
//           <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className="grid h-7 w-7 place-items-center rounded-full bg-gray-900 text-xs font-bold text-white">1</div>
//               <div className="text-lg font-semibold text-gray-900">Select Your Job Type</div>
//             </div>
//             <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
//               {jobTypes.map((t) => {
//                 const active = selectedJobType === t.id;
//                 return (
//                   <div key={t.id} onClick={() => setSelectedJobType(t.id)} className={["flex h-11 items-center justify-center rounded-xl border text-sm font-medium transition cursor-pointer", active ? "border-gray-900 bg-gray-900 text-white shadow" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"].join(" ")}>{t.name}</div>
//                 );
//               })}
//               {jobTypes.length === 0 && <div className="col-span-full text-sm text-gray-500">No job types found.</div>}
//             </div>
//           </div>

//           {/* Card 2 */}
//           <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
//             <div className="flex items-center gap-3"><div className="grid h-7 w-7 place-items-center rounded-full bg-gray-900 text-xs font-bold text-white">2</div><div className="text-lg font-semibold text-gray-900">Select Your Position</div></div>
//             <div className="relative mt-5">
//               <select value={selectedPosition ?? ""} onChange={(e) => setSelectedPosition(Number(e.target.value))} className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-700 outline-none transition focus:border-gray-400" disabled={!selectedJobType}>
//                 <option value="" disabled>{selectedJobType ? "Select a Position" : "Select a Job Type first"}</option>
//                 {positions.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
//               </select>
//               <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"/></svg>
//             </div>
//           </div>

//           {/* Card 3 */}
//           <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
//             <div className="flex items-center gap-3"><div className="grid h-7 w-7 place-items-center rounded-full bg-gray-900 text-xs font-bold text-white">3</div><div className="text-lg font-semibold text-gray-900">Upload Your CV</div></div>
//             <div onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop} className={["mt-5 rounded-2xl border-2 border-dashed p-10 text-center transition", dragActive ? "border-gray-900 bg-gray-50" : "border-gray-200"].join(" ")}>
//               <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full border border-gray-200">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" className="text-gray-700"><path d="M12 3v12m0-12l-4 4m4-4l4 4M5 21h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
//               </div>
//               {!file && (<div><div className="text-sm text-gray-700">Drag & drop your CV here, or click to browse</div><div className="mt-2 text-xs text-gray-500">PDF only 10MB</div><div className="mt-5"><div onClick={browse} className="inline-flex cursor-pointer rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90">Browse Files</div></div></div>)}
//               {file && (
//                 <div className="mx-auto max-w-lg">
//                   <div className="rounded-xl border border-gray-200 p-4 text-left"><div className="flex items-center justify-between gap-3"><div><div className="text-sm font-medium text-gray-900">{file.name}</div><div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div></div><div onClick={() => setFile(null)} className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">Remove</div></div></div>
//                   {uploading && (
//                     <div className="mt-3 w-full rounded-full bg-gray-200">
//                       <div className="rounded-full bg-gray-900 py-1 text-center text-xs font-semibold text-white" style={{ width: `${Math.round(progress)}%` }}>
//                         {Math.round(progress)}%
//                       </div>
//                     </div>
//                   )}
//                   {!uploading && progress > 0 && progress < 100 && (
//                     <div className="mt-3 w-full rounded-full bg-gray-200">
//                       <div className="rounded-full bg-gray-900 py-1 text-center text-xs font-semibold text-white" style={{ width: `${Math.round(progress)}%` }}>
//                         {Math.round(progress)}%
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//               {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
//               <input ref={inputRef} type="file" className="hidden" accept=".pdf,application/pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
//             </div>
//             <div className="mx-auto mt-8 px-6 pb-2">
//               <button onClick={submit} disabled={!selectedJobType || !selectedPosition || !file || uploading} className={["inline-flex h-11 w-full items-center justify-center rounded-xl bg-black px-6 text-sm font-semibold text-white shadow hover:opacity-90", (!selectedJobType || !selectedPosition || !file || uploading) ? "cursor-not-allowed " : ""].join(" ")}>{uploading ? "Uploading…" : "Submit Application"}</button>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT: PREVIEW (static for now) */}
//         <div className="lg:sticky lg:top-6">
//           <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:h-[calc(100vh-1.5rem)] lg:max-h-[calc(100vh-1.5rem)] flex flex-col overflow-hidden">
//              {/* Download Template Button */}
//               <div className="mb-5 flex justify-center shrink-0">
//                 <button
//                   onClick={() => {
//                     const a = document.createElement("a");
//                     a.href = SAMPLE_CV_URL;         // your Firebase Storage URL
//                     a.download = "sample_cv.pdf";   // suggested filename
//                     document.body.appendChild(a);
//                     a.click();
//                     a.remove();
//                   }}
//                   className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-black px-4 py-2 text-xs font-semibold text-white shadow hover:opacity-90"
//                 >
//                   <svg
//                     width="18"
//                     height="18"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
//                       stroke="currentColor"
//                       strokeWidth="1.6"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                   <span>Download Template</span>
//                 </button>
//               </div>

//             <div className="min-h-0 flex-1 overflow-y-auto pr-2">
//               <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
//                 <div className="text-center text-[20px] font-extrabold tracking-tight text-gray-900">Your Name</div>
//                 <Divider />
//                 <div className="flex flex-wrap items-center justify-center gap-3 text-[13px] text-gray-700">
//                   <div className="flex items-center gap-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6l8 6 8-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg><div>email@example.com</div></div>
//                   <div className="flex items-center gap-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6l8 6 8-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg><div>+94 77 000 0000</div></div>
//                   <div className="flex items-center gap-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7zm0 9a2 2 0 100-4 2 2 0 000 4z" fill="currentColor"/></svg><div>Colombo, Sri Lanka</div></div>
//                 </div>
//                 <Divider />
//                 <SectionTitle icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zM4 22a8 8 0 1116 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/> </svg>} title="SUMMARY" />
//                 <div className="mt-3 text-[13px] leading-6 text-gray-800">Brief summary goes here…</div>
//                 <Divider />
//                 <SectionTitle icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7l9-4 9 4-9 4-9-4zm0 0v6c0 1.7 4 3 9 3s9-1.3 9-3V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/> </svg>} title="EDUCATION" />
//                 <div className="mt-3 text-[13px] text-gray-800">Your education…</div>
//                 <Divider />
//                 <SectionTitle icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 8h6M4 16h6M14 6h6M14 18h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/> </svg>} title="SKILLS" />
//                 <div className="mt-3 text-[13px] leading-6 text-gray-800">Your Skills(eg:- React, Next.js, Spring Boot…)</div>
//                 <Divider />
//                 <SectionTitle icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 7h10v10H7zM3 3h4v4H3zM17 17h4v4h-4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/> </svg>} title="PROJECTS" />
//                 <div className="mt-3 space-y-4">
//                   <Bullet>Project 1 …</Bullet>
//                   <Bullet>Project 2 …</Bullet>
//                 </div>
//                 <Divider />
//                 <SectionTitle icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 7h10v10H7zM3 3h4v4H3zM17 17h4v4h-4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/> </svg>} title="WORK EXPERIENCE" />
//                 <div className="mt-3 space-y-4">
//                   <Bullet>Your Work Experience 1 …</Bullet>
//                   <Bullet>Your Work Experience 2 …</Bullet>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* LOGIN MODAL */}
//       {showLoginModal && (
//         <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-lg px-6 py-5 text-center max-w-sm w-full">
//             <h3 className="text-xl font-semibold mb-3 text-gray-800">Login Required</h3>
//             <p className="text-gray-600 mb-4">You need to log in to upload your CV</p>
//             <div className="flex justify-center gap-4">
//               <button onClick={() => { setShowLoginModal(false); window.location.href = "/login"; }} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition">Go to Login</button>
//               <button onClick={() => setShowLoginModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUploadStore } from "../utils/upload-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

type JobType = { id: number; name: string };
type JobPosition = { id: number; name: string; type_id: number };

export default function SubmitCv() {
  // --- selections ---
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [selectedJobType, setSelectedJobType] = useState<number | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

  // --- upload state (local ui only) ---
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false); // just for disabling button
  const [progress, setProgress] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { setPayload } = useUploadStore();

  const allowedExt = useMemo(() => ["pdf"], []);
  const allowedMime = useMemo(() => ["application/pdf"], []);
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB

  const token = useMemo(
    () =>
      (typeof window !== "undefined" &&
        (localStorage.getItem("access_token") || localStorage.getItem("token"))) ||
      null,
    []
  );

  // ------------ helpers ------------
  const onFile = useCallback(
    (f: File) => {
      setError(null);
      const ext = f.name.split(".").pop()?.toLowerCase();
      const typeOk = allowedMime.includes(f.type);
      const extOk = !!ext && allowedExt.includes(ext);

      if (!typeOk || !extOk) {
        setError("PDF only. Max 10MB.");
        setFile(null);
        return;
      }
      if (f.size > maxSizeBytes) {
        setError("PDF only. Max 10MB.");
        setFile(null);
        return;
      }
      setFile(f);
    },
    [allowedExt, allowedMime]
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFile(e.dataTransfer.files[0]);
    }
  };

  const browse = () => inputRef.current?.click();

  // ------------ fetch job types & positions ------------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/jobs/types`);
        if (!resp.ok) throw new Error("Failed to load job types");
        const data: JobType[] = await resp.json();
        if (!cancelled) setJobTypes(data || []);
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Could not fetch job types");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!selectedJobType) {
        setPositions([]);
        setSelectedPosition(null);
        return;
      }
      try {
        const resp = await fetch(`${API_BASE_URL}/jobs/types/${selectedJobType}/positions`);
        if (!resp.ok) throw new Error("Failed to load positions");
        const data: JobPosition[] = await resp.json();
        if (!cancelled) setPositions(data || []);
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Could not fetch positions");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedJobType]);

  // ------------ submit flow (hand off to analyzing page) ------------
  const submit = async () => {
    if (!selectedJobType || !selectedPosition || !file) {
      setError("Please select a job type, position, and choose a CV file.");
      return;
    }
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    // stash payload (includes File) and route to analyzing page
    setPayload({
      file,
      jobTypeId: selectedJobType,
      positionId: selectedPosition,
    });

    setError(null);
    setProgress(0);
    setUploading(true);
    router.push("/analyzing-cv");
  };

  const Divider = () => <div className="my-4 h-px w-full bg-gray-200" />;
  const Bullet = ({ children }: { children: React.ReactNode }) => (
    <div className="flex gap-2 text-[13px] leading-6 text-gray-800">
      <div className="select-none">•</div>
      <div className="flex-1">{children}</div>
    </div>
  );
  const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div className="flex items-center gap-3">
      <div className="text-gray-800">{icon}</div>
      <div className="text-lg font-extrabold tracking-tight text-gray-900">{title}</div>
    </div>
  );

  const SAMPLE_CV_URL =
    "https://firebasestorage.googleapis.com/v0/b/smarthire-ai-interview.firebasestorage.app/o/sampleCv%2Fsample_templete_cv_downloard.pdf?alt=media&token=679d0c4c-9d26-42d4-ab68-798c8c88151c";

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-white to-gray-50">
      {/* HEADER */}
      <div className="mx-auto max-w-7xl px-6 pt-10">
        <div className="rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-sm backdrop-blur">
          <div className="flex flex-col items-center gap-2 text-center md:flex-row md:items-end md:justify-between md:text-left">
            <div>
              <div className="text-3xl font-bold tracking-tight text-gray-900">
                Submit Your Application
              </div>
              <div className="mt-1 text-sm text-gray-600">
                Upload your CV and select your preferences to get started.
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-700">
              {[{ n: 1, label: "Job Type" }, { n: 2, label: "Position" }, { n: 3, label: "Upload CV" }].map((s) => (
                <div
                  key={s.n}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm"
                >
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-gray-900 text-[11px] font-bold text-white">
                    {s.n}
                  </div>
                  <div>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-6 lg:grid-cols-3">
        {/* LEFT: FORM */}
        <div className="lg:col-span-2">
          {/* Card 1 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-gray-900 text-xs font-bold text-white">
                1
              </div>
              <div className="text-lg font-semibold text-gray-900">Select Your Job Type</div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
              {jobTypes.map((t) => {
                const active = selectedJobType === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedJobType(t.id)}
                    className={[
                      "flex h-11 items-center justify-center rounded-xl border text-sm font-medium transition cursor-pointer",
                      active
                        ? "border-gray-900 bg-gray-900 text-white shadow"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {t.name}
                  </div>
                );
              })}
              {jobTypes.length === 0 && (
                <div className="col-span-full text-sm text-gray-500">No job types found.</div>
              )}
            </div>
          </div>

          {/* Card 2 */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-gray-900 text-xs font-bold text-white">
                2
              </div>
              <div className="text-lg font-semibold text-gray-900">Select Your Position</div>
            </div>
            <div className="relative mt-5">
              <select
                value={selectedPosition ?? ""}
                onChange={(e) => setSelectedPosition(Number(e.target.value))}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-700 outline-none transition focus:border-gray-400"
                disabled={!selectedJobType}
              >
                <option value="" disabled>
                  {selectedJobType ? "Select a Position" : "Select a Job Type first"}
                </option>
                {positions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 10l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-500"
                />
              </svg>
            </div>
          </div>

          {/* Card 3 */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-gray-900 text-xs font-bold text-white">
                3
              </div>
              <div className="text-lg font-semibold text-gray-900">Upload Your CV</div>
            </div>
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={[
                "mt-5 rounded-2xl border-2 border-dashed p-10 text-center transition",
                dragActive ? "border-gray-900 bg-gray-50" : "border-gray-200",
              ].join(" ")}
            >
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full border border-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="28"
                  height="28"
                  fill="none"
                  className="text-gray-700"
                >
                  <path
                    d="M12 3v12m0-12l-4 4m4-4l4 4M5 21h14"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {!file && (
                <div>
                  <div className="text-sm text-gray-700">
                    Drag & drop your CV here, or click to browse
                  </div>
                  <div className="mt-2 text-xs text-gray-500">PDF only 10MB</div>
                  <div className="mt-5">
                    <div
                      onClick={browse}
                      className="inline-flex cursor-pointer rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
                    >
                      Browse Files
                    </div>
                  </div>
                </div>
              )}
              {file && (
                <div className="mx-auto max-w-lg">
                  <div className="rounded-xl border border-gray-200 p-4 text-left">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{file.name}</div>
                        <div className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                      <div
                        onClick={() => setFile(null)}
                        className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Remove
                      </div>
                    </div>
                  </div>
                  {progress > 0 && progress < 100 && (
                    <div className="mt-3 w-full rounded-full bg-gray-200">
                      <div
                        className="rounded-full bg-gray-900 py-1 text-center text-xs font-semibold text-white"
                        style={{ width: `${Math.round(progress)}%` }}
                      >
                        {Math.round(progress)}%
                      </div>
                    </div>
                  )}
                </div>
              )}
              {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf,application/pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onFile(f);
                }}
              />
            </div>
            <div className="mx-auto mt-8 px-6 pb-2">
              <button
                onClick={submit}
                disabled={!selectedJobType || !selectedPosition || !file || uploading}
                className={[
                  "inline-flex h-11 w-full items-center justify-center rounded-xl bg-black px-6 text-sm font-semibold text-white shadow hover:opacity-90",
                  !selectedJobType || !selectedPosition || !file || uploading
                    ? "cursor-not-allowed "
                    : "",
                ].join(" ")}
              >
                {uploading ? "Processing…" : "Submit Application"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: PREVIEW (static) */}
        <div className="lg:sticky lg:top-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:h-[calc(100vh-1.5rem)] lg:max-h-[calc(100vh-1.5rem)] flex flex-col overflow-hidden">
            {/* Download Template Button */}
            <div className="mb-5 flex justify-center shrink-0">
              <button
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = SAMPLE_CV_URL;
                  a.download = "sample_cv.pdf";
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-black px-4 py-2 text-xs font-semibold text-white shadow hover:opacity-90"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Download Template</span>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-center text-[20px] font-extrabold tracking-tight text-gray-900">
                  Your Name
                </div>
                <Divider />
                <div className="flex flex-wrap items-center justify-center gap-3 text-[13px] text-gray-700">
                  <div className="flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6l8 6 8-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>email@example.com</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6l8 6 8-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>+94 77 000 0000</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7zm0 9a2 2 0 100-4 2 2 0 000 4z" fill="currentColor" />
                    </svg>
                    <div>Colombo, Sri Lanka</div>
                  </div>
                </div>
                <Divider />
                <SectionTitle
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12a5 5 0 100-10 5 5 0 000 10zM4 22a8 8 0 1116 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  title="SUMMARY"
                />
                <div className="mt-3 text-[13px] leading-6 text-gray-800">Brief summary goes here…</div>
                <Divider />
                <SectionTitle
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 7l9-4 9 4-9 4-9-4zm0 0v6c0 1.7 4 3 9 3s9-1.3 9-3V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  title="EDUCATION"
                />
                <div className="mt-3 text-[13px] text-gray-800">Your education…</div>
                <Divider />
                <SectionTitle
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 8h6M4 16h6M14 6h6M14 18h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  title="SKILLS"
                />
                <div className="mt-3 text-[13px] leading-6 text-gray-800">
                  Your Skills (eg: React, Next.js, Spring Boot…)
                </div>
                <Divider />
                <SectionTitle
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 7h10v10H7zM3 3h4v4H3zM17 17h4v4h-4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  title="PROJECTS"
                />
                <div className="mt-3 space-y-4">
                  <Bullet>Project 1 …</Bullet>
                  <Bullet>Project 2 …</Bullet>
                </div>
                <Divider />
                <SectionTitle
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 7h10v10H7zM3 3h4v4H3zM17 17h4v4h-4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  title="WORK EXPERIENCE"
                />
                <div className="mt-3 space-y-4">
                  <Bullet>Your Work Experience 1 …</Bullet>
                  <Bullet>Your Work Experience 2 …</Bullet>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg px-6 py-5 text-center max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Login Required</h3>
            <p className="text-gray-600 mb-4">You need to log in to upload your CV</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  window.location.href = "/login";
                }}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
              >
                Go to Login
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
