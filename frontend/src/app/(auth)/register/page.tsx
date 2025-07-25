"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Registration failed');
            }
            alert('Registration successful! Please log in.');
            router.push('/login');
        } catch (err) {
            setError('Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-xl space-y-5 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center">Create an Account</h1>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-md" required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-md" required />
                <button type="submit" className="w-full p-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Register</button>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <p className="text-center">Already have an account? <Link href="/login" className="text-indigo-600 hover:underline">Login</Link></p>
            </form>
        </div>
    );
}