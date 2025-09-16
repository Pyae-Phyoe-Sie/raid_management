"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function Login() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    // const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        console.log("Attempting login with", { name, password });
        e.preventDefault();
        setLoading(true);

        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("name", "==", name));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError("User not found.");
            } else {
                const doc = querySnapshot.docs[0];
                const user = { id: doc.id, ...(doc.data() as Omit<IUser, "id">) };

                if (user.password === password) {
                    localStorage.setItem("token", user.id);
                    localStorage.setItem("role", user.role ?? "");
                    console.log("Login successful:", user);
                } else {
                    setError("Incorrect password.");
                }
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     // Fetch users after auth
    //     const fetchUsers = async () => {
    //     try {
    //         const usersCollection = collection(db, "users");
    //         const snapshot = await getDocs(usersCollection);
    //         const usersList: IUser[] = snapshot.docs.map((doc) => ({
    //         id: doc.id,
    //         ...(doc.data() as Omit<IUser, "id">),
    //         }));
    //         setUsers(usersList);
    //         console.log("Fetched users:", usersList);
    //     } catch (error) {
    //         console.error("Error fetching users:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    //     };

    //     fetchUsers();
    // }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Don't have an account?{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            Sign up
          </a>
        </p>
        {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
        {loading && <p className="text-gray-500 text-sm text-center mt-4">Loading...</p>}
      </div>
    </div>
  );
}
