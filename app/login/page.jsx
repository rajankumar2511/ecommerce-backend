"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed");
      setLoading(false);
      return;
    }

if (data.user.role === "vendor") {
  router.push("/vendor/dashboard");
} else {
  router.push("/");
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6">
      
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-10 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Email */}
          <div className="flex items-center bg-white/10 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
            <Mail className="text-gray-400 mr-3" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="bg-transparent w-full outline-none text-white placeholder-gray-400"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-white/10 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
            <Lock className="text-gray-400 mr-3" size={18} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="bg-transparent w-full outline-none text-white placeholder-gray-400"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition duration-300 shadow-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-8">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign up
          </a>
        </p>

      </div>
    </div>
  );
}
