"use client";
import { useState, useEffect } from 'react';
import { Search, Loader2, Database, Lock, ArrowRight, ChevronLeft, ChevronRight, X, Pill, Building, Info } from 'lucide-react'; 
import { useSession } from "next-auth/react";
import Link from 'next/link';

export default function SearchInterface() {
  const { data: session, status } = useSession();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    totalRecords: 0
  });

  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setCurrentPage(1); 
  };

  useEffect(() => {
    if (!session) return;

    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        setLoading(true);
        try {
          const res = await fetch(`/api/medicines/search?q=${query}&page=${currentPage}&filter=${filterType}`);
          const json = await res.json();
          if (json.success) {
            setResults(json.data);
            setPaginationInfo({
              totalPages: json.pagination.totalPages,
              hasNextPage: json.pagination.hasNextPage,
              hasPrevPage: json.pagination.hasPrevPage,
              totalRecords: json.pagination.totalRecords
            });
          }
        } catch (error) {
          console.error("Search error", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setPaginationInfo({ totalPages: 1, hasNextPage: false, hasPrevPage: false, totalRecords: 0 });
      }
    }, 400); 

    return () => clearTimeout(delayDebounceFn);
  }, [query, currentPage, filterType, session]);

  // Dynamic API Fetcher for Individual Medicine Row
  const handleOpenDetails = async (id: number) => {
    setModalLoading(true);
    // Explicit dynamic layout tracking logic initialization
    setSelectedMedicine({ id, name: "Loading definition..." }); 
    try {
      const res = await fetch(`/api/medicines/${id}`);
      const json = await res.json();
      if (json.success) {
        setSelectedMedicine(json.data);
      }
    } catch (err) {
      console.error("Failed fetching item profile properties", err);
      setSelectedMedicine(null);
    } finally {
      setModalLoading(false);
    }
  };

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
            <Link href="/login" className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className={`text-center mb-12 pt-10 transition-all duration-700 ${!session ? 'blur-sm grayscale' : ''}`}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
          <Database className="w-3 h-3" /> Real-time Pharmaceutical Database
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-500 bg-clip-text text-transparent">
          Medicine Explorer
        </h1>
        <p className="text-zinc-500 mt-4 text-lg">Browse brands, generics, and manufacturing companies.</p>
      </div>

      {/* Filter Options Panel */}
      <div className={`max-w-3xl mx-auto mb-12 transition-all ${!session ? 'opacity-30' : ''}`}>
        <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
          {[
            { id: 'all', label: 'All Fields' },
            { id: 'name', label: 'Brand Name' },
            { id: 'generic', label: 'Generic Form' },
            { id: 'company', label: 'Manufacturer' }
          ].map((chip) => (
            <button
              key={chip.id}
              disabled={!session}
              onClick={() => { setFilterType(chip.id); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all active:scale-95 duration-200 ${
                filterType === chip.id
                  ? 'bg-blue-500/10 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
          <div className="relative flex items-center">
            <div className="absolute left-5 text-zinc-500">
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : <Search className="w-5 h-5" />}
            </div>
            <input 
              type="text"
              disabled={!session}
              value={query}
              placeholder={`Search by ${filterType === 'all' ? 'brand, generic or manufacturer' : filterType}...`}
              className="w-full pl-14 pr-6 py-5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-zinc-700 transition-all placeholder:text-zinc-600"
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {results.length > 0 && session && (
        <div className="max-w-6xl mx-auto mb-4 flex justify-end text-xs text-zinc-400 font-mono">
          Total Found: {paginationInfo.totalRecords} medicines
        </div>
      )}

      {/* Results Section */}
      {/* Results Section */}
<div className={!session ? 'blur-md pointer-events-none' : ''}>
  {results.length > 0 ? (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 items-start">
        {results.map((med: any) => (
          <Link 
            key={med.id} 
            href={`/dashboard/medicines/${med.id}`} // Dynamic route endpoint hit korbe
            className="group p-6 rounded-[2rem] bg-zinc-900/40 border border-zinc-800 hover:border-blue-500/40 hover:bg-zinc-900/70 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden min-h-[160px] h-full block"
          >
            {/* Top Hover Info Icon */}
            <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400">
              <Info className="w-4 h-4" />
            </div>

            {/* Medicine Name (Brand Name) */}
            <div className="flex justify-between items-start mb-3 max-w-[90%]">
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                {med.name}
              </h3>
            </div>

            {/* Generic Name */}
            <div>
              <p className="text-xs font-medium text-blue-400 mb-4 px-2.5 py-1 rounded-lg bg-blue-500/5 border border-blue-500/10 inline-block truncate max-w-full">
                {med.generic}
              </p>
            </div>

            {/* Manufacturer/Company info */}
            <div className="flex items-center gap-2 text-xs text-zinc-500 mt-auto pt-3 border-t border-zinc-900/60 overflow-hidden w-full">
              <span className="truncate font-medium block w-full">{med.company}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      {paginationInfo.totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 pt-4 mb-16 border-t border-zinc-900">
          <button
            disabled={!paginationInfo.hasPrevPage || loading}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="flex items-center justify-center p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-zinc-400 font-medium">
            Page <span className="text-white font-semibold">{currentPage}</span> of <span className="text-white font-semibold">{paginationInfo.totalPages}</span>
          </span>
          <button
            disabled={!paginationInfo.hasNextPage || loading}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="flex items-center justify-center p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 disabled:opacity-30 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
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

      {/* ================= DETAILS DRAWER MODAL OVERLAY ================= */}
      {selectedMedicine && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 bg-zinc-900/40 border-b border-zinc-900 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
                  <Pill className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {modalLoading ? "Fetching Database..." : selectedMedicine.name}
                  </h2>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">ID: #{selectedMedicine.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMedicine(null)}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto space-y-6 text-sm leading-relaxed text-zinc-300">
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="text-zinc-500 font-mono text-xs tracking-wider">LOADING FULL DATA SPECIFICATIONS...</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-900">
                      <span className="text-xs text-zinc-500 font-mono block mb-1">GENERIC COMPOSITION</span>
                      <span className="text-emerald-400 font-semibold text-base">{selectedMedicine.generic}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-900 flex items-center gap-3">
                      <Building className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                      <div>
                        <span className="text-xs text-zinc-500 font-mono block">MANUFACTURER CO.</span>
                        <span className="text-white font-medium">{selectedMedicine.company}</span>
                      </div>
                    </div>
                  </div>

                  {selectedMedicine.indications && (
                    <div>
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono mb-2">Indications</h4>
                      <div className="p-5 bg-zinc-900/20 border border-zinc-900 rounded-2xl text-zinc-400">
                        {selectedMedicine.indications}
                      </div>
                    </div>
                  )}

                  {selectedMedicine.dosage && (
                    <div>
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono mb-2">Dosage & Administration</h4>
                      <div className="p-5 bg-zinc-900/20 border border-zinc-900 rounded-2xl text-zinc-400">
                        {selectedMedicine.dosage}
                      </div>
                    </div>
                  )}

                  {selectedMedicine.side_effects && (
                    <div>
                      <h4 className="text-xs font-bold text-red-400/80 uppercase tracking-widest font-mono mb-2">Side Effects</h4>
                      <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl text-zinc-400">
                        {selectedMedicine.side_effects}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}