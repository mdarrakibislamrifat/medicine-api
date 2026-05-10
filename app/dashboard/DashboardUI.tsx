"use client";
import { signOut } from "next-auth/react";
import { Copy, Key, CreditCard, LogOut, Zap } from "lucide-react";

interface Props {
  apiKey: string;
  credits: number;
}

export default function DashboardUI({ apiKey, credits }: Props) {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold">Developer Dashboard</h1>
            <p className="text-zinc-500">Manage your medicine API access</p>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 px-4 py-2 rounded-xl border border-zinc-800 transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Credits Card */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Available Credits</span>
            </div>
            <div className="text-4xl font-bold">{credits}</div>
            <p className="text-zinc-500 text-sm mt-2">API Requests remaining</p>
            <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 py-2 rounded-xl font-semibold transition-all">
              Buy More Credits
            </button>
          </div>

          {/* API Key Card */}
          <div className="md:col-span-2 bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4 text-blue-400">
              <Key className="w-5 h-5" />
              <span className="font-medium">Secret API Key</span>
            </div>
            <div className="flex items-center gap-4 bg-black border border-zinc-800 p-4 rounded-2xl">
              <code className="text-zinc-300 font-mono text-sm flex-1 truncate">{apiKey}</code>
              <button 
                onClick={() => navigator.clipboard.writeText(apiKey)}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-all text-zinc-500 hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-zinc-500 text-xs mt-4">Do not share your API key. Keep it secret and secure.</p>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-3xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" /> Quick Start Guide
          </h3>
          <div className="space-y-4 font-mono text-sm">
            <p className="text-zinc-400">// Search for a medicine using your API Key</p>
            <div className="bg-black p-4 rounded-xl border border-zinc-800 overflow-x-auto text-blue-400">
              curl -H "x-api-key: {apiKey}" "{process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/medicines/search?q=Napa"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}