import { Database, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import InteractiveDemo from "./components/InteractiveDemo";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-emerald-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-emerald-400 rounded-lg flex items-center justify-center font-bold text-black">
            M
          </div>
          <span className="text-xl font-bold tracking-tight">
            MedEx <span className="text-blue-500">API</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
          <Link href="#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#docs" className="hover:text-white transition-colors">
            Documentation
          </Link>
          <Link href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          <Link
            href={session ? "/dashboard" : "/login"}
            className="px-5 py-2 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-all"
          >
            {session ? "Go to Dashboard" : "Get API Key"}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Now tracking 25,132+ Medicines in Bangladesh
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter max-w-4xl mb-8">
          The most powerful <br />
          <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Medicine Data API
          </span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Access real-time pharmaceutical data, generic information, and dosages
          with our lightning-fast API. Built for pharmacies, healthcare apps,
          and researchers.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/search"
            className="h-14 px-8 flex items-center justify-center bg-blue-600 rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          >
            Explore Database
          </Link>
          <Link
            href="#docs"
            className="h-14 px-8 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-2xl font-semibold hover:bg-zinc-800 transition-all"
          >
            Read Documentation
          </Link>
        </div>

        {/* API Preview / Code Mockup */}
        <InteractiveDemo/>
      </main>

      {/* Stats Section */}
      <section className="border-t border-zinc-900 bg-black/50 py-20">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold">25k+</div>
            <div className="text-sm text-zinc-500">Medicines</div>
          </div>
          <div>
            <div className="text-3xl font-bold">99.9%</div>
            <div className="text-sm text-zinc-500">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{"<"}100ms</div>
            <div className="text-sm text-zinc-500">Latency</div>
          </div>
          <div>
            <div className="text-3xl font-bold">FREE</div>
            <div className="text-sm text-zinc-500">For Developers</div>
          </div>
        </div>
      </section>

      {/* ১. Features Section - Stats এর নিচে বসান */}
      <section id="features" className="max-w-7xl mx-auto px-8 py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Built for scale.
          </h2>
          <p className="text-zinc-500">
            Everything you need to build next-gen healthcare apps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
            <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Our edge-cached API ensures responses under 100ms globally,
              keeping your app snappy.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Verified Data</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Directly scraped and verified from official pharmaceutical records
              in Bangladesh.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 transition-all group">
            <div className="w-12 h-12 bg-purple-600/10 rounded-xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure Access</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Robust API key management and encrypted endpoints for your
              production needs.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-8 py-32 relative">
        {/* Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Pricing for Local Innovators
          </h2>
          <p className="text-zinc-500">
            Start for free and scale with premium pharmaceutical data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
          {/* Free Plan */}
          <div className="p-8 rounded-[2.5rem] bg-zinc-900/40 border border-zinc-800 backdrop-blur-sm flex flex-col">
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-2">Developer</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">৳০</span>
                <span className="text-zinc-500 text-sm">/মাস</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {[
                "১০টি ফ্রি ক্রেডিট / প্রতিদিন",
                "২৫ হাজার+ ওষুধের ডেটাবেজ",
                "কমিউনিটি সাপোর্ট",
                "বেসিক ড্রাগ ইনফরমেশন",
              ].map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-zinc-400"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={session ? "/dashboard" : "/login"}
              className="w-full py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all text-center"
            >
              ফ্রি শুরু করুন
            </Link>
          </div>

          {/* Startup Plan - Most Popular */}
          <div className="p-8 rounded-[2.5rem] bg-gradient-to-b from-blue-600/15 to-transparent border border-blue-500/30 backdrop-blur-sm flex flex-col relative scale-105 shadow-2xl shadow-blue-500/10">
            <div className="absolute top-6 right-6 px-3 py-1 bg-blue-600 rounded-full text-[10px] font-bold tracking-widest uppercase">
              Best Value
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-2">Startup Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">৳৯৯৯</span>
                <span className="text-zinc-500 text-sm">/মাস</span>
              </div>
              <p className="text-blue-400/80 mt-2 text-xs font-medium">
                ছোট ফার্মাসি বা হেলথ-অ্যাপের জন্য
              </p>
            </div>

            <ul className="space-y-4 mb-10 flex-1 text-zinc-300">
              {[
                "৫০০টি ক্রেডিট / প্রতিদিন",
                "মেডিসিন প্রাইস আপডেট এলার্ট",
                "বিকোশ/নগদ পেমেন্ট গেটওয়ে সাপোর্ট",
                "বজবজ (Low Latency) লোকাল সার্ভার",
                "প্রায়োরিটি ইমেইল সাপোর্ট",
                "অ্যাডভান্সড ফিল্টারিং API",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-600/20">
              এখনই কিনুন
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-8 rounded-[2.5rem] bg-zinc-900/40 border border-zinc-800 backdrop-blur-sm flex flex-col">
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-2">Business</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">৳২৪৯৯</span>
                <span className="text-zinc-500 text-sm">/মাস</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-1 text-zinc-500">
              {[
                "আনলিমিটেড ক্রেডিট / প্রতিদিন",
                "হোয়াটসঅ্যাপ সাপোর্ট সরাসরি",
                "ফুল ডেটাবেজ এক্সপোর্ট (CSV/JSON)",
                "ডেডিকেটেড হোস্টিং ইন্টিগ্রেশন",
                "কাস্টম ব্র্যান্ডিং অপশন",
                "৯৯.৯% আপটাইম গ্যারান্টি",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button className="w-full py-4 rounded-2xl border border-zinc-800 hover:bg-zinc-800 text-white font-bold transition-all">
              যোগাযোগ করুন
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
