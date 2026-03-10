'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');
  const registered = searchParams.get('registered');

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(error ? 'Invalid credentials' : '');
  const [successMessage, setSuccessMessage] = useState(registered ? 'Account created successfully! Please sign in.' : '');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setFormError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      setFormError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {successMessage}
        </div>
      )}
      {formError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
            placeholder="you@university.edu"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Sign in
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">Don&apos;t have an account? </span>
        <Link href="/register" className="text-maroon hover:text-maroon-dark font-medium">
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-maroon">
            CampusSwap
          </Link>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        {/* Form wrapped in Suspense */}
        <Suspense fallback={<div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 h-64 animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
