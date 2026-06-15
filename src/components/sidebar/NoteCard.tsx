import React, { useState } from "react";
import type { Note } from "../../types/note";
import { useNotesStore } from "../../store/useNotesStore";
import { getNoteTitle, getExcerpt, formatDate } from "../../lib/note-utils";
import { Trash2, AlertTriangle } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface NoteCardProps {
  note: Note;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const { activeNoteId, selectNote, deleteNote, styleMode } = useNotesStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isActive = activeNoteId === note.id;

  const handleCardClick = () => {
    selectNote(note.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteNote(note.id);
    setDeleteDialogOpen(false);
  };

  const title = getNoteTitle(note);
  const excerpt = getExcerpt(note.content, 60);
  const dateStr = formatDate(note.updatedAt);

  return (
    <>
      <div
        onClick={handleCardClick}
        className={cn(
          "group relative flex flex-col p-3 mb-2 border cursor-pointer select-none overflow-hidden transition-all duration-200",
          styleMode === "minimalist" && {
            "border-border bg-card hover:bg-muted/50": !isActive,
            "border-primary bg-secondary/60 font-medium": isActive,
            "rounded-md": true,
          },
          styleMode === "youthful" && {
            "border-border bg-card shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0": !isActive,
            "border-primary bg-primary/5 shadow-md -translate-y-0.5 ring-2 ring-primary/20": isActive,
            "rounded-2xl transition-all duration-300 ease-out": true,
          },
          styleMode === "knowledge" && {
            "border-border bg-card hover:bg-secondary/40": !isActive,
            "border-primary bg-secondary/80 text-primary": isActive,
            "rounded-none font-mono border-l-2": true,
            "border-l-primary": isActive,
          }
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className={cn(
            "text-sm font-semibold truncate flex-1",
            styleMode === "knowledge" && "font-bold text-xs"
          )}>
            {title}
          </h3>
          <button
            onClick={handleDeleteClick}
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-destructive text-muted-foreground p-0.5 rounded-md hover:bg-secondary transition-all cursor-pointer"
            title="Delete Note"
            aria-label="Delete Note"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 mb-2 font-normal">
          {excerpt || <span className="italic opacity-60 text-[10px]">No content yet</span>}
        </p>

        <div className="flex items-center justify-between mt-auto pt-1 border-t border-border/50 text-[10px] text-muted-foreground font-medium">
          <span>{dateStr}</span>
          
          {styleMode === "youthful" && note.stickers && note.stickers.length > 0 && (
            <div className="flex gap-0.5">
              {note.stickers.slice(0, 3).map((st, i) => (
                <span key={i} className="text-xs scale-90">{st}</span>
              ))}
              {note.stickers.length > 3 && (
                <span className="text-[8px] bg-secondary px-1 rounded-full flex items-center font-bold">+{note.stickers.length - 3}</span>
              )}
            </div>
          )}

          {styleMode === "knowledge" && note.tags && note.tags.length > 0 && (
            <span className="text-[8px] uppercase tracking-wide font-bold">
              {note.tags.length} tag{note.tags.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className={cn(
          styleMode === "youthful" && "rounded-2xl font-sans",
          styleMode === "knowledge" && "rounded-none font-mono"
        )}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" />
              Delete Note?
            </DialogTitle>
            <DialogDescription className="pt-2 text-xs">
              Are you sure you want to delete <strong className="text-foreground">"{title}"</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className={cn(
                styleMode === "youthful" && "rounded-xl",
                styleMode === "knowledge" && "rounded-none"
              )}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className={cn(
                styleMode === "youthful" && "rounded-xl",
                styleMode === "knowledge" && "rounded-none"
              )}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
