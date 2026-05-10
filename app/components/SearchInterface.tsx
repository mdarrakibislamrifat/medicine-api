// components/SearchInterface.tsx
"use client";
import { useState } from 'react';

export default function SearchInterface() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.length > 2) {
      const res = await fetch(`/api/medicines/search?q=${val}`);
      const data = await res.json();
      setResults(data);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Comprehensive Medicine API
        </h1>
        <p className="text-slate-400 mt-2">Search through 25,000+ authentic pharmaceutical records</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <input 
          type="text"
          placeholder="Search by brand name or generic (e.g. Napa)..."
          className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="absolute right-4 top-4 text-slate-500">K</div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((med: any) => (
          <div key={med.id} className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white">{med.name}</h3>
            <p className="text-sm text-blue-400 mb-2">{med.generic}</p>
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>{med.company}</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">Tablet</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}