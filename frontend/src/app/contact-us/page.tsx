"use client";
import React from "react";

// Save as: app/contact/page.tsx (Next.js App Router)
// TailwindCSS required. Layout is built with <div> elements and inline SVGs.
// Inputs/textarea are native for usability; the submit is a styled <div>.

export default function ContactPage() {
  return (
    <div className="min-h-[100dvh] bg-white">
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-12">
        {/* Title */}
        <div className="text-center text-3xl font-extrabold tracking-tight text-gray-900">Contact Us</div>
        <div className="mx-auto mt-2 max-w-xl text-center text-sm text-gray-600">
          Get in touch with our team. We're here to help you succeed.
        </div>

        {/* Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Left: Form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-lg font-semibold text-gray-900">Send us a message</div>

            {/* Name row */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-1 text-xs font-medium text-gray-700">First Name</div>
                <input
                  placeholder="John"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gray-400"
                />
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-gray-700">Last Name</div>
                <input
                  placeholder="Doe"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gray-400"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mt-4">
              <div className="mb-1 text-xs font-medium text-gray-700">Email</div>
              <input
                placeholder="john.doe@example.com"
                type="email"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gray-400"
              />
            </div>

            {/* Subject */}
            <div className="mt-4">
              <div className="mb-1 text-xs font-medium text-gray-700">Subject</div>
              <input
                placeholder="How can we help you?"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gray-400"
              />
            </div>

            {/* Message */}
            <div className="mt-4">
              <div className="mb-1 text-xs font-medium text-gray-700">Message</div>
              <textarea
                placeholder="Tell us more about your inquiry..."
                rows={5}
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gray-400"
              />
            </div>

            {/* Submit */}
            <div className="mt-5">
              <div
                className="w-full cursor-pointer rounded-xl bg-gray-900 px-4 py-2 text-center text-sm font-semibold text-white shadow hover:opacity-90"
                onClick={() => alert("Hook this to your form handler")}
              >
                Send Message
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-lg font-semibold text-gray-900">Get in Touch</div>

            {/* Email */}
            <div className="mt-5">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-gray-100 text-gray-700">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="3" y="5" width="18" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="1.6"/>
                  </svg>
                </div>
                <div className="text-base font-semibold text-gray-900">Email</div>
              </div>
              <div className="mt-2 pl-12 text-sm text-gray-700">contact@smarthire.ai</div>
            </div>

            {/* Phone */}
            <div className="mt-6">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-gray-100 text-gray-700">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92v2a2 2 0 01-2.18 2A19.8 19.8 0 013 5.18 2 2 0 015 3h2a2 2 0 012 1.72 12.8 12.8 0 00.7 2.81 2 2 0 01-.45 2.11L8.1 10.9a16 16 0 006 6l1.26-1.18a2 2 0 012.11-.45 12.8 12.8 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-base font-semibold text-gray-900">Phone</div>
              </div>
              <div className="mt-2 pl-12 text-sm text-gray-700">+1 (555) 123-4567</div>
            </div>

            {/* Office */}
            <div className="mt-6">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-gray-100 text-gray-700">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7zm0 9a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-base font-semibold text-gray-900">Office</div>
              </div>
              <div className="mt-2 pl-12 text-sm text-gray-700">
                <div>123 Innovation Drive</div>
                <div>Tech Valley, CA 94000</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
