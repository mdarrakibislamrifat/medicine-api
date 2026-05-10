"use client";
import { signOut, useSession } from "next-auth/react";
import { Copy, Key, CreditCard, LogOut, Zap } from "lucide-react";

interface Props {
  apiKey: string;
  credits: number;
}

export default function DashboardUI({ apiKey, credits }: Props) {
  const { data: session } = useSession();


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
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Developer Dashboard
            </h1>
            <p className="text-zinc-500 mt-1">
              Manage your medicine API access and credits
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 px-4 py-2 rounded-xl border border-zinc-800 transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Credits Card */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4 text-emerald-400">
                <CreditCard className="w-5 h-5" />
                <span className="font-medium text-sm">Available Credits</span>
              </div>
              <div className="text-5xl font-bold">{credits}</div>
              <p className="text-zinc-500 text-xs mt-2 uppercase tracking-wider">
                Requests Remaining
              </p>
            </div>

            <button
              onClick={() => handlePayment(100, 500)} 
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
            >
              Buy 500 Credits (100 BDT)
            </button>
          </div>

          {/* API Key Card */}
          <div className="md:col-span-2 bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4 text-blue-400">
              <Key className="w-5 h-5" />
              <span className="font-medium text-sm">Your Secret API Key</span>
            </div>
            <div className="flex items-center gap-4 bg-black border border-zinc-800 p-4 rounded-2xl group">
              <code className="text-zinc-300 font-mono text-sm flex-1 truncate">
                {apiKey}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(apiKey);
                  alert("API Key copied to clipboard!");
                }}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-all text-zinc-500 hover:text-white border border-zinc-800"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-6 space-y-2">
              <p className="text-zinc-400 text-sm italic">
                "Keep this key private. Do not share it in client-side code."
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-zinc-800 rounded text-[10px] text-zinc-500 uppercase">
                  Production Ready
                </span>
                <span className="px-2 py-1 bg-zinc-800 rounded text-[10px] text-zinc-500 uppercase">
                  HTTPS Only
                </span>
              </div>
            </div>
          </div>
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
              "https://medicine-api-nine.vercel.app/api/medicines/search?q=Napa"
            </div>
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
