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
    <nav className="bg-white shadow-md px-4 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="Logo" width={40} height={40} />
        <span className="text-xl font-bold text-gray-800">MyApp</span>
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
        <li>
          <Link href="/" className="hover:text-blue-600">Home</Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-blue-600">About Us</Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>
        </li>
        <li>
          <Link href="/login" className="hover:text-blue-600">Login</Link>
        </li>
        <li>
          <Link href="/register" className="hover:text-blue-600">Register</Link>
        </li>
      </ul>

      {/* User Icon & Name */}
      <div className="flex items-center gap-2">
        {user.loggedIn && (
          <>
            <FaUserCircle className="text-2xl text-gray-600" />
            <span className="text-gray-800 font-medium hidden sm:inline">{user.name}</span>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
