// 'use client'

// import Image from 'next/image'
// import Link from 'next/link'
// import { useEffect, useRef, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { motion } from 'framer-motion'
// import { ArrowRight, Briefcase, Building2, CheckCircle2, Clock, Quote, ShieldCheck, Sparkles, Star, Users } from 'lucide-react'
// import SlideShow1 from '@/components/HomePageSlideShow'

// export default function Home() {
//   const router = useRouter()

//   // Scroll-linked feature viewer
//   const sections = [
//     {
//       id: 'parse-cv',
//       title: 'Parse CVs with AI',
//       text:
//         'Upload a resume and SmartHire instantly extracts structured data—name, email, skills, experience and more—ready to search and match.',
//       image: '/images/CommonImages/homepage1.jpg',
//     },
//     {
//       id: 'generate-questions',
//       title: 'Auto‑generate interview questions',
//       text:
//         'For every role, SmartHire crafts tailored, competency‑based questions so interviewers stay consistent and unbiased.',
//       image: '/images/CommonImages/homepage2.jpg',
//     },
//     {
//       id: 'shortlist',
//       title: 'Shortlist faster with signals',
//       text:
//         'Surface the best candidates with skill signals, match scores, and recruiter notes—no more manual tab‑hopping.',
//       image: '/images/CommonImages/homepage1.jpg',
//     },
//     {
//       id: 'collaborate',
//       title: 'Collaborate securely',
//       text:
//         'Share evaluations, compare candidates, and keep your hiring panel in sync with role‑based access and audit trails.',
//       image: '/images/CommonImages/homepage2.jpg',
//     },
//   ] as const

//   const [currentImage, setCurrentImage] = useState(sections[0].image)
//   const refs = useRef<(HTMLDivElement | null)[]>([])

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const visible = entries.find((e) => e.isIntersecting)
//         if (visible) {
//           const index = refs.current.findIndex((ref) => ref === visible.target)
//           if (index !== -1) setCurrentImage(sections[index].image)
//         }
//       },
//       { threshold: 0.55 }
//     )

//     refs.current.forEach((el) => el && observer.observe(el))
//     return () => refs.current.forEach((el) => el && observer.unobserve(el))
//   }, [])

//   return (
//     <div className="relative min-h-screen bg-white text-gray-900">
//       {/* BG accents */}
//       <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
//         <div className="absolute -top-24 -right-16 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-black via-gray-900 to-gray-700 opacity-[0.06] blur-3xl" />
//         <div className="absolute -bottom-32 -left-16 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-gray-800 via-gray-900 to-black opacity-[0.05] blur-3xl" />
//       </div>



//       {/* HERO */}
//       <section className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-6 md:grid-cols-2 md:pb-20 md:pt-8">
//         <div>
//           <motion.h1
//             initial={{ opacity: 0, y: 8 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="text-balance text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl"
//           >
//             Hire <span className="bg-gradient-to-r from-black via-gray-900 to-gray-700 bg-clip-text text-transparent">smarter</span>,
//             not harder.
//           </motion.h1>
//           <p className="mt-5 max-w-xl text-lg text-gray-700">
//             SmartHire turns resumes into structured data, generates tailored interview questions, and helps your team
//             shortlist top talent in minutesnot weeks.
//           </p>

//           <div className="mt-7 flex flex-col gap-3 sm:flex-row">
//             <button
//               onClick={() => router.push('/auth/candidate/sign-up')}
//               className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-white shadow-sm transition hover:shadow-lg"
//             >
//               Submit Cv <ArrowRight className="ml-2 h-4 w-4" />
//             </button>
//             <button
//               onClick={() => router.push('/auth/employer/sign-up')}
//               className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-gray-900 transition hover:bg-gray-50"
//             >
//               Sign up as Candidate
//             </button>
//           </div>

//         </div>

//         <div className="relative">
//           <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
//             <Image
//               src="/images/CommonImages/homepage2.jpg"
//               alt="SmartHire dashboard preview"
//               width={900}
//               height={640}
//               className="h-auto w-full object-cover"
//               priority
//             />
//           </div>
//           {/* floating card */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="absolute -bottom-6 left-6 right-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-xl"
//           >
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900/90 text-white">
//                 <Sparkles className="h-5 w-5" />
//               </div>
//               <div>
//                 <p className="text-sm font-semibold">AI Questions Generated</p>
//                 <p className="text-xs text-gray-600">Consistency for every interview</p>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* FEATURES GRID */}
//       <section id="features" className="mx-auto w-full max-w-7xl px-4 py-14 md:py-20">
//         <div className="mx-auto max-w-2xl text-center">
//           <h2 className="text-3xl font-semibold md:text-4xl">Why SmartHire</h2>
//           <p className="mt-3 text-gray-700">Everything you need to move from application to offer, faster.</p>
//         </div>

//         <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
//           <FeatureCard
//             icon={<Briefcase className="h-5 w-5" />}
//             title="Structured resume parsing"
//             text="Extract clean, queryable candidate data—no copy/paste required."
//           />
//           <FeatureCard
//             icon={<Users className="h-5 w-5" />}
//             title="Role‑based collaboration"
//             text="Keep hiring panels aligned with notes, tags, and access controls."
//           />
//           <FeatureCard
//             icon={<ShieldCheck className="h-5 w-5" />}
//             title="Fair, consistent interviews"
//             text="AI‑generated, competency‑based questions reduce bias and drift."
//           />
//         </div>
//       </section>

//       {/* STORY SCROLLER (left text, right image) */}
//       <section className="mx-auto w-full max-w-7xl px-4 pb-8 md:pb-14">
//         <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
//           {/* Left scrollable text */}
//           <div className="h-[60vh] overflow-y-auto pr-2 md:h-[75vh] md:pr-6">
//             <div className="space-y-8">
//               {sections.map((s, idx) => (
//                 <div
//                   key={s.id}
//                   ref={(el) => (refs.current[idx] = el)}
//                   className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
//                 >
//                   <h3 className="text-xl font-semibold md:text-2xl">{s.title}</h3>
//                   <p className="mt-2 text-gray-700">{s.text}</p>
//                   <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
//                     <CheckCircle2 className="h-4 w-4" />
//                     <span>Scroll to explore</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right sticky image */}
//           <div className="sticky top-24 hidden h-[60vh] items-center justify-center md:flex md:h-[75vh]">
//             <div className="w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
//               <Image
//                 key={currentImage}
//                 src={currentImage}
//                 alt="Feature preview"
//                 width={900}
//                 height={700}
//                 className="h-full w-full object-cover"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* HOW IT WORKS */}
//       <section id="how" className="mx-auto w-full max-w-7xl px-4 py-14 md:py-20">
//         <div className="mx-auto max-w-2xl text-center">
//           <h2 className="text-3xl font-semibold md:text-4xl">How it works</h2>
//           <p className="mt-3 text-gray-700">From resume upload to confident hiring decisions in 3 steps.</p>
//         </div>
//         <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
//           <StepCard
//             step="01"
//             icon={<Building2 className="h-5 w-5" />}
//             title="Create a role"
//             text="Define competencies and must‑have skills."
//           />
//           <StepCard
//             step="02"
//             icon={<Sparkles className="h-5 w-5" />}
//             title="Upload resumes"
//             text="SmartHire parses and scores candidates instantly."
//           />
//           <StepCard
//             step="03"
//             icon={<Clock className="h-5 w-5" />}
//             title="Interview with structure"
//             text="Use generated questions; compare apples‑to‑apples."
//           />
//         </div>
//       </section>

     
//     </div>
//   )
// }

// /* ------------------------- Small components ------------------------- */
// function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
//       <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white">{icon}</div>
//       <h3 className="mt-4 text-lg font-semibold">{title}</h3>
//       <p className="mt-1 text-gray-700">{text}</p>
//     </div>
//   )
// }

// function StepCard({ step, icon, title, text }: { step: string; icon: React.ReactNode; title: string; text: string }) {
//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
//       <div className="flex items-center gap-3">
//         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white">{icon}</div>
//         <span className="text-sm font-medium text-gray-500">Step {step}</span>
//       </div>
//       <h3 className="mt-3 text-lg font-semibold">{title}</h3>
//       <p className="mt-1 text-gray-700">{text}</p>
//     </div>
//   )
// }

// function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
//       <Quote className="h-5 w-5 text-gray-400" />
//       <p className="mt-3 text-gray-800">“{quote}”</p>
//       <div className="mt-4">
//         <p className="font-semibold">{author}</p>
//         <p className="text-sm text-gray-600">{role}</p>
//       </div>
//     </div>
//   )
// }

// function Stat({ title, value, suffix = '' }: { title: string; value: string; suffix?: string }) {
//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
//       <p className="text-sm text-gray-500">{title}</p>
//       <p className="mt-1 text-4xl font-semibold tracking-tight">{value}<span className="ml-1 text-2xl text-gray-500">{suffix}</span></p>
//     </div>
//   )
// }


'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Quote,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'

// ---- Types ----
type Section = {
  id: string
  title: string
  text: string
  image: string
  alt: string
}

export default function Home() {
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()

  // Sections data (typed; no `as const` to avoid literal-type narrowing)
  const sections = useMemo<Section[]>(
    () => [
      {
        id: 'parse-cv',
        title: 'Parse CVs with AI',
        text:
          'Upload a resume and SmartHire instantly extracts structured data—name, email, skills, experience and more—ready to search and match.',
        image: '/images/CommonImages/homepage1.jpg',
        alt: 'SmartHire parsing a resume into structured fields',
      },
      {
        id: 'generate-questions',
        title: 'Auto-generate interview questions',
        text:
          'For every role, SmartHire crafts tailored, competency-based questions so interviewers stay consistent and unbiased.',
        image: '/images/CommonImages/homepage2.jpg',
        alt: 'Generated interview question set shown in the app',
      },
      {
        id: 'shortlist',
        title: 'Shortlist faster with signals',
        text:
          'Surface the best candidates with skill signals, match scores, and recruiter notes—no more manual tab-hopping.',
        image: '/images/CommonImages/homepage1.jpg',
        alt: 'Candidate list ranked by match score with skill signals',
      },
      {
        id: 'collaborate',
        title: 'Collaborate securely',
        text:
          'Share evaluations, compare candidates, and keep your hiring panel in sync with role-based access and audit trails.',
        image: '/images/CommonImages/homepage2.jpg',
        alt: 'Team members collaborating with role-based access controls',
      },
    ],
    []
  )

  // Wider state types so all images/alts are allowed
  const [currentImage, setCurrentImage] = useState<string>(sections[0].image)
  const [currentAlt, setCurrentAlt] = useState<string>(sections[0].alt)

  // Refs for scroll observer
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (!visible) return
        const index = refs.current.findIndex((ref) => ref === visible.target)
        if (index !== -1) {
          setCurrentImage(sections[index].image)
          setCurrentAlt(sections[index].alt)
        }
      },
      { threshold: 0.55, rootMargin: '0px 0px -10% 0px' }
    )

    refs.current.forEach((el) => el && observer.observe(el))
    return () => refs.current.forEach((el) => el && observer.unobserve(el))
  }, [sections])

  return (
    <div className="relative min-h-screen bg-white text-gray-900">
      {/* BG accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-16 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-black via-gray-900 to-gray-700 opacity-[0.06] blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-gray-800 via-gray-900 to-black opacity-[0.05] blur-3xl" />
      </div>

      {/* HERO */}
      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-2 md:pb-20 md:pt-14">
        <div>
          <motion.h1
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-balance text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl"
          >
            Hire <span className="bg-gradient-to-r from-black via-gray-900 to-gray-700 bg-clip-text text-transparent">smarter</span>,
            not harder.
          </motion.h1>
          <p className="mt-5 max-w-xl text-lg text-gray-700">
            SmartHire turns resumes into structured data, generates tailored interview questions, and helps your team
            shortlist top talent in minutes not weeks.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => router.push('/auth/candidate/sign-up')}
              className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-white shadow-sm transition hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
              aria-label="Submit CV"
            >
              Submit CV <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button
              onClick={() => router.push('/auth/employer/sign-up')}
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-gray-900 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
              aria-label="Sign up as Employer"
            >
              Sign up as Employer
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
            <Image
              src="/images/CommonImages/homepage2.jpg"
              alt="SmartHire dashboard preview"
              width={900}
              height={640}
              priority
              sizes="(min-width: 1024px) 800px, 100vw"
              className="h-auto w-full object-cover"
            />
          </div>
          {/* floating card */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute -bottom-6 left-6 right-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900/90 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">AI Questions Generated</p>
                <p className="text-xs text-gray-600">Consistency for every interview</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="mx-auto w-full max-w-7xl px-4 py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">Why SmartHire</h2>
          <p className="mt-3 text-gray-700">Everything you need to move from application to offer, faster.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <FeatureCard
            icon={<Briefcase className="h-5 w-5" />}
            title="Structured resume parsing"
            text="Extract clean, queryable candidate data—no copy/paste required."
          />
          <FeatureCard
            icon={<Users className="h-5 w-5" />}
            title="Role-based collaboration"
            text="Keep hiring panels aligned with notes, tags, and access controls."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Fair, consistent interviews"
            text="AI-generated, competency-based questions reduce bias and drift."
          />
        </div>
      </section>

      {/* STORY SCROLLER (left text, right image) */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-8 md:pb-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          {/* Left scrollable text */}
          <div className="h-[60vh] overflow-y-auto pr-2 md:h-[75vh] md:pr-6">
            <div className="space-y-8">
              {sections.map((s, idx) => (
                <div
                  key={s.id}
                  ref={(el) => { refs.current[idx] = el }} // return void
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg focus-within:ring-2 focus-within:ring-gray-300"
                  tabIndex={0}
                >
                  <h3 className="text-xl font-semibold md:text-2xl">{s.title}</h3>
                  <p className="mt-2 text-gray-700">{s.text}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Scroll to explore</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right sticky image with smooth cross-fade */}
          <div className="sticky top-24 hidden h-[60vh] items-center justify-center md:flex md:h-[75vh]">
            <div className="relative w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <Image
                    src={currentImage}
                    alt={currentAlt}
                    width={900}
                    height={700}
                    sizes="(min-width: 1024px) 600px, 100vw"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto w-full max-w-7xl px-4 py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">How it works</h2>
          <p className="mt-3 text-gray-700">From resume upload to confident hiring decisions in 3 steps.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <StepCard
            step="01"
            icon={<Building2 className="h-5 w-5" />}
            title="Create a role"
            text="Define competencies and must-have skills."
          />
          <StepCard
            step="02"
            icon={<Sparkles className="h-5 w-5" />}
            title="Upload resumes"
            text="SmartHire parses and scores candidates instantly."
          />
          <StepCard
            step="03"
            icon={<Clock className="h-5 w-5" />}
            title="Interview with structure"
            text="Use generated questions; compare apples-to-apples."
          />
        </div>
      </section>
    </div>
  )
}

/* ------------------------- Small components ------------------------- */
function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-within:ring-2 focus-within:ring-gray-300">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-gray-700">{text}</p>
    </div>
  )
}

function StepCard({ step, icon, title, text }: { step: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white">{icon}</div>
        <span className="text-sm font-medium text-gray-500">Step {step}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-gray-700">{text}</p>
    </div>
  )
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <Quote className="h-5 w-5 text-gray-400" />
      <p className="mt-3 text-gray-800">“{quote}”</p>
      <div className="mt-4">
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </div>
  )
}

function Stat({ title, value, suffix = '' }: { title: string; value: string; suffix?: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-1 text-4xl font-semibold tracking-tight">
        {value}
        <span className="ml-1 text-2xl text-gray-500">{suffix}</span>
      </p>
    </div>
  )
}
