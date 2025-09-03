'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import Link from "next/link";
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:8000/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const { access_token, user } = response.data;

        // Optionally save token to localStorage for later API calls
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));

        // Show success modal
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          router.push('/'); // Navigate to home
        }, 2000);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert('Invalid email or password. Please try again.');
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

      {/* Login Card */}
      <div className="z-10 w-full max-w-md bg-white shadow-2xl border border-gray-300 rounded-xl px-8 py-4 text-center">
        <Image src="/images/CommonImages/logoBlack.png" alt='Smart-Hire' className="mx-auto mb-0 object-contain" width={150} height={150} />
        <h2 className="text-3xl font-semibold mb-6">Login</h2>

        <div className="text-left space-y-4">
          <div>
            <label className="block font-semibold mb-1">Your Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              className="w-full px-4 py-2 border rounded-xl bg-gray-200 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-xl bg-gray-200 placeholder-gray-500"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`mt-6 w-full bg-[#454545] text-white font-bold py-2 rounded-xl hover:bg-[#3d3d3d] transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className='mt-3 text-left mb-5'>
          Don't have an account?{' '}
          <Link href="/register" className='font-bold text-[#3d3d3d]'>
            Register
          </Link>
        </p>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg px-12 py-10 text-center">
            <h3 className="text-2xl font-semibold text-Black mb-2">
              Login Successful 🎉
            </h3>
            <p className="text-gray-600">Redirecting to home...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
