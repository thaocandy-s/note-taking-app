import React from "react";
import { useNotesStore } from "../../store/useNotesStore";
import { SearchBar } from "./SearchBar";
import { TagFilter } from "./TagFilter";
import { NoteCard } from "./NoteCard";
import { getNoteTitle } from "../../lib/note-utils";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "../../lib/utils";

export const Sidebar: React.FC = () => {
  const { notes, createNote, searchQuery, selectedTag, styleMode } = useNotesStore();

  const filteredNotes = React.useMemo(() => {
    return notes.filter(note => {
      // Filter by tag if selected
      if (selectedTag && !note.tags?.includes(selectedTag)) {
        return false;
      }
      
      // Filter by search query if set
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const title = getNoteTitle(note).toLowerCase();
        const content = (note.content || "").toLowerCase();
        return title.includes(query) || content.includes(query);
      }

      return true;
    });
  }, [notes, searchQuery, selectedTag]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-card">
      {/* Create Note CTA */}
      <div className="p-4 border-b border-border">
        <Button
          onClick={() => createNote()}
          className={cn(
            "w-full gap-2 cursor-pointer transition-all duration-200 select-none",
            styleMode === "youthful" && "rounded-xl font-bold bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]",
            styleMode === "knowledge" && "rounded-none font-mono bg-primary hover:bg-primary/90 text-primary-foreground",
            styleMode === "minimalist" && "rounded-md"
          )}
        >
          <Plus className="size-4" />
          New Note
        </Button>
      </div>

      {/* Filters */}
      <SearchBar />
      <TagFilter />

      {/* Note List Scroll Area */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 px-4 py-4">
          {filteredNotes.length > 0 ? (
            filteredNotes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))
          ) : (
            <div className="text-center py-12 text-xs text-muted-foreground italic select-none">
              {notes.length === 0 ? "No notes. Create one to begin!" : "No matching notes found."}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
