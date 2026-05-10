"use client";
import { useState, useEffect } from 'react';
import { Search, Loader2, Database } from 'lucide-react'; 

export default function SearchInterface() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debouncing logic to save database compute
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        setLoading(true);
        try {
          const res = await fetch(`/api/medicines/search?q=${query}`);
          const json = await res.json();
          if (json.success) {
            setResults(json.data);
          }
        } catch (error) {
          console.error("Search error", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 400); 

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-[80vh]">
      {/* Header Section */}
      <div className="text-center mb-16 pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
          <Database className="w-3 h-3" /> 25,132+ Active Records
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-500 bg-clip-text text-transparent">
          Medicine Explorer
        </h1>
        <p className="text-zinc-500 mt-4 text-lg">Instant access to authentic pharmaceutical data in Bangladesh.</p>
      </div>

      {/* Modern Search Bar */}
      <div className="relative max-w-3xl mx-auto mb-16 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
        <div className="relative flex items-center">
          <div className="absolute left-5 text-zinc-500">
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : <Search className="w-5 h-5" />}
          </div>
          <input 
            type="text"
            placeholder="Search by brand name or generic (e.g. Napa)..."
            className="w-full pl-14 pr-16 py-5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-zinc-600"
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="absolute right-5 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-500 font-mono hidden md:block">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Results Section */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((med: any) => (
            <div key={med.id} className="group p-6 rounded-[2rem] bg-zinc-900/40 border border-zinc-800 hover:border-blue-500/40 hover:bg-zinc-900 transition-all duration-300 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{med.name}</h3>
                <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-zinc-800 text-zinc-400 uppercase tracking-widest italic border border-zinc-700">Tablet</span>
              </div>
              <p className="text-sm font-medium text-emerald-400/90 mb-4 bg-emerald-500/5 inline-block px-2 py-0.5 rounded-md border border-emerald-500/10">
                {med.generic}
              </p>
              <div className="flex items-center gap-2 text-xs text-zinc-500 mt-2">
                <div className="w-1 h-1 rounded-full bg-zinc-700"></div>
                <span className="truncate">{med.company}</span>
              </div>
            </div>
          ))}
        </div>
      ) : query.length > 2 && !loading ? (
        <div className="text-center py-20 bg-zinc-900/20 rounded-[3rem] border border-dashed border-zinc-800">
           <p className="text-zinc-500 font-medium italic">No results found for "{query}"</p>
        </div>
      ) : (
        <div className="text-center py-20 opacity-40">
           <p className="text-zinc-600 text-sm font-mono tracking-widest uppercase">Awaiting your search input...</p>
        </div>
      )}
    </div>
  );
}