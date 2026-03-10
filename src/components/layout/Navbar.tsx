'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export function Navbar() {
  const { data: session, status } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  return (
    <header className="bg-maroon shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white">
            GBU Swap
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              href="/items"
              className="text-white/90 hover:text-white font-medium transition"
            >
              Browse
            </Link>

            {isLoading ? (
              // Loading state
              <div className="w-8 h-8 rounded-full bg-white/30 animate-pulse" />
            ) : isAuthenticated ? (
              // Authenticated user menu
              <>
                <Link
                  href="/items/new"
                  className="bg-white text-maroon px-4 py-2 rounded-lg hover:bg-white/90 transition font-medium"
                >
                  Sell Item
                </Link>

                <Link
                  href="/messages"
                  className="text-white/90 hover:text-white font-medium transition"
                >
                  Messages
                </Link>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white text-maroon flex items-center justify-center font-bold text-sm">
                        {session.user.name?.charAt(0).toUpperCase() ||
                          session.user.email?.charAt(0).toUpperCase() ||
                          'U'}
                      </div>
                    )}
                    <span className="hidden sm:block text-sm font-medium text-white/90">
                      {session.user.name || session.user.username}
                    </span>
                    <svg
                      className={`w-4 h-4 text-white/70 transition-transform ${
                        isUserMenuOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {session.user.name || session.user.username}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {session.user.email}
                          </p>
                        </div>
                        <Link
                          href={`/profile/${session.user.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/my-items"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Items
                        </Link>
                        <Link
                          href="/messages"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Messages
                        </Link>
                        <div className="border-t border-gray-100 mt-1">
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              signOut({ callbackUrl: '/' });
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              // Guest links
              <>
                <Link
                  href="/login"
                  className="text-white/90 hover:text-white font-medium transition"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-maroon px-4 py-2 rounded-lg hover:bg-white/90 transition font-medium"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
