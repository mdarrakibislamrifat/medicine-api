"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/login?message=Account created! Please login.");
    } else {
      alert("Registration failed!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-zinc-400 mt-2 text-sm">Start building with 25k+ medicine data</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-zinc-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-10 text-white focus:border-blue-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-zinc-500 w-5 h-5" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-10 text-white focus:border-blue-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-zinc-500 w-5 h-5" />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-10 text-white focus:border-blue-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? "Creating..." : "Sign Up"}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-zinc-500 mt-6 text-sm">
          Already have an account? <Link href="/login" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}