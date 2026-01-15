import { useDreams } from "@/hooks/use-dreams";
import { DreamCard } from "@/components/DreamCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Journal() {
  const { data: dreams, isLoading } = useDreams();
  const [search, setSearch] = useState("");

  const filteredDreams = dreams?.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) || 
    d.content.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen container px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2 text-white">Dream Journal</h1>
          <p className="text-muted-foreground">Your personal archive of the subconscious.</p>
        </div>
        <Link href="/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
            <Plus className="mr-2 w-4 h-4" />
            Record Dream
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search titles, content, symbols..." 
            className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDreams.length > 0 ? (
            filteredDreams.map((dream, index) => (
              <DreamCard key={dream.id} dream={dream} index={index} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              {search ? "No dreams found matching your search." : "Your journal is empty."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
