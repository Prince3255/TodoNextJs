"use client";

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Task {
  id: number;
  title: string;
  description?: string;
}

interface TaskFormProps {
  onTaskAdded: (newTask: Task) => void;
}

export default function TaskForm({ onTaskAdded }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const { token } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('You must be logged in to add a task.');
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error('Failed to add task');
            }

            const newTask = await res.json();
            onTaskAdded(newTask);
            setTitle('');
            setDescription('');

        } catch (err) {
            if (err instanceof Error) {
                setError('Failed to add task');
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md mb-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Add a New Task</h2>
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                ></textarea>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Add Task
            </button>
        </form>
    );
}