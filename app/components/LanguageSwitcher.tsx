"use client";
import { useLanguage } from "@/app/context/LanguageContext";
import { Languages } from "lucide-react";

export default function LanguageSwitcher() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800/80 rounded-full text-xs font-semibold font-mono text-zinc-300 hover:text-white transition-all shadow-md group"
    >
      <Languages className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-12 transition-transform" />
      <span>{lang === "en" ? "BN" : "EN"}</span>
    </button>
  );
}