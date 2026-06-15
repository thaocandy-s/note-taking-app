import React from "react";
import { Bold, Italic, Heading, Code, Link2, List } from "lucide-react";
import { useNotesStore } from "../../store/useNotesStore";
import { cn } from "../../lib/utils";

interface ToolbarProps {
  onInsertMarkdown: (prefix: string, suffix: string, defaultText?: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onInsertMarkdown }) => {
  const { styleMode } = useNotesStore();

  const tools = [
    {
      icon: <Bold className="size-4" />,
      label: "Bold",
      onClick: () => onInsertMarkdown("**", "**", "bold text"),
    },
    {
      icon: <Italic className="size-4" />,
      label: "Italic",
      onClick: () => onInsertMarkdown("*", "*", "italic text"),
    },
    {
      icon: <Heading className="size-4" />,
      label: "Header",
      onClick: () => onInsertMarkdown("### ", "", "Header"),
    },
    {
      icon: <List className="size-4" />,
      label: "Bullet List",
      onClick: () => onInsertMarkdown("- ", "", ""),
    },
    {
      icon: <Code className="size-4" />,
      label: "Code Block",
      onClick: () => onInsertMarkdown("```\n", "\n```", "code"),
    },
    {
      icon: <Link2 className="size-4" />,
      label: "Wiki Link",
      onClick: () => onInsertMarkdown("[[", "]]", "Note Title"),
    },
  ];

  return (
    <div className={cn(
      "flex flex-wrap items-center gap-1 p-1.5 border-b border-border bg-muted/30 select-none",
      styleMode === "knowledge" && "font-mono border-b-2"
    )}>
      {tools.map((tool, idx) => (
        <button
          key={idx}
          onClick={tool.onClick}
          className={cn(
            "p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer",
            styleMode === "youthful" && "rounded-lg hover:scale-105 hover:bg-primary/5 active:scale-95",
            styleMode === "knowledge" && "rounded-none hover:bg-accent/40"
          )}
          title={tool.label}
          aria-label={tool.label}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
};
