import React, { useState } from "react";
import { useNotesStore } from "../../store/useNotesStore";
import { Edit2, Trash2, Check, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { cn } from "../../lib/utils";

interface TagManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TagManager: React.FC<TagManagerProps> = ({ open, onOpenChange }) => {
  const { notes, renameTagGlobally, deleteTagGlobally, styleMode } = useNotesStore();
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Compute all unique custom tags
  const customTags = React.useMemo(() => {
    const tags = new Set<string>();
    notes.forEach(note => {
      note.customTags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }, [notes]);

  const handleStartEdit = (tag: string) => {
    setEditingTag(tag);
    setEditValue(tag);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setEditValue("");
    setError(null);
  };

  const handleSaveRename = (oldTag: string) => {
    const cleanNew = editValue.trim();
    if (!cleanNew) return;

    if (cleanNew.length > 20) {
      setError("Tag name too long (max 20 chars)");
      return;
    }

    const pattern = /^[a-zA-Z0-9\s-_]+$/;
    if (!pattern.test(cleanNew)) {
      setError("Only letters, numbers, spaces, - or _");
      return;
    }

    // Check if new tag conflicts (case-sensitively) with other custom tags or is duplicate
    if (cleanNew.toLowerCase() !== oldTag.toLowerCase()) {
      const globalTags = new Set<string>();
      notes.forEach(n => {
        n.tags?.forEach(t => globalTags.add(t.toLowerCase()));
        n.customTags?.forEach(t => globalTags.add(t.toLowerCase()));
      });
      if (globalTags.has(cleanNew.toLowerCase())) {
        setError("Tag name already exists");
        return;
      }
    }

    renameTagGlobally(oldTag, cleanNew);
    setEditingTag(null);
    setError(null);
  };

  const handleDeleteTag = (tag: string) => {
    if (confirm(`Are you sure you want to delete "${tag}" globally? It will be removed from all notes.`)) {
      deleteTagGlobally(tag);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-md p-6 select-none",
        styleMode === "youthful" && "rounded-2xl font-sans",
        styleMode === "knowledge" && "rounded-none font-mono border-2 shadow-none",
        styleMode === "minimalist" && "rounded-md"
      )}>
        <DialogHeader>
          <DialogTitle className={cn(
            styleMode === "youthful" && "text-xl font-black text-primary",
            styleMode === "knowledge" && "text-sm font-bold uppercase"
          )}>
            Global Tag Manager
          </DialogTitle>
          <DialogDescription className="text-xs pt-1">
            Rename or delete custom tags globally. Changes will propagate to all notes.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2 max-h-80 overflow-y-auto scrollbar-thin">
          {customTags.length === 0 ? (
            <div className="text-center py-6 text-xs text-muted-foreground italic">
              No custom tags created yet.
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {customTags.map(tag => {
                const isEditing = editingTag === tag;
                return (
                  <div
                    key={tag}
                    className={cn(
                      "flex items-center justify-between p-2 border border-border bg-card/40 hover:bg-card/70 transition-all",
                      styleMode === "youthful" && "rounded-xl",
                      styleMode === "knowledge" && "rounded-none border border-border",
                      styleMode === "minimalist" && "rounded-md"
                    )}
                  >
                    {isEditing ? (
                      <div className="flex-1 flex flex-col gap-1 mr-2">
                        <div className="flex items-center gap-1">
                          <Input
                            type="text"
                            value={editValue}
                            onChange={(e) => {
                              setEditValue(e.target.value);
                              setError(null);
                            }}
                            className={cn(
                              "h-7 text-xs px-2 py-0 focus-visible:ring-1 flex-1",
                              styleMode === "youthful" && "rounded-lg",
                              styleMode === "knowledge" && "rounded-none border-2",
                              styleMode === "minimalist" && "rounded-sm"
                            )}
                            autoFocus
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleSaveRename(tag)}
                            className="size-7 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md cursor-pointer"
                            title="Save"
                          >
                            <Check className="size-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleCancelEdit}
                            className="size-7 text-muted-foreground hover:bg-secondary rounded-md cursor-pointer"
                            title="Cancel"
                          >
                            <X className="size-3.5" />
                          </Button>
                        </div>
                        {error && (
                          <span className="text-[9px] text-destructive font-semibold">
                            {error}
                          </span>
                        )}
                      </div>
                    ) : (
                      <>
                        <span className="text-xs font-semibold px-1 py-0.5">
                          {tag}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleStartEdit(tag)}
                            className="size-7 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-md cursor-pointer"
                            title="Rename Tag"
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteTag(tag)}
                            className="size-7 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md cursor-pointer"
                            title="Delete Tag"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={() => onOpenChange(false)}
            className={cn(
              "text-xs h-8 px-4 cursor-pointer",
              styleMode === "youthful" && "rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/95",
              styleMode === "knowledge" && "rounded-none bg-primary text-primary-foreground",
              styleMode === "minimalist" && "rounded-md"
            )}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
