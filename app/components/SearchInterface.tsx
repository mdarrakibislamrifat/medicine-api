"use client";
import { useState, useEffect } from 'react';
import { Search, Loader2, Database, Lock, ArrowRight } from 'lucide-react'; 
import { useSession } from "next-auth/react";
import Link from 'next/link';

export default function SearchInterface() {
  const { data: session, status } = useSession();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;

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
  }, [query, session]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-[80vh] relative">
      
      {!session && (
        <div className="absolute inset-0 z-50 backdrop-blur-md bg-black/20 flex flex-col items-center justify-start pt-32 px-6 rounded-[3rem]">
          <div className="p-8 bg-zinc-900/90 border border-zinc-800 rounded-[2.5rem] text-center shadow-2xl max-w-md backdrop-blur-xl">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
              <Lock className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-3xl font-bold mb-3 tracking-tight">Search Locked</h2>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              Please login to explore our 25,000+ medicine database. 
              Search access is free for all registered developers.
            </p>
            <Link 
              href="/login" 
              className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className={`text-center mb-16 pt-10 transition-all duration-700 ${!session ? 'blur-sm grayscale' : ''}`}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
          <Database className="w-3 h-3" /> Real-time Pharmaceutical Database
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-500 bg-clip-text text-transparent">
          Medicine Explorer
        </h1>
        <p className="text-zinc-500 mt-4 text-lg">Browse brands, generics, and manufacturing companies.</p>
      </div>

      {/* Search Bar */}
      <div className={`relative max-w-3xl mx-auto mb-16 group transition-all ${!session ? 'opacity-30' : ''}`}>
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
        <div className="relative flex items-center">
          <div className="absolute left-5 text-zinc-500">
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : <Search className="w-5 h-5" />}
          </div>
          <input 
            type="text"
            disabled={!session}
            placeholder="Type brand name (e.g. Napa, Seclo)..."
            className="w-full pl-14 pr-6 py-5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-zinc-700 transition-all placeholder:text-zinc-600"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Results Section */}
      <div className={!session ? 'blur-md pointer-events-none' : ''}>
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((med: any) => (
              <div key={med.id} className="group p-6 rounded-[2rem] bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{med.name}</h3>
                </div>
                <p className="text-sm font-medium text-blue-400 mb-4 px-2 py-0.5 rounded-md bg-blue-500/5 border border-blue-500/10 inline-block">
                  {med.generic}
                </p>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mt-2">
                  <span className="truncate">{med.company}</span>
                </div>
              </div>
            ))}
          </div>
        ) : query.length > 2 && !loading ? (
          <div className="text-center py-20 bg-zinc-900/20 rounded-[3rem] border border-dashed border-zinc-800">
             <p className="text-zinc-500 font-medium italic">No matches for "{query}"</p>
          </div>
        ) : (
          <div className="text-center py-20 opacity-20">
             <p className="text-zinc-600 text-xs tracking-widest uppercase font-mono italic">Start typing to search medicines</p>
          </div>
        )}
      </div>
    </div>
  );
}