import React, { FormEvent, useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

interface SignInProps {}

const SignIn: React.FC<SignInProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!validateForm()) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
          }),
        },
      );

      const response = await res.json();
      if (res.ok) {
        return signIn();
      } else {
        throw response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validateForm = () => {
    let formIsValid = true;
    if (!email || !password || !firstName || !lastName || !repeatPassword) {
      formIsValid = false;
    }
    if (password !== repeatPassword) {
      formIsValid = false;
    }
    return formIsValid;
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleRegistration}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
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
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight duration-300 focus:outline-none focus:shadow-outline focus:border-transparent focus:ring-4 focus:ring-secondary"
              id="firstName"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight duration-300 focus:outline-none focus:shadow-outline focus:border-transparent focus:ring-4 focus:ring-secondary"
              id="lastName"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight duration-300 focus:outline-none focus:shadow-outline focus:border-transparent focus:ring-4 focus:ring-secondary"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight duration-300 focus:outline-none focus:shadow-outline focus:border-transparent focus:ring-4 focus:ring-secondary"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="repeatPassword"
            >
              Repeat Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight duration-300 focus:outline-none focus:shadow-outline focus:border-transparent focus:ring-4 focus:ring-secondary"
              id="repeatPassword"
              type="password"
              placeholder="Password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => signIn()}
              className="bg-white border-2 border-gray-400 hover:bg-gray-200 hover:text-dark text-dark text-lg font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-lg font-semibold text-dark transition-colors duration-300 bg-secondary rounded-md shadow hover:bg-emerald-400 focus:outline-none focus:ring-emerald-200 focus:ring-4"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
