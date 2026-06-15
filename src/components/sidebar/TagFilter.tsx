import React from "react";
import { useNotesStore } from "../../store/useNotesStore";
import { cn } from "../../lib/utils";

export const TagFilter: React.FC = () => {
  const { notes, selectedTag, setSelectedTag } = useNotesStore();

  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    notes.forEach(note => {
      note.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [notes]);

  if (allTags.length === 0) return null;

  return (
    <div className="px-4 py-2 border-b border-border">
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 select-none">
        Filter by Tag
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
    </div>
  );
};
