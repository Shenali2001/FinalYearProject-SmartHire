"use client";
import React from 'react';
import Image from "next/image";
import { usePathname } from "next/navigation"; 

const Footer = () => {

  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <div className="mt-5">
      <div className="flex flex-col md:flex-row">
        
        {/* Left section with logo and tagline */}
        <div className="basis-full md:basis-1/4 bg-[#3d3d3d] lg:rounded-tr-[80px] flex justify-center md:justify-start items-center py-6 md:py-0">
          <div className="mt-10 h-[150px] md:h-[200px] ml-0 md:ml-8 lg:ml-12 flex flex-col items-center md:items-start">
            <Image
              src="/images/CommonImages/logoWhite.png"
              alt="logo"
              width={150}
              height={150}
              className="mb-3"
            />
            <p className="text-[#e7e7e7] text-md text-center md:text-left">
              AI-Powered Virtual Interviewer
            </p>
          </div>
        </div>

        {/* Right section with description and links */}
        <div className="basis-full md:basis-3/4 bg-[#3d3d3d] lg:rounded-tl-[80px] flex items-center justify-center py-6 md:py-0">
          <div className="mt-10 h-auto md:h-[200px] px-4 md:px-0 text-center md:text-left max-w-6xl">
            <h3 className="text-xl md:text-2xl font-semibold text-[#f6f6f6] mb-2">
              AI-Powered Interview Platform
            </h3>
            <p className="text-sm md:text-md text-[#e7e7e7] mb-2">
              Enhancing recruitment through ethical AI, adaptive interviews, and secure candidate verification.
            </p>
            <p className="text-xs md:text-sm text-[#e7e7e7] mb-4">
              © 2025 AIInterviewPro. All rights reserved.
            </p>
            <div className="text-xs space-x-2 md:space-x-4 text-[#b0b0b0]">
              <a href="/privacy-policy" className="hover:text-white">Privacy Policy</a>
              <span>|</span>
              <a href="/terms" className="hover:text-white">Terms of Service</a>
              <span>|</span>
              <a href="/contact" className="hover:text-white">Contact Us</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Footer;
