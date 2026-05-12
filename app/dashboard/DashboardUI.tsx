"use client";
import { signOut, useSession } from "next-auth/react";
import {
  Copy,
  Key,
  CreditCard,
  LogOut,
  Zap,
  EyeOff,
  Eye,
  Home,
} from "lucide-react";
import UsageChart from "../components/UsageChart";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

interface Props {
  apiKey: string;
  credits: number;
}

export default function DashboardUI({ apiKey, credits }: Props) {
  const { data: session } = useSession();
  const [showKey, setShowKey] = useState(false);

  const handlePayment = async (amount: number, creditToBuy: number) => {
    try {
      const res = await fetch("/api/payment/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // @ts-ignore
          userId: session?.user?.id || "",
          amount: amount,
          credits: creditToBuy,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.replace(data.url);
      } else {
        alert("Payment Error: " + (data.error || "Something went wrong"));
      }
    } catch (error) {
      console.error("Payment failed", error);
      alert("Technical error occurred. Check console.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8 md:mb-12">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Developer Dashboard
            </h1>
            <p className="text-zinc-500 mt-1 text-sm md:text-base">
              Manage your medicine API access and credits
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 text-zinc-400 hover:text-white px-3 py-2 rounded-xl border border-zinc-800 transition-all text-xs md:text-sm font-medium"
            >
              <Home className="w-4 h-4" />{" "}
              <span className="whitespace-nowrap">Home Page</span>
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 px-3 py-2 rounded-xl border border-zinc-800 transition-all text-xs md:text-sm font-medium"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {/* Credits Card */}
          <div className="relative overflow-hidden bg-zinc-900/50 border border-zinc-800 p-5 md:p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-between group">
            {/* Background Glow */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-600/10 blur-[50px] group-hover:bg-blue-600/20 transition-all" />

            <div>
              <div className="flex items-center gap-3 mb-4 text-blue-400">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="font-medium text-xs md:text-sm text-zinc-400">
                  Available Credits
                </span>
              </div>
              {/* Mobile-e text-5xl ar desktop-e text-6xl kora hoyeche */}
              <div className="text-5xl md:text-6xl font-extrabold tracking-tighter text-white">
                {credits}
              </div>

              <p className="text-[11px] md:text-sm text-zinc-500 mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Resets to 10 at midnight (UTC)
              </p>
            </div>

            {/* Buy Credits Button - Jodi show korte chao */}
            {/* <button
              onClick={() => handlePayment(100, 500)}
              className={`w-full mt-6 md:mt-8 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 
        ${
          credits === 0
            ? "bg-blue-600 hover:bg-blue-500 text-white animate-pulse shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            : "bg-white text-black hover:bg-zinc-200"
        }`}
            >
              <Zap
                className={`w-3.5 h-3.5 ${credits === 0 ? "fill-white" : "fill-current"}`}
              />
              {credits === 0 ? "Get More Credits" : "Buy Credits"}
            </button> */}
          </div>

          {/* API Key Card */}
          <div className="md:col-span-2 bg-zinc-900/50 border border-zinc-800 p-5 md:p-6 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4 text-blue-400">
              <Key className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-medium text-xs md:text-sm">
                Your Secret API Key
              </span>
            </div>

            {/* Key Display Area */}
            <div className="flex items-center gap-2 md:gap-4 bg-zinc-950 border border-zinc-800 p-3 md:p-4 rounded-2xl group">
              <code className="text-zinc-300 font-mono text-xs md:text-sm flex-1 truncate pr-2">
                {showKey ? apiKey : "•".repeat(12)}{" "}
                {/* Repeat komano hoyeche jate overflow na hoy */}
              </code>
              <div className="flex gap-1 md:gap-2">
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-colors"
                >
                  {showKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Key className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(apiKey);
                    toast.success("Copied!");
                  }}
                  className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-5 md:mt-6 space-y-3">
              <p className="text-zinc-500 text-[11px] md:text-sm italic leading-relaxed">
                "Keep this key private. Do not share it in client-side code."
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-zinc-800/50 border border-zinc-700/50 rounded text-[9px] md:text-[10px] text-zinc-400 uppercase tracking-wider">
                  Production Ready
                </span>
                <span className="px-2 py-1 bg-zinc-800/50 border border-zinc-700/50 rounded text-[9px] md:text-[10px] text-zinc-400 uppercase tracking-wider">
                  HTTPS Only
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 w-full overflow-hidden">
          <UsageChart />
        </div>

        {/* Quick Start Guide */}
        <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-3xl mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" /> Quick Start Guide
          </h3>
          <div className="space-y-4 font-mono text-sm">
            <p className="text-zinc-400">
              // Search for a medicine (Try searching 'Napa')
            </p>
            <div className="bg-black p-4 rounded-xl border border-zinc-800 overflow-x-auto text-blue-400">
              curl -H "x-api-key: {apiKey}"
              "https://medicine-api-rifat.vercel.app/api/medicines/search?q=Napa"
            </div>
            <p className="text-sm text-zinc-400 mt-2">
              * Free tier users get 10 requests daily. Paid credits never
              expire.
            </p>
          </div>
        </div>

        {/* API Reference Table */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden mb-8">
          <div className="p-6 border-b border-zinc-800 bg-zinc-900/50">
            <h3 className="text-xl font-semibold">Endpoint Reference</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900/50 text-zinc-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Endpoint</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                <tr className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-emerald-400 font-bold">GET</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-blue-400">
                    /api/medicines/search
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    Search by Name, Generic, or Company
                  </td>
                  <td className="px-6 py-4 text-right text-zinc-300">
                    1 Credit
                  </td>
                </tr>
                <tr className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-blue-400 font-bold">GET</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-blue-400">
                    /api/medicines/[id]
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    Get complete data for a single medicine
                  </td>
                  <td className="px-6 py-4 text-right text-zinc-300">
                    1 Credit
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* JSON Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-500 uppercase px-2">
              Sample Success Response
            </h4>
            <pre className="bg-black/50 p-6 rounded-3xl border border-zinc-800 text-[12px] text-blue-300 font-mono leading-relaxed overflow-x-auto">
              {`{
  "status": "success",
  "data": [
    {
      "name": "Napa",
      "generic": "Paracetamol",
      "strength": "500mg",
      "company": "Beximco"
    }
  ],
  "remaining_credits": ${credits - 1}
}`}
            </pre>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-500 uppercase px-2">
              Sample Error Response
            </h4>
            <pre className="bg-black/50 p-6 rounded-3xl border border-zinc-800 text-[12px] text-red-300 font-mono leading-relaxed overflow-x-auto">
              {`{
  "status": "error",
  "message": "Insufficient credits",
  "code": 402
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
