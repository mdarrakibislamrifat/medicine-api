"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { 
  ArrowLeft, Loader2, Pill, Building, ShieldAlert, 
  Layers, FlaskConical, Stethoscope, AlertTriangle, 
  Baby, Beaker, FileText, ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function MedicineDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [medicine, setMedicine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (!id || status !== "authenticated") return;

    const fetchMedicineDetails = async () => {
      try {
        const res = await fetch(`/api/medicines/${id}`);
        const json = await res.json();
        if (json.success) {
          setMedicine(json.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching medicine metadata details", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicineDetails();
  }, [id, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase">Fetching Complete Dataset Profile...</p>
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-6">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Medicine Profile Not Found</h2>
        <p className="text-zinc-500 text-sm mb-6">The requested biological structural identification record is either unavailable or has dynamic cache execution delays.</p>
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Go Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:py-12 min-h-screen">
      
      {/* Navigation and Actions Row */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl border border-zinc-800/80 hover:border-zinc-700 transition-all text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </button>

        {medicine.link && (
          <a 
            href={medicine.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 hover:underline font-mono transition-all"
          >
            Source Track <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Hero Overview Block */}
      <div className="relative p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-zinc-900/40 via-zinc-900/20 to-zinc-950 border border-zinc-800/80 shadow-2xl mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-600/10 to-transparent rounded-full blur-[80px] -z-10"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-5">
            <div className="p-4 bg-gradient-to-tr from-blue-600 to-emerald-500 text-black rounded-2xl shadow-lg shadow-blue-500/10 shrink-0">
              <Pill className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">{medicine.name}</h1>
              <span className="inline-flex px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase">
                {medicine.generic}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl max-w-sm">
            <Building className="w-5 h-5 text-zinc-500 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-[10px] text-zinc-500 font-mono block tracking-wider uppercase">MANUFACTURER BRAND</span>
              <span className="text-zinc-300 text-sm font-semibold block truncate">{medicine.company}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specification Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Medical Context Core Profiles */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Indications Card Info */}
          {medicine.indications && (
            <div className="p-6 md:p-8 rounded-[2rem] bg-zinc-900/20 border border-zinc-800/80 hover:border-zinc-700/60 transition-all">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <Stethoscope className="w-5 h-5 text-emerald-400" /> Indications
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">{medicine.indications}</p>
            </div>
          )}

          {/* Dosage Information */}
          {medicine.dosage && (
            <div className="p-6 md:p-8 rounded-[2rem] bg-zinc-900/20 border border-zinc-800/80 hover:border-zinc-700/60 transition-all">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-400" /> Dosage & Administration
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">{medicine.dosage}</p>
            </div>
          )}

          {/* Pharmacology Profile */}
          {medicine.pharmacology && (
            <div className="p-6 md:p-8 rounded-[2rem] bg-zinc-900/20 border border-zinc-800/80 hover:border-zinc-700/60 transition-all">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <FlaskConical className="w-5 h-5 text-purple-400" /> Mode of Action (Pharmacology)
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">{medicine.pharmacology}</p>
            </div>
          )}

          {/* Side Effects Meta Content Panel */}
          {medicine.side_effects && (
            <div className="p-6 md:p-8 rounded-[2rem] bg-red-500/5 border border-red-500/10 hover:border-red-500/20 transition-all">
              <h3 className="text-base font-bold text-red-400 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400/80" /> Side Effects
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">{medicine.side_effects}</p>
            </div>
          )}
        </div>

        {/* Right 1 Column: Classifications & Critical Precaution Blocks */}
        <div className="space-y-6">
          
          {/* Medical Classification Stats Card */}
          <div className="p-6 rounded-[2rem] bg-zinc-900/30 border border-zinc-800/80 space-y-4">
            <h3 className="text-xs font-bold text-zinc-500 font-mono tracking-widest uppercase pb-2 border-b border-zinc-900">
              Classification Parameters
            </h3>
            
            {medicine.therapeutic_class && (
              <div>
                <span className="text-[10px] text-zinc-500 font-mono block tracking-wider uppercase mb-1">THERAPEUTIC CLASS</span>
                <div className="flex gap-2 items-start text-xs text-zinc-300 font-medium">
                  <Layers className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>{medicine.therapeutic_class}</span>
                </div>
              </div>
            )}

            {medicine.pregnancy_category && (
              <div className="pt-2">
                <span className="text-[10px] text-zinc-500 font-mono block tracking-wider uppercase mb-1">PREGNANCY CATEGORY</span>
                <div className="flex gap-2 items-center text-xs text-zinc-300 font-medium">
                  <Baby className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 font-mono text-xs font-bold border border-zinc-700">
                    {medicine.pregnancy_category}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Precautions Alert Card */}
          {medicine.precautions && (
            <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/10">
              <h4 className="text-amber-400 text-xs font-bold font-mono tracking-wider uppercase mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Safety Precautions
              </h4>
              <p className="text-zinc-400 text-xs leading-relaxed">{medicine.precautions}</p>
            </div>
          )}

          {/* Storage Information Card */}
          {medicine.storage_conditions && (
            <div className="p-6 rounded-[2rem] bg-zinc-900/40 border border-zinc-800/60">
              <h4 className="text-zinc-400 text-xs font-bold font-mono tracking-wider uppercase mb-3 flex items-center gap-2">
                <Beaker className="w-4 h-4 text-zinc-500" /> Storage & Handling
              </h4>
              <p className="text-zinc-500 text-xs leading-relaxed font-medium">{medicine.storage_conditions}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}