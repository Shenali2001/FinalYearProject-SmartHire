"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";

// Drop in: app/submit-cv/page.tsx
// Tailwind required. Mostly <div>-based; native <select> and <input type="file"> kept for usability.

export default function SubmitCv() {
  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Freelance",
    "Remote",
  ];

  const positions = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Mobile Developer",
    "Data Scientist",
    "Product Manager",
  ];

  const [selectedJobType, setSelectedJobType] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const allowedExt = useMemo(() => ["pdf", "doc", "docx"], []);
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB

  const onFile = useCallback(
    (f: File) => {
      setError(null);
      const ext = f.name.split(".").pop()?.toLowerCase();
      if (!ext || !allowedExt.includes(ext)) {
        setError("Allowed formats: PDF, DOC, DOCX.");
        setFile(null);
        return;
      }
      if (f.size > maxSizeBytes) {
        setError("File too large. Max 10MB.");
        setFile(null);
        return;
      }
      setFile(f);
    },
    [allowedExt]
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

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-white to-gray-50">
      {/* PAGE HEADER */}
      <div className="mx-auto max-w-7xl px-6 pt-10">
        <div className="rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-sm backdrop-blur">
          <div className="flex flex-col items-center gap-2 text-center md:flex-row md:items-end md:justify-between md:text-left">
            <div>
              <div className="text-3xl font-bold tracking-tight text-gray-900">Submit Your Application</div>
              <div className="mt-1 text-sm text-gray-600">Upload your CV and select your preferences to get started.</div>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-700">
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
                <div className="grid h-6 w-6 place-items-center rounded-full bg-gray-900 text-[11px] font-bold text-white">1</div>
                <div>Job Type</div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
                <div className="grid h-6 w-6 place-items-center rounded-full bg-gray-900 text-[11px] font-bold text-white">2</div>
                <div>Position</div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
                <div className="grid h-6 w-6 place-items-center rounded-full bg-gray-900 text-[11px] font-bold text-white">3</div>
                <div>Upload CV</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-6 lg:grid-cols-3">
        {/* LEFT: FORM */}
        <div className="lg:col-span-2">
          {/* Card 1 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-gray-900 text-xs font-bold text-white">1</div>
              <div className="text-lg font-semibold text-gray-900">Select Your Job Type</div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
              {jobTypes.map((t) => {
                const active = selectedJobType === t;
                return (
                  <div
                    key={t}
                    onClick={() => setSelectedJobType(t)}
                    className={[
                      "flex h-11 items-center justify-center rounded-xl border text-sm font-medium transition cursor-pointer",
                      active
                        ? "border-gray-900 bg-gray-900 text-white shadow"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {t}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2 */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-gray-900 text-xs font-bold text-white">2</div>
              <div className="text-lg font-semibold text-gray-900">Select Your Position</div>
            </div>

            <div className="relative mt-5">
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-700 outline-none transition focus:border-gray-400"
              >
                <option value="" disabled>
                  Select a Position
                </option>
                {positions.map((p) => (
                  <option key={p} value={p}>
                    {p}
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
                <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"/>
              </svg>
            </div>
          </div>

          {/* Card 3 */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-gray-900 text-xs font-bold text-white">3</div>
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
                  <div className="text-sm text-gray-700">Drag & drop your CV here, or click to browse</div>
                  <div className="mt-2 text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</div>
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
                        <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                      <div
                        onClick={() => setFile(null)}
                        className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Remove
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">File accepted. Drop another file or click Browse again to replace.</div>
                </div>
              )}

              {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onFile(f);
                }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT: PREVIEW (sticky) */}
        <div className="lg:sticky lg:top-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex justify-center">
              <div
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-black px-4 py-2 text-xs font-semibold text-white shadow hover:bg-gray-50"
                onClick={() => alert("Hook this to your template download")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>Download Template</div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="text-center text-[20px] font-extrabold tracking-tight text-gray-900">Nimesh Hiranuka</div>
              <Divider />
              <div className="flex flex-wrap items-center justify-center gap-5 text-[13px] text-gray-700">
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6l8 6 8-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>abc123@gmail.com</div>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7zm0 9a2 2 0 100-4 2 2 0 000 4z" fill="currentColor"/>
                  </svg>
                  <div>Pitysada, Colombo, Sri Lanka</div>
                </div>
              </div>

              <Divider />

              <SectionTitle
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12a5 5 0 100-10 5 5 0 000 10zM4 22a8 8 0 1116 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
                title="SUMMARY"
              />
              <div className="mt-3 text-[13px] leading-6 text-gray-800">
                Software engineer with 3+ years of experience in web and mobile application development. Skilled in full‑stack development using modern frameworks like React, Next.js, and Spring Boot.
              </div>

              <Divider />

              <SectionTitle
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 7l9-4 9 4-9 4-9-4zm0 0v6c0 1.7 4 3 9 3s9-1.3 9-3V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
                title="EDUCATION"
              />
              <div className="mt-3">
                <div className="text-[13px] font-semibold text-gray-900">University of Westminster, BSc (Hons) Computer Science, 2022 – Present</div>
                <div className="mt-4 text-[13px] text-gray-800">First‑Class Honours Expected</div>
                <div className="mt-6 text-[13px] font-semibold text-gray-900">Royal College Colombo, Advanced Level Certificate, 2018 – 2021</div>
                <div className="mt-2 text-[13px] text-gray-800">Distinction in Mathematics</div>
              </div>

              <Divider />

              <SectionTitle
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 8h6M4 16h6M14 6h6M14 18h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
                title="SKILLS"
              />
              <div className="mt-3 text-[13px] leading-6 text-gray-800">
                Python, JavaScript, Java, TypeScript, React, Next.js, Node.js, Spring Boot, Redux, Context API, SQL, MongoDB, PostgreSQL, Firebase, Git, JAX, Bootstrap, Tailwind CSS
              </div>

              <Divider />

              <SectionTitle
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 7h10v10H7zM3 3h4v4H3zM17 17h4v4h-4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
                title="PROJECTS"
              />
              <div className="mt-3 space-y-4">
                <Bullet>
                  <div>
                    <div className="font-semibold text-gray-900">Prime Booking App:</div>
                    <div>
                      A web app for booking tickets. <span className="font-medium">Technologies:</span> Spring Boot, Next.js, MongoDB.
                    </div>
                  </div>
                </Bullet>
                <Bullet>
                  <div>
                    <div className="font-semibold text-gray-900">Portfolio Website:</div>
                    <div>
                      Showcasing programming services. <span className="font-medium">Technologies:</span> React, Context API, SQL, MongoDB, PostgreSQL, Firebase, Git, JAX.
                    </div>
                  </div>
                </Bullet>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mx-auto mt-8 max-w-6xl px-6 pb-12">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <div
            className={[
              "inline-flex h-11 items-center justify-center rounded-xl bg-gray-900 px-6 text-sm font-semibold text-white shadow hover:opacity-90",
              !selectedJobType || !selectedPosition || !file ? "cursor-not-allowed opacity-50" : "",
            ].join(" ")}
          >
            Submit Application
          </div>
          <div className="text-xs text-gray-500">* Demo UI — connect the action to your API.</div>
        </div>
      </div>
    </div>
  );
}
