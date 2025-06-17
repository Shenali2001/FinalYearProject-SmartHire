'use client';
import Image from 'next/image';
import React from 'react';
import Link from "next/link";


const Registration = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white">
      {/* Top Left Gray Triangle */}
      <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[300px] border-l-[#454545] border-t-[300px] border-t-transparent"></div>

      {/* Bottom Right Gray Triangle */}
      <div className="absolute top-0 right-0 w-0 h-0 border-r-[300px] border-r-[#454545] border-b-[300px] border-b-transparent"></div>

      {/* Registration Card */}
      <div className="z-10 w-full max-w-md bg-white shadow-2xl border border-gray-300 rounded-xl px-8 py-4 text-center">
        <Image src="/images/CommonImages/logoBlack.png" alt='Smart-Hire' className="mx-auto mb-0  object-contain" width={150} height={150} />
        <h2 className="text-3xl font-semibold mb-6">Registration</h2>

        <div className="text-left space-y-4">
          <div>
            <label className="block font-semibold mb-1"> Your Name :</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded-xl bg-gray-200 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1"> Your Email :</label>
            <input
              type="text"
              placeholder="Your Email "
              className="w-full px-4 py-2 border rounded-xl bg-gray-200 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Password :</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-xl bg-gray-200 placeholder-gray-500"
            />
          </div>
        </div>

        <button className="mt-6 w-full bg-[#454545] text-white font-bold py-2 rounded-xl hover:bg-[#3d3d3d] transition">
          Registration
        </button>
        <p className='mt-3 text-left'>Already have an account ?  <Link href="/login" className='font-bold text-[#3d3d3d]'>Login</Link> </p> 
      </div>
    </div>
  );
};

export default Registration;
