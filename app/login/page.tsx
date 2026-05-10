"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    signIn("credentials", { email, password, callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-zinc-400 mt-2 text-sm">Login to manage your API keys</p>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full bg-white text-black font-semibold py-3 rounded-xl mb-6 flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="google" />
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0b0b0b] px-2 text-zinc-500">Or continue with</span></div>
        </div>

        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-zinc-500 w-5 h-5" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-10 text-white focus:border-blue-500 outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-zinc-500 w-5 h-5" />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-10 text-white focus:border-blue-500 outline-none transition-all"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="w-full bg-zinc-100 text-black font-semibold py-3 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" />
            Login
          </button>
        </form>

        <p className="text-center text-zinc-500 mt-6 text-sm">
          New here? <Link href="/register" className="text-blue-400 hover:underline">Create account</Link>
        </p>
      </div>
    </div>
  );
}