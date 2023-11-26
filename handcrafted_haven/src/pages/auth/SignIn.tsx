import { useRef, useEffect } from 'react';
import { getSession, signIn } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import Link from 'next/link';

const Signin = () => {
  const email = useRef('');
  const password = useRef('');

  useEffect(() => {
    const handleEnterPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') handleSignIn();
    };
    window.addEventListener('keydown', handleEnterPress);
    return () => {
      window.removeEventListener('keydown', handleEnterPress);
    };
  }, []);

  const handleSignIn = () => {
    signIn('credentials', {
      email: email.current,
      password: password.current,
    });
  };

  return (
    <div className="flex items-center min-h-screen p-4 bg-gray-800 lg:justify-center">
      <div className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md">
        <div className="p-4 py-6 text-white bg-blue-500 md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly">
          <div className="my-3 text-4xl font-bold tracking-wider text-center">
            <a href="#">LOGROCKET</a>
          </div>
          <p className="mt-6 font-normal text-center text-gray-300 md:mt-0">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
          <p className="flex flex-col items-center justify-center mt-10 text-center">
            <span>Don't have an account?</span>
            <Link href="/auth/SignUp" className="underline">
              Get Started!
            </Link>
          </p>
          <p className="mt-6 text-sm text-center text-gray-300">
            Read our{' '}
            <a href="#" className="underline">
              terms
            </a>{' '}
            and{' '}
            <a href="#" className="underline">
              conditions
            </a>
          </p>
        </div>
        <div className="p-5 bg-white md:flex-1">
          <h3 className="my-4 text-2xl font-semibold text-gray-700">
            Account Login
          </h3>
          <form action="#" className="flex flex-col space-y-5">
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-500"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                autoFocus
                className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200 text-gray-700"
                onChange={(e) => (email.current = e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-500"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:underline focus:text-blue-800"
                >
                  Forgot Password?
                </a>
              </div>
              <input
                type="password"
                id="password"
                className="px-4 py-2 transition duration-300 border border-gray-300 rounded text-gray-700 focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                onChange={(e) => (password.current = e.target.value)}
              />
            </div>
            <div>
              <button
                type="button"
                className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4"
                onClick={handleSignIn}
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getSession({ req });
  if (session) {
    return {
      redirect: { destination: '/' },
    };
  }
  return {
    props: {},
  };
}
