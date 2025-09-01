"use client";
import React from "react";
import Image from "next/image";


// Save as: app/analyzing/page.tsx
// TailwindCSS required. Entire layout uses <div> (no h-tags), plus <Image>.
// To use your own logo: place it in /public (e.g. /public/my-logo.png)
// and change the `logoSrc` below to "/my-logo.png".

export default function AnalyzingPage() {
  const progress = 17; // set dynamically if you like
  
  const Step = ({
    icon,
    title,
    desc,
    active = false,
    badge,
  }: {
    icon: React.ReactNode;
    title: string;
    desc: string;
    active?: boolean;
    badge?: string;
  }) => (
    <div
      className={[
        "flex items-start gap-4 rounded-2xl border bg-white p-5 shadow-sm",
        active
          ? "border-blue-300/70 bg-blue-50/40 ring-1 ring-blue-400/60"
          : "border-gray-200",
      ].join(" ")}
    >
      <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-100 text-gray-700">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="text-base font-semibold text-gray-900">{title}</div>
          {badge && (
            <div className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
              {badge}
            </div>
          )}
        </div>
        <div className="mt-1 text-sm text-gray-600">{desc}</div>
      </div>
    </div>
  );

  const Dot = ({ cls = "bg-blue-500" }: { cls?: string }) => (
    <div className={["mt-2 h-1.5 w-1.5 rounded-full", cls].join(" ")}></div>
  );

  return (
    <div className="min-h-[100dvh] bg-white antialiased">
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-10">
        {/* Logo */}
        <div className="mx-auto grid h-20 w-40 place-items-center rounded-3xl bg-blue-100 ring-8 ring-blue-50">
          <Image src="/images/CommonImages/logoBlack.png" alt="Brand logo" width={100} height={50} className="object-contain" />
        </div>

        {/* Title & Subtitle */}
        <div className="mt-5 text-center text-2xl font-extrabold tracking-tight text-gray-900">
          AI Analyzing Your CV
        </div>
        <div className="mx-auto mt-2 max-w-xl text-center text-sm text-gray-600">
          Our intelligent system is reviewing your background to create personalized
          interview questions
        </div>

        {/* Progress Card */}
        <div className="mx-auto mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-[12px] font-semibold text-gray-700">
            <div>Analysis Progress</div>
            <div>{progress}%</div>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-gray-900"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="mt-6 space-y-4">
          <Step
            active
            badge="In Progress"
            title="Parsing CV Content"
            desc="Extracting text and analyzing document structure"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.4"/>
              </svg>
            }
          />
          <Step
            title="Identifying Key Skills"
            desc="Analyzing technical and soft skills mentioned"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            }
          />
          <Step
            title="Analyzing Experience"
            desc="Evaluating projects, education, and work history"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 10h16M7 6h10M6 14h12M9 18h6" stroke="currentColor" strokeWidth="1.4"/>
              </svg>
            }
          />
          <Step
            title="Generating Questions"
            desc="Creating personalized interview questions based on your profile"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 20h.01M8 9a4 4 0 118 0c0 2-2 3-2 3h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
        </div>

        {/* What AI looks for */}
        <div className="mx-auto mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-center text-base font-semibold text-gray-900">What Our AI is Looking For</div>
          <div className="mt-4 grid gap-8 md:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-gray-900">Technical Skills</div>
              <div className="mt-2 space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2"><Dot cls="bg-blue-500"/><div>Programming languages</div></div>
                <div className="flex items-start gap-2"><Dot cls="bg-blue-500"/><div>Frameworks & libraries</div></div>
                <div className="flex items-start gap-2"><Dot cls="bg-blue-500"/><div>Tools & technologies</div></div>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Experience & Projects</div>
              <div className="mt-2 space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2"><Dot cls="bg-green-500"/><div>Project complexity</div></div>
                <div className="flex items-start gap-2"><Dot cls="bg-green-500"/><div>Problem‑solving approach</div></div>
                <div className="flex items-start gap-2"><Dot cls="bg-green-500"/><div>Achievement highlights</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
