"use client";

import { useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/app/firebase"
import { useRouter } from "next/navigation"
import { UserService } from "@/modules/user.service"

export default function SignUp() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const userService = new UserService()

  const handleSignUp = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
          // Check if user already exists
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("name", "==", name));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
              setError("User already exists.");
              setLoading(false);
              return;
          }

          // Create new user
          await userService.createUser(name, password);
          console.log("Sign Up successful for:", name);
          router.push("/");

      } catch (err) {
          console.error("Sign Up error:", err);
          setError("Something went wrong.");
      } finally {
          setLoading(false);
      }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Never Idel Logo"
          className="mx-auto mb-4 h-16 w-auto rounded-lg"
        />

        <h2 className="text-2xl font-bold text-center mb-6">
          Your gateway to organizing and joining epic raids.
        </h2>

        <form onSubmit={handleSignUp} className="space-y-4">
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
            disabled={loading}
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Do you have an account?{" "}
          <a className="text-indigo-600 hover:underline  cursor-pointer"
            onClick={() => router.push("/")}
          >
            Sign In
          </a>
        </p>
        {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
        {loading && <p className="text-gray-500 text-sm text-center mt-4">Loading...</p>}
      </div>
    </div>
  );
}
