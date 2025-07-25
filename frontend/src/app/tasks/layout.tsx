"use client";

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface TasksLayoutProps {
  children: React.ReactNode;
}


export default function TasksLayout({ children }: TasksLayoutProps) {
    const { token, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !token) {
            router.push('/login');
        }
    }, [token, loading, router]);

    if (loading || !token) {
        return <p className="text-center p-10">Loading...</p>;
    }

    return <>{children}</>;
}