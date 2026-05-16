"use client";
import { Database, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react"; // Client-side authentication pattern lookup tracking execution context
import InteractiveDemo from "./components/InteractiveDemo";
import { useLanguage } from "@/app/context/LanguageContext";
import LanguageSwitcher from "./components/LanguageSwitcher"; // Newly designed toggler element link hook

export default function Home() {
  const { data: session } = useSession();
  const { t } = useLanguage(); // Central hook context optimization initialization block setup

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-emerald-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation Layer */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto relative z-10 w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-emerald-400 rounded-lg flex items-center justify-center font-bold text-black">
            M
          </div>
          <span className="text-xl font-bold tracking-tight">
            {t.nav.medicine} <span className="text-blue-500">API</span>
          </span>
        </div>

        {/* Desktop Links Matrix */}
        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
          <Link href="#features" className="hover:text-white transition-colors">
            {t.nav.features}
          </Link>
          <Link href="#docs" className="hover:text-white transition-colors">
            {t.nav.docs}
          </Link>
        </div>

        {/* Global Action Items Block and Switch Badge */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher /> {/* Injecting the interactive control component row layout */}
          
          <Link
            href={session ? "/dashboard" : "/login"}
            className="px-4 py-2 md:px-5 md:py-2 bg-white text-black rounded-full text-xs md:text-sm font-medium hover:bg-zinc-200 transition-all"
          >
            {session ? t.nav.dashboard : t.nav.get_key}
          </Link>
        </div>
      </nav>

      {/* Hero Section Core Panel */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {t.hero.tracking_badge}
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter max-w-4xl mb-8">
          {t.hero.title_main} <br />
          <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            {t.hero.title_sub}
          </span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          {t.hero.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/search"
            className="h-14 px-8 flex items-center justify-center bg-blue-600 rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          >
            {t.hero.btn_explore}
          </Link>
          <Link
            href="#docs"
            className="h-14 px-8 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-2xl font-semibold hover:bg-zinc-800 transition-all"
          >
            {t.hero.btn_docs}
          </Link>
        </div>

        {/* API Preview / Code Mockup Container */}
        <div id="docs">
          <InteractiveDemo />
        </div>
      </main>

      {/* Analytical Stats Segment */}
      <section className="border-t border-zinc-900 bg-black/50 py-20">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold">25k+</div>
            <div className="text-sm text-zinc-500">{t.stats.medicines}</div>
          </div>
          <div>
            <div className="text-3xl font-bold">99.9%</div>
            <div className="text-sm text-zinc-500">{t.stats.uptime}</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{"<"}100ms</div>
            <div className="text-sm text-zinc-500">{t.stats.latency}</div>
          </div>
          <div>
            <div className="text-3xl font-bold">FREE</div>
            <div className="text-sm text-zinc-500">{t.stats.free_devs}</div>
          </div>
        </div>
      </section>

      {/* Grid Features Dynamic Matrix */}
      <section id="features" className="max-w-7xl mx-auto px-8 py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t.features.section_title}
          </h2>
          <p className="text-zinc-500">
            {t.features.section_subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all group">
            <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t.features.f1_title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {t.features.f1_desc}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t.features.f2_title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {t.features.f2_desc}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 transition-all group">
            <div className="w-12 h-12 bg-purple-600/10 rounded-xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t.features.f3_title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {t.features.f3_desc}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}