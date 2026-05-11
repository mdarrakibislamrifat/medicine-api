"use client";
import { useState } from "react";
import { Search } from "lucide-react";

export default function InteractiveDemo() {
  const [query, setQuery] = useState("Napa One");

  const mockData: Record<string, any> = {
    "Napa One": {
      id: 14742,
      name: "Napa One",
      generic: "Napa One",
      company: "Beximco Pharmaceuticals Ltd.",
      indications: "Napa One is indicated for fever, common cold and influenza, headache...",
      therapeutic_class: "Non-Opioid Analgesics",
      dosage: "Tablet : Adult: 1-2 tablets every 4 to 6 hours...",
      side_effects: "Side effects of Napa One are usually mild...",
      storage_conditions: "Keep in a dry place away from light and heat."
    },
    "Napa Rapid": {
      id: 14743,
      name: "Napa Rapid (Actizorb)",
      generic: "Napa Rapid (Actizorb)",
      company: "Beximco Pharmaceuticals Ltd.",
      indications: "Napa Rapid (Actizorb) is indicated for fever, common cold...",
      therapeutic_class: "Non-Opioid Analgesics",
      dosage: "Tablet with actizorb technology : It dissolves up to five times faster...",
      side_effects: "Side effects are usually mild...",
      storage_conditions: "Keep in a dry place away from light and heat."
    }
  };

  const displayData = mockData[query] || mockData["Napa One"];

  return (
    // mt-24 ke mobile-e komanor jonno mt-10 md:mt-24 use kora hoyeche
    <div className="mt-10 md:mt-24 w-full max-w-5xl rounded-2xl md:rounded-3xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md overflow-hidden shadow-2xl mx-auto">
      
      {/* Header - Mobile friendly padding and layout */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 md:px-6 bg-zinc-900/80 border-b border-zinc-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="hidden sm:flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          {/* API endpoint text wrap korar jonno break-all use kora hoyeche */}
          <code className="text-[10px] md:text-xs text-blue-400 font-mono bg-blue-500/10 px-2 py-1 rounded break-all">
            GET /api/medicines/search?q={query}
          </code>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Napa One, Napa Rapid..."
            className="w-full bg-black border border-zinc-700 rounded-xl py-2 pl-10 pr-4 text-sm text-zinc-300 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* API Response Display - Mobile-friendly scrolling */}
      <div className="p-4 md:p-6 text-left font-mono text-xs md:text-sm overflow-x-auto max-h-[400px] md:max-h-[450px] scrollbar-thin scrollbar-thumb-zinc-800">
        {/* whitespace-pre-wrap use korle JSON mobile screen er baire jabe na */}
        <pre className="text-emerald-400 whitespace-pre-wrap break-words">
          {JSON.stringify({
            success: true,
            remainingCredits: 9,
            data: [displayData]
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}