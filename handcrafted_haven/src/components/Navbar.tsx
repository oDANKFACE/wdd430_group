import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut, signIn } from 'next-auth/react';
import { SessionUser } from '@/types';

const Navbar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('Home');

  const user = session?.user as SessionUser;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut();
  };

  const handleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signIn();
  };

  useEffect(() => {
    const currentUrl = router.asPath;
    setActivePage(currentUrl);
  }, []);

  return (
    <nav className="border-gray-200 bg-gray-900 w-full">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            src="/images/HH White.png"
            alt="Handcrafted Haven Logo"
            width={35}
            height={35}
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Handcrafted Haven
          </span>
        </Link>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`w-full md:w-auto md:flex md:flex-grow md:items-center md:justify-end ${
            isMenuOpen ? 'block' : 'hidden'
          }`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 bg-gray-800 md:bg-gray-900 border-gray-700">
            <li>
              <Link
                href="/"
                className={`block py-2 px-3 rounded md:p-0  ${
                  activePage === '/'
                    ? 'md:text-secondary md:bg-transparent bg-secondary text-dark'
                    : 'md:hover:bg-transparent md:hover:text-secondary hover:bg-gray-700 text-white'
                }`}
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className={`block py-2 px-3 rounded md:p-0  ${
                  activePage.includes('/products')
                    ? 'md:text-secondary md:bg-transparent bg-secondary text-dark'
                    : 'md:hover:bg-transparent md:hover:text-secondary hover:bg-gray-700 text-white'
                }`}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/artists"
                className={`block py-2 px-3 rounded md:p-0  ${
                  activePage.includes('/artists')
                    ? 'md:text-secondary md:bg-transparent bg-secondary text-dark'
                    : 'md:hover:bg-transparent md:hover:text-secondary hover:bg-gray-700 text-white'
                }`}
              >
                Artists
              </Link>
            </li>
            {status === 'authenticated' && (
              <li>
                <Link
                  href={`/artists/${user?.id}`}
                  className={`block py-2 px-3 rounded md:p-0  ${
                    activePage.includes('/artists/')
                      ? 'md:text-secondary md:bg-transparent bg-secondary text-dark'
                      : 'md:hover:bg-transparent md:hover:text-secondary hover:bg-gray-700 text-white'
                  }`}
                >
                  Profile
                </Link>
              </li>
            )}
            {status === 'authenticated' && user.role === 'ADMIN' && (
              <li>
                <Link
                  href={`/admin/dashboard`}
                  className={`block py-2 px-3 rounded md:p-0  ${
                    activePage.includes('/admin')
                      ? 'md:text-secondary md:bg-transparent bg-secondary text-dark'
                      : 'md:hover:bg-transparent md:hover:text-secondary hover:bg-gray-700 text-white'
                  }`}
                >
                  Admin
                </Link>
              </li>
            )}
            {status === 'unauthenticated' && (
              <li>
                <a
                  onClick={handleSignIn}
                  href="#"
                  className="block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-secondary md:p-0 text-white hover:bg-gray-700 md:hover:bg-transparent"
                >
                  Sign In
                </a>
              </li>
            )}

            {status === 'authenticated' && (
              <li>
                <a
                  onClick={handleSignOut}
                  href="#"
                  className="block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-secondary md:p-0 text-white hover:bg-gray-700 md:hover:bg-transparent"
                >
                  Sign Out
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
