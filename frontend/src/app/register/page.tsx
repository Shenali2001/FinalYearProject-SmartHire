'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import Link from "next/link";
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface UserDetails {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  role: string;
}

const Registration = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserDetails>({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    role: 'candidate', // Default role is candidate
  });

  const [showModal, setShowModal] = useState(false); // For success popup
  const [loading, setLoading] = useState(false); // Optional: For button loading state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegistration = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:8000/register', user);

      if (response.status === 200 || response.status === 201) {
        setShowModal(true); // Show success modal
        setTimeout(() => {
          setShowModal(false);
          router.push('/login'); // Navigate to login after 2s
        }, 2000);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      alert('Registration failed. Check your details or try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white">
      {/* Top Left Gray Triangle */}
      <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[300px] border-l-[#454545] border-t-[300px] border-t-transparent"></div>

      {/* Bottom Right Gray Triangle */}
      <div className="absolute top-0 right-0 w-0 h-0 border-r-[300px] border-r-[#454545] border-b-[300px] border-b-transparent"></div>

      {/* Registration Card */}
      <div className="z-10 w-full max-w-md bg-white shadow-2xl border border-gray-300 rounded-xl px-8 py-4 text-center">
        <Image
          src="/images/CommonImages/logoBlack.png"
          alt="Smart-Hire"
          className="mx-auto mb-0 object-contain"
          width={150}
          height={150}
        />
        <h2 className="text-3xl font-semibold mb-6">Registration</h2>

        <div className="text-left space-y-4">
          <div>
            <label className="block font-semibold mb-1">Your Name:</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded-xl bg-gray-200 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Your Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              placeholder="Your Email"
              className="w-full px-4 py-2 border rounded-xl bg-gray-200 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Password:</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-xl bg-gray-200 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Phone Number:</label>
            <input
              type="text"
              name="phone_number"
              value={user.phone_number}
              onChange={handleInputChange}
              placeholder="Your Phone Number"
              className="w-full px-4 py-2 border rounded-xl bg-gray-200 placeholder-gray-500"
            />
          </div>
        </div>

        <button
          onClick={handleRegistration}
          disabled={loading}
          className={`mt-6 w-full bg-[#454545] text-white font-bold py-2 rounded-xl hover:bg-[#3d3d3d] transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="mt-3 text-left mb-5">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-[#3d3d3d]">
            Login
          </Link>
        </p>
      </div>

      {/* Success Modal */}
      {showModal && (
        // <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg px-12 py-10 text-center">
            <h3 className="text-2xl font-bold text-Black mb-2">
              Registration Successful 🎉
            </h3>
            <p className="text-gray-600">Redirecting to login...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;
