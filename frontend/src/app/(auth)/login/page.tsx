"use client";

import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Invalid credentials');
            }
            const { token } = await res.json();
            login(token);
            router.push('/tasks');
        } catch (err) {
            setError(err?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-xl space-y-5 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center">Login to Your Account</h1>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-md" required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-md" required />
                <button type="submit" className="w-full p-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Login</button>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <p className="text-center">No account? <Link href="/register" className="text-indigo-600 hover:underline">Register</Link></p>
            </form>
        </div>
    );
}