"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (token) {
        router.push('/tasks');
      } else {
        router.push('/login');
      }
    }
  }, [loading, token, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-xl font-semibold">Loading...</p>
    </div>
  );
}