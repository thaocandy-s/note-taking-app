import React from "react";
import ReactMarkdown from "react-markdown";
import { useNotesStore } from "../../store/useNotesStore";
import { getNoteTitle } from "../../lib/note-utils";
import { cn } from "../../lib/utils";

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  const { notes, selectNote, createNote, styleMode } = useNotesStore();

  // Handle Wiki-Link Navigation or Creation
  const handleWikiLinkClick = (wikiTitle: string) => {
    const targetNote = notes.find(
      n => getNoteTitle(n).toLowerCase() === wikiTitle.trim().toLowerCase()
    );

    if (targetNote) {
      selectNote(targetNote.id);
    } else {
      // Auto-create a note with the wiki link name if it doesn't exist
      createNote(
        wikiTitle.trim(),
        `# ${wikiTitle.trim()}\n\n*Created automatically via wiki-link reference.*`
      );
    }
  };

  // Preprocess text to replace [[WikiLink]] with markdown link syntax [WikiLink](wiki://WikiLink)
  const processedContent = React.useMemo(() => {
    if (!content) return "";
    return content.replace(/\[\[(.*?)\]\]/g, "[$1](wiki://$1)");
  }, [content]);

  return (
    <div className={cn(
      "h-full w-full overflow-y-auto px-6 py-4 bg-background",
      styleMode === "knowledge" && "font-mono"
    )}>
      <div className={cn(
        "prose prose-zinc max-w-none dark:prose-invert text-xs leading-relaxed text-left",
        styleMode === "youthful" && "prose-pink font-sans text-stone-800",
        styleMode === "knowledge" && "prose-slate prose-invert font-mono text-[11px]"
      )}>
        <ReactMarkdown
          components={{
            // Custom link renderer to support wiki:// protocol
            a: ({ href, children, ...props }) => {
              if (href?.startsWith("wiki://")) {
                const wikiTitle = decodeURIComponent(href.slice(7));
                return (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleWikiLinkClick(wikiTitle);
                    }}
                    className={cn(
                      "font-bold underline decoration-dotted cursor-pointer text-primary hover:decoration-solid transition-all",
                      styleMode === "youthful" && "text-pink-500 hover:text-pink-600",
                      styleMode === "knowledge" && "text-sky-400 hover:text-sky-300"
                    )}
                    {...props}
                  >
                    {children}
                  </a>
                );
              }
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "underline text-primary hover:opacity-80",
                    styleMode === "youthful" && "text-pink-500",
                    styleMode === "knowledge" && "text-sky-400"
                  )}
                  {...props}
                >
                  {children}
                </a>
              );
            }
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};
