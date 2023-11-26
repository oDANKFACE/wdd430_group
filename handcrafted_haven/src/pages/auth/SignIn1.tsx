import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SignInProps {}

const SignIn: React.FC<SignInProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    console.log(`Signing in with email: ${email} and password: ${password}`);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="flex items-center justify-center my-2">
            <Image
              src="/images/HH Color.png"
              alt="Handcrafted Haven Logo"
              width={35}
              height={35}
            />
            <h2 className="text-3xl font-semibold ms-2 text-blue-900">
              Handcrafted Haven
            </h2>
          </div>
          <hr className="my-4" />
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Link
              className="inline-block align-baseline font-bold text-sm text-blue-800 hover:text-blue-900"
              href="/auth/SignUp"
            >
              Sign Up
            </Link>
            <button
              className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleSignIn}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
