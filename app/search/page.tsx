import SearchInterface from "../components/SearchInterface";

export const metadata = {
  title: "Search Medicines",
  description: "Explore our database of 25,000+ medicines including Napa, Ace, and more.",
};

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20">
      <SearchInterface />
    </div>
  );
}