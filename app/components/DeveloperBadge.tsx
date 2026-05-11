import { ExternalLink } from "lucide-react";
import Image from "next/image";
import profieImage from "../../public/Rifat_Profile.png"

const DeveloperBadge = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <a
        href="https://www.linkedin.com/in/rakib-islam-rifatt/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 p-2 pr-4 rounded-full shadow-2xl hover:border-blue-500/50 transition-all duration-300 group-hover:scale-105"
      >
        {/* Profile Image or Initial */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden border border-zinc-600">
          <Image src={profieImage} alt="Profile" width={32} height={32} />
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold leading-none">
            Built By
          </span>
          <span className="text-sm text-zinc-200 font-medium leading-tight group-hover:text-blue-400">
            Rakib Islam Rifat
          </span>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-zinc-500 group-hover:text-[#0077b5] transition-colors"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      </a>

      <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-zinc-800 text-[11px] text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700 whitespace-nowrap shadow-xl">
          Software Engineer
        </div>
      </div>
    </div>
  );
};

export default DeveloperBadge;
