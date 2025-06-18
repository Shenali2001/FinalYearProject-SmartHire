"use client";
import Link from "next/link";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";

const Navbar = () => {
  // Example user data (replace with auth state if available)
  const [user, setUser] = useState({
    name: "Shenali",
    loggedIn: true,
  });

  return (
    <nav className="bg-[#3d3d3d] shadow-md px-10 py-1 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2 ">
        <Image src="/images/CommonImages/logoWhite.png" alt="Logo" width={100} height={100} />
        {/* <span className="text-xl font-bold text-gray-800">MyApp</span> */}
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex gap-38 text-[#b0b0b0] font-medium text-lg">
        <li>
          <Link href="/" className="hover:text-[#d1d1d1]">Home</Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-[#d1d1d1]">About Us</Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-[#d1d1d1]">Contact</Link>
        </li>
      </ul>
      <ul className="hidden md:flex gap-18 text-[#b0b0b0] font-medium text-lg">  
        <li>
          <Link href="/login" className="hover:text-[#d1d1d1]">Login</Link>
        </li>
        <li>
          <Link href="/register" className="hover:text-[#d1d1d1]">Register</Link>
        </li>
      </ul>

      {/* User Icon & Name */}
      {/* <div className="flex items-center gap-2">
        {user.loggedIn && (
          <>
            <FaUserCircle className="text-2xl text-[#d1d1d1]" />
            <span className="text-[#e7e7e7] font-medium hidden sm:inline">{user.name}</span>
          </>
        )}
      </div> */}
    </nav>
  );
};

export default Navbar;
