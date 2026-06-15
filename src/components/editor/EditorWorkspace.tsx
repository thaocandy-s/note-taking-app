import React, { useRef, useState } from "react";
import { useNotesStore } from "../../store/useNotesStore";
import { getNoteTitle, getBacklinks } from "../../lib/note-utils";
import { NoteHeader } from "./NoteHeader";
import { Toolbar } from "./Toolbar";
import { MarkdownPreview } from "./MarkdownPreview";
import { DoodleCanvas } from "./DoodleCanvas";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { FileText, Image as ImageIcon, Share2, Pencil, Eye } from "lucide-react";
import { cn } from "../../lib/utils";

export const EditorWorkspace: React.FC = () => {
  const { notes, activeNoteId, updateNote, styleMode, createNote } = useNotesStore();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Active Tab state for special features (Doodle)
  const [activeTab, setActiveTab] = useState<"write" | "doodle">("write");
  
  // Mobile Split state: "edit" or "preview"
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");

  // Retrieve active note
  const note = notes.find(n => n.id === activeNoteId);

  // If no note is selected, render Empty State
  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none bg-background">
        <div className={cn(
          "flex flex-col items-center max-w-sm gap-4 p-8 border border-dashed border-border",
          styleMode === "youthful" && "rounded-2xl border-2 border-primary/20 bg-primary/5 shadow-xs font-sans",
          styleMode === "knowledge" && "rounded-none font-mono",
          styleMode === "minimalist" && "rounded-lg"
        )}>
          <FileText className="size-12 text-muted-foreground/60 animate-pulse" />
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-bold">No Note Selected</h2>
            <p className="text-xs text-muted-foreground">
              Select an existing note from the sidebar or create a new one to begin writing.
            </p>
          </div>
          <Button onClick={() => createNote()} className={cn(
            "cursor-pointer mt-2 text-xs",
            styleMode === "youthful" && "rounded-xl font-bold bg-primary hover:bg-primary/90",
            styleMode === "knowledge" && "rounded-none font-mono"
          )}>
            Create First Note
          </Button>
        </div>
      </div>
    );
  }

  // Calculate metadata values
  const textContent = note.content || "";
  const charCount = textContent.length;
  const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Find incoming backlinks for this note title
  const backlinks = getBacklinks(notes, getNoteTitle(note));

  // Insertion callback for Toolbar shortcuts
  const handleInsertMarkdown = (prefix: string, suffix: string, defaultText: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const insertText = selected || defaultText;
    
    const replacement = prefix + insertText + suffix;
    const newContent = text.substring(0, start) + replacement + text.substring(end);

    updateNote(note.id, { content: newContent });

    // Focus and highlight inserted content in next macro-tick
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + insertText.length
      );
    }, 0);
  };

  return (
    <div 
      style={{ backgroundColor: styleMode === "youthful" ? note.pageColor : undefined }}
      className="flex-1 flex flex-col overflow-hidden transition-all duration-300 h-full relative"
    >
      {/* 1. Note Header */}
      <NoteHeader note={note} />

      {/* 2. Workspace Navigation Tabs (Youthful Doodle Sketchpad) */}
      <div className={cn(
        "flex items-center justify-between border-b border-border bg-card/20 px-4 h-11 shrink-0 select-none",
        styleMode === "knowledge" && "font-mono border-b-2"
      )}>
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("write")}
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
              activeTab === "write"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground",
              styleMode === "youthful" && activeTab === "write" && "bg-primary/10 text-primary rounded-xl",
              styleMode === "knowledge" && "rounded-none"
            )}
          >
            Editor
          </button>
          
          {styleMode === "youthful" && (
            <button
              onClick={() => setActiveTab("doodle")}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer",
                activeTab === "doodle"
                  ? "bg-primary/10 text-primary rounded-xl font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ImageIcon className="size-3.5" />
              Sketchpad
            </button>
          )}

        </div>

        {/* Mobile View Toggle Buttons (Only shown for Write tab on mobile size) */}
        {activeTab === "write" && (
          <div className="flex md:hidden bg-secondary/80 p-0.5 rounded-lg border border-border">
            <button
              onClick={() => setMobileView("edit")}
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md cursor-pointer",
                mobileView === "edit" ? "bg-card text-foreground" : "text-muted-foreground"
              )}
            >
              <Pencil className="size-3" />
              Edit
            </button>
            <button
              onClick={() => setMobileView("preview")}
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md cursor-pointer",
                mobileView === "preview" ? "bg-card text-foreground" : "text-muted-foreground"
              )}
            >
              <Eye className="size-3" />
              Preview
            </button>
          </div>
        )}
      </div>

      {/* 3. Tab Body Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === "write" && (
          <div className="h-full flex flex-col overflow-hidden">
            {/* Markdown Toolbar helper */}
            <Toolbar onInsertMarkdown={handleInsertMarkdown} />
            
            {/* Editor Workspace Splitting Layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Monospace Text Area Editor */}
              <div className={cn(
                "flex-1 flex flex-col border-r border-border h-full overflow-hidden bg-card/10",
                mobileView === "edit" ? "flex" : "hidden md:flex",
                styleMode === "knowledge" && "border-r-2"
              )}>
                <Textarea
                  ref={textareaRef}
                  value={note.content}
                  onChange={(e) => updateNote(note.id, { content: e.target.value })}
                  placeholder="Start typing in Markdown... (e.g. # Header, **bold**, [[Wiki Link]] to connect notes)"
                  className={cn(
                    "flex-1 w-full border-none shadow-none focus-visible:ring-0 resize-none p-4 text-xs font-mono leading-relaxed bg-transparent",
                    styleMode === "youthful" && "font-sans text-stone-800"
                  )}
                />
              </div>

              {/* Live Markdown Render Preview */}
              <div className={cn(
                "flex-1 h-full overflow-hidden",
                mobileView === "preview" ? "flex" : "hidden md:flex"
              )}>
                <MarkdownPreview content={note.content} />
              </div>
            </div>
          </div>
        )}

        {/* Doodle Sketchpad (Youthful Mode) */}
        {activeTab === "doodle" && styleMode === "youthful" && (
          <DoodleCanvas noteId={note.id} />
        )}

      </div>

      {/* 4. Footer Metadata & Backlinks Section */}
      <footer className={cn(
        "border-t border-border px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground font-semibold flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 select-none",
        styleMode === "knowledge" && "font-mono border-t-2"
      )}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>Words: {wordCount}</span>
          <span>Chars: {charCount}</span>
          <span>Time: ~{readingTime} min</span>
        </div>

        {/* Backlinks panel (KM Style only) */}
        {styleMode === "knowledge" && backlinks.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="flex items-center gap-1 uppercase tracking-wide text-primary">
              <Share2 className="size-3" />
              Backlinks ({backlinks.length}):
            </span>
            <div className="flex gap-1.5 overflow-x-auto">
              {backlinks.map(bn => (
                <button
                  key={bn.id}
                  onClick={() => useNotesStore.getState().selectNote(bn.id)}
                  className="px-1.5 py-0.5 bg-secondary text-primary border border-border hover:bg-primary/10 hover:text-primary transition-all rounded-sm text-[9px] uppercase tracking-wide font-black cursor-pointer"
                >
                  {getNoteTitle(bn)}
                </button>
              ))}
            </div>
          </div>
        )}
      </footer>
    </div>
  );
};
