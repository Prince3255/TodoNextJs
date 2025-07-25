"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import TaskForm from "../../components/TaskForm";

interface Task {
  id: number;
  title: string;
  description?: string;
}

export default function TasksPage() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      if (token) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/get/tasks`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!res.ok)
            throw new Error(
              "Failed to fetch tasks. Your session might have expired."
            );
          const data = await res.json();
          setTasks(data);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message || "An error occurred.");
          } else {
            setError("An unknown error occurred");
          }
        }
      }
    };
    fetchTasks();
  }, [token]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleTaskAdded = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <main className="container mx-auto max-w-3xl p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
        <button
          onClick={handleLogout}
          className="py-2 px-4 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <TaskForm onTaskAdded={handleTaskAdded} />

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Your Task List
      </h2>
      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-bold text-lg">{task.title}</h3>
              {task.description && (
                <p className="text-gray-600">{task.description}</p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <p className="text-gray-500">
              You have no tasks yet. Add one above!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
