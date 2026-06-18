import React, { useState, useRef, useEffect } from "react";
import { Plus, Tag as TagIcon } from "lucide-react";
import { useNotesStore } from "../../store/useNotesStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import type { Note } from "../../types/note";

interface TagEditorProps {
  note: Note;
}

export const TagEditor: React.FC<TagEditorProps> = ({ note }) => {
  const { notes, addCustomTag, styleMode } = useNotesStore();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setError(null);
        setInputValue("");
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  // Compute all unique tags across the app that are NOT yet assigned to this note
  const availableTags = React.useMemo(() => {
    const noteLowerTags = new Set<string>([
      ...(note.tags || []).map(t => t.toLowerCase()),
      ...(note.customTags || []).map(t => t.toLowerCase())
    ]);

    const globalTags = new Set<string>();
    notes.forEach(n => {
      n.tags?.forEach(t => globalTags.add(t));
      n.customTags?.forEach(t => globalTags.add(t));
    });

    return Array.from(globalTags)
      .filter(t => !noteLowerTags.has(t.toLowerCase()))
      .sort((a, b) => a.localeCompare(b));
  }, [notes, note]);

  const handleAddTag = (tagName: string) => {
    const cleanName = tagName.trim();
    if (!cleanName) return;

    if (cleanName.length > 20) {
      setError("Tag name too long (max 20 chars)");
      return;
    }

    const pattern = /^[a-zA-Z0-9\s-_]+$/;
    if (!pattern.test(cleanName)) {
      setError("Only letters, numbers, spaces, - or _");
      return;
    }

    // Check case-insensitive duplicates on current note
    const isDuplicate = 
      (note.tags || []).some(t => t.toLowerCase() === cleanName.toLowerCase()) ||
      (note.customTags || []).some(t => t.toLowerCase() === cleanName.toLowerCase());

    if (isDuplicate) {
      setError("Tag already assigned");
      return;
    }

    addCustomTag(note.id, cleanName);
    setInputValue("");
    setError(null);
    // Keep open so they can add more, or close on success
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(inputValue);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-5 px-1.5 py-0 border border-dashed border-muted-foreground/30 hover:border-primary/50 text-[9px] font-bold uppercase tracking-wider gap-1 cursor-pointer select-none",
          styleMode === "youthful" && "rounded-xl border-primary/20 hover:bg-primary/5",
          styleMode === "knowledge" && "rounded-none font-mono",
          styleMode === "minimalist" && "rounded-md"
        )}
      >
        <Plus className="size-2.5" />
        Add Tag
      </Button>

      {isOpen && (
        <div className={cn(
          "absolute left-0 mt-1.5 w-60 bg-popover text-popover-foreground border border-border shadow-md z-50 p-3 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200",
          styleMode === "youthful" && "rounded-2xl font-sans shadow-lg",
          styleMode === "knowledge" && "rounded-none font-mono border-2 shadow-none",
          styleMode === "minimalist" && "rounded-md"
        )}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
            Add tag to note
          </div>

          <div className="flex gap-1">
            <Input
              type="text"
              placeholder="Tag name... (Enter)"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError(null);
              }}
              onKeyDown={handleKeyDown}
              className={cn(
                "h-7 text-xs px-2 py-0 focus-visible:ring-1",
                styleMode === "youthful" && "rounded-xl border-primary/10",
                styleMode === "knowledge" && "rounded-none focus-visible:ring-primary border-2",
                styleMode === "minimalist" && "rounded-md"
              )}
              autoFocus
            />
            <Button
              onClick={() => handleAddTag(inputValue)}
              className={cn(
                "h-7 text-xs px-2.5 cursor-pointer font-semibold",
                styleMode === "youthful" && "rounded-xl bg-primary text-primary-foreground hover:bg-primary/95",
                styleMode === "knowledge" && "rounded-none bg-primary text-primary-foreground",
                styleMode === "minimalist" && "rounded-md"
              )}
            >
              Add
            </Button>
          </div>

          {error && (
            <div className="text-[9px] text-destructive font-semibold leading-none">
              {error}
            </div>
          )}

          {availableTags.length > 0 && (
            <div className="flex flex-col gap-1 border-t border-border pt-2 mt-1">
              <div className="text-[8px] font-bold uppercase tracking-wide text-muted-foreground select-none mb-1">
                Select existing tag
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-0.5 scrollbar-thin">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleAddTag(tag)}
                    className={cn(
                      "flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold transition-all border select-none cursor-pointer bg-secondary/80 text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/20",
                      styleMode === "youthful" && "rounded-full",
                      styleMode === "knowledge" && "rounded-none font-mono",
                      styleMode === "minimalist" && "rounded-md"
                    )}
                  >
                    <TagIcon className="size-2" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
