import React, { useState, useRef, useEffect } from "react";
import type { Note } from "../../types/note";
import { useNotesStore } from "../../store/useNotesStore";
import { Smile, Calendar, Palette, XCircle, Tag } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface NoteHeaderProps {
  note: Note;
}

export const NoteHeader: React.FC<NoteHeaderProps> = ({ note }) => {
  const { updateNote, addSticker, removeSticker, styleMode } = useNotesStore();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  
  const colorRef = useRef<HTMLDivElement>(null);
  const stickerRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
      if (stickerRef.current && !stickerRef.current.contains(e.target as Node)) {
        setShowStickerPicker(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNote(note.id, { title: e.target.value });
  };

  const stickersList = ["🌸", "🧸", "⭐️", "💡", "📌", "💻", "🎨", "🍕", "🚀", "🎉", "🐱", "☕️"];
  const bgColors = [
    { name: "Default Vanilla", hex: "#fffdf5" },
    { name: "Rose Petal", hex: "#ffe4e6" },
    { name: "Fresh Mint", hex: "#ecfdf5" },
    { name: "Soft Lavender", hex: "#faf5ff" },
    { name: "Summer Sky", hex: "#f0f9ff" },
    { name: "Warm Amber", hex: "#fff7ed" },
  ];

  return (
    <div className={cn(
      "flex flex-col gap-2.5 p-4 border-b border-border bg-card/30 select-none relative",
      styleMode === "knowledge" && "font-mono border-b-2"
    )}>
      {/* Floating Pinned Stickers (Youthful Mode) */}
      {styleMode === "youthful" && note.stickers && note.stickers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-1 animate-fade-in">
          {note.stickers.map((st, idx) => (
            <div
              key={idx}
              className="group relative flex items-center justify-center text-xl bg-card border border-border/80 shadow-xs hover:shadow-sm size-8 rounded-full cursor-default select-none animate-bounce-in"
            >
              <span>{st}</span>
              <button
                onClick={() => removeSticker(note.id, idx)}
                className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 text-destructive bg-card rounded-full cursor-pointer transition-opacity"
                aria-label="Remove sticker"
              >
                <XCircle className="size-3.5 fill-card" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Title Row */}
      <div className="flex items-center justify-between gap-4">
        <Input
          type="text"
          value={note.title}
          onChange={handleTitleChange}
          placeholder="Untitled Note"
          className={cn(
            "text-xl font-bold border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent truncate",
            styleMode === "knowledge" && "text-base font-black tracking-tight",
            styleMode === "youthful" && "text-2xl font-black text-primary"
          )}
        />

        {/* Custom Actions Panel for Youthful Mode */}
        {styleMode === "youthful" && (
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Color Palette Selector */}
            <div className="relative" ref={colorRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="size-8 rounded-xl cursor-pointer hover:bg-primary/5 hover:text-primary transition-all"
                title="Change Background Color"
              >
                <Palette className="size-4" />
              </Button>
              {showColorPicker && (
                <div className="absolute right-0 top-9 z-50 w-44 p-2 bg-card border border-border shadow-lg rounded-2xl flex flex-wrap gap-1.5 justify-center font-sans">
                  {bgColors.map(color => (
                    <button
                      key={color.hex}
                      onClick={() => {
                        updateNote(note.id, { pageColor: color.hex });
                        setShowColorPicker(false);
                      }}
                      style={{ backgroundColor: color.hex }}
                      className={cn(
                        "size-7 rounded-full border border-black/10 transition-all cursor-pointer hover:scale-110",
                        note.pageColor === color.hex && "ring-2 ring-primary scale-105"
                      )}
                      title={color.name}
                    />
                  ))}
                  {note.pageColor && (
                    <button
                      onClick={() => {
                        updateNote(note.id, { pageColor: undefined });
                        setShowColorPicker(false);
                      }}
                      className="w-full text-[10px] font-bold text-center mt-1 py-1 bg-secondary rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      Reset Color
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Sticker Selector */}
            <div className="relative" ref={stickerRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowStickerPicker(!showStickerPicker)}
                className="size-8 rounded-xl cursor-pointer hover:bg-primary/5 hover:text-primary transition-all"
                title="Pin Emoji Sticker"
              >
                <Smile className="size-4" />
              </Button>
              {showStickerPicker && (
                <div className="absolute right-0 top-9 z-50 w-56 p-2.5 bg-card border border-border shadow-lg rounded-2xl flex flex-wrap gap-2.5 justify-center font-sans">
                  {stickersList.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => {
                        addSticker(note.id, emoji);
                        setShowStickerPicker(false);
                      }}
                      className="text-xl hover:scale-125 transition-transform cursor-pointer select-none"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
        <span className="flex items-center gap-1 select-none">
          <Calendar className="size-3.5" />
          Created: {new Date(note.createdAt).toLocaleDateString()}
        </span>
        {note.tags && note.tags.length > 0 && (
          <span className="flex items-center gap-1 select-none">
            <Tag className="size-3.5" />
            Tags: {note.tags.map(t => `#${t}`).join(", ")}
          </span>
        )}
      </div>
    </div>
  );
};
