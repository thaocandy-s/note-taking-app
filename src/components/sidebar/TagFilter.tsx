import React, { useState } from "react";
import { useNotesStore } from "../../store/useNotesStore";
import { cn } from "../../lib/utils";
import { Settings } from "lucide-react";
import { TagManager } from "./TagManager";

export const TagFilter: React.FC = () => {
  const { notes, selectedTag, setSelectedTag, styleMode } = useNotesStore();
  const [managerOpen, setManagerOpen] = useState(false);

  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    notes.forEach(note => {
      note.tags?.forEach(tag => tags.add(tag));
      note.customTags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [notes]);

  const hasCustomTags = React.useMemo(() => {
    return notes.some(note => note.customTags && note.customTags.length > 0);
  }, [notes]);

  if (allTags.length === 0) return null;

  return (
    <div className="px-4 py-2 border-b border-border">
      <div className="flex items-center justify-between mb-2 select-none">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Filter by Tag
        </div>
        {hasCustomTags && (
          <button
            onClick={() => setManagerOpen(true)}
            className={cn(
              "text-[9px] font-bold uppercase tracking-wider text-primary hover:text-primary/85 cursor-pointer flex items-center gap-0.5",
              styleMode === "knowledge" && "font-mono"
            )}
          >
            <Settings className="size-3" />
            Manage
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1 scrollbar-thin">
        <button
          onClick={() => setSelectedTag(null)}
          className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-bold transition-all border select-none cursor-pointer",
            !selectedTag
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-secondary text-muted-foreground border-border hover:text-foreground hover:bg-accent"
          )}
        >
          All
        </button>
        {allTags.map(tag => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => setSelectedTag(isSelected ? null : tag)}
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold transition-all border select-none cursor-pointer",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-muted-foreground border-border hover:text-foreground hover:bg-accent"
              )}
            >
              #{tag}
            </button>
          );
        })}
      </div>

      <TagManager open={managerOpen} onOpenChange={setManagerOpen} />
    </div>
  );
};
