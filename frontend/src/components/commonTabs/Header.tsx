// "use client";
// import Link from "next/link";
// import { useState } from "react";
// import { FaUserCircle } from "react-icons/fa";
// import Image from "next/image";
// import { usePathname } from "next/navigation"; 

// const Navbar = () => {
//   const pathname = usePathname();
//   if (pathname === "/login" || pathname === "/register") return null;

//   // Example user data (replace with auth state if available)
//   const [user, setUser] = useState({
//     name: "Shenali",
//     loggedIn: true,
//   });

//   return (
//     <nav className="bg-[#3d3d3d] shadow-md px-10 py-1 flex items-center justify-between">
//       {/* Logo */}
//       <div className="flex items-center gap-2 p-3 ">
//         <Image src="/images/CommonImages/logoWhite.png" alt="Logo" width={120} height={120} />
//         {/* <span className="text-xl font-bold text-gray-800">MyApp</span> */}
//       </div>

//       {/* Navigation Links */}
//       <ul className="hidden md:flex gap-38 text-[#b0b0b0] font-medium text-lg">
//         <li>
//           <Link href="/" className="hover:text-[#d1d1d1]">Home</Link>
//         </li>
//         <li>
//           <Link href="/about" className="hover:text-[#d1d1d1]">About Us</Link>
//         </li>
//         <li>
//           <Link href="/contact" className="hover:text-[#d1d1d1]">Contact</Link>
//         </li>
//       </ul>
//       <ul className="hidden md:flex gap-18 text-[#b0b0b0] font-medium text-lg">  
//         <li>
//           <Link href="/login" className="hover:text-[#d1d1d1]">Login</Link>
//         </li>
//         <li>
//           <Link href="/register" className="hover:text-[#d1d1d1]">Register</Link>
//         </li>
//       </ul>

//       {/* User Icon & Name */}
//       {/* <div className="flex items-center gap-2">
//         {user.loggedIn && (
//           <>
//             <FaUserCircle className="text-2xl text-[#d1d1d1]" />
//             <span className="text-[#e7e7e7] font-medium hidden sm:inline">{user.name}</span>
//           </>
//         )}
//       </div> */}
//     </nav>
//   );
// };

// export default Navbar;

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface User {
  name: string;
  loggedIn: boolean;
}

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Hide Navbar on login/register pages
  if (pathname === "/login" || pathname === "/register") return null;

  const [user, setUser] = useState<User>({
    name: "",
    loggedIn: false,
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        name: parsedUser.name || parsedUser.email, // fallback to email if no name
        loggedIn: true,
      });
    }
  }, []);

  const handleLogout = () => {
    // Remove token and user info
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Reset user state
    setUser({
      name: "",
      loggedIn: false,
    });

    // Redirect to login page
    router.push("/login");
  };

  return (
    <>
      <nav className="bg-[#3d3d3d] shadow-md px-10 py-1 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 p-3">
          <Image
            src="/images/CommonImages/logoWhite.png"
            alt="Logo"
            width={120}
            height={120}
          />
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex gap-12 text-[#b0b0b0] font-medium text-lg">
          <li>
            <Link href="/" className="hover:text-[#d1d1d1]">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-[#d1d1d1]">
              About Us
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-[#d1d1d1]">
              Contact
            </Link>
          </li>
        </ul>

        {/* User Section or Login/Register */}
        {!user.loggedIn ? (
          <ul className="hidden md:flex gap-8 text-[#b0b0b0] font-medium text-lg">
            <li>
              <Link href="/login" className="hover:text-[#d1d1d1]">
                Login
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-[#d1d1d1]">
                Register
              </Link>
            </li>
          </ul>
        ) : (
          <div className="flex items-center gap-5">
            <FaUserCircle className="text-2xl text-[#d1d1d1]" />
            <span className="text-[#e7e7e7] font-medium hidden sm:inline">
              {user.name}
            </span>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="text-[#b0b0b0] hover:text-white"
              title="Logout"
            >
              <FaSignOutAlt className="text-xl" />
            </button>
          </div>
        )}
      </nav>

      {/* Confirm Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg px-6 py-5 text-center max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
