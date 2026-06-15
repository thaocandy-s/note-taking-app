import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { useNotesStore } from "../../store/useNotesStore";

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useNotesStore();

  return (
    <div className="relative px-4 py-2">
      <Search className="absolute left-7 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search notes, tags, content..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9 pr-8 h-9 text-xs"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-7 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear Search"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
};
