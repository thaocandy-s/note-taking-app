import type { Note } from "../types/note";

/**
 * Extracts all unique hashtags from note content.
 * e.g., "Hello #work and #personal" -> ["work", "personal"]
 */
export function extractTags(content: string): string[] {
  if (!content) return [];
  // Matches #tag but not inside code block/inline code (approximate via text match)
  const matches = content.match(/\B#([a-zA-Z0-9_-]+)/g);
  if (!matches) return [];
  return Array.from(new Set(matches.map(tag => tag.slice(1).toLowerCase())));
}

/**
 * Extracts all unique Wiki Links from note content.
 * e.g., "See [[Meeting Notes]]" -> ["Meeting Notes"]
 */
export function extractWikiLinks(content: string): string[] {
  if (!content) return [];
  const matches = content.match(/\[\[(.*?)\]\]/g);
  if (!matches) return [];
  return Array.from(
    new Set(
      matches
        .map(link => link.slice(2, -2).trim())
        .filter(title => title.length > 0)
    )
  );
}

/**
 * Finds all notes that link to the target note title.
 */
export function getBacklinks(notes: Note[], targetTitle: string): Note[] {
  if (!targetTitle || targetTitle.trim() === "") return [];
  const lowerTarget = targetTitle.trim().toLowerCase();
  return notes.filter(n => {
    const links = extractWikiLinks(n.content);
    return links.some(l => l.toLowerCase() === lowerTarget);
  });
}

/**
 * Resolves the display title for a note:
 * 1. Uses explicit note.title if set.
 * 2. Uses the first non-empty line of markdown content (stripping # header symbols).
 * 3. Falls back to "Untitled".
 */
export function getNoteTitle(note: { title?: string; content?: string }): string {
  if (note.title && note.title.trim().length > 0) {
    return note.title.trim();
  }
  if (note.content) {
    const lines = note.content.split("\n");
    for (const line of lines) {
      const cleanLine = line.replace(/^#+\s+/, "").trim();
      if (cleanLine.length > 0) {
        return cleanLine;
      }
    }
  }
  return "Untitled";
}

/**
 * Returns a stripped down text excerpt for sidebar cards.
 */
export function getExcerpt(content: string, maxLength: number = 80): string {
  if (!content) return "";
  const clean = content
    .replace(/\[\[(.*?)\]\]/g, "$1") // Simplify wiki links
    .replace(/#+\s+/g, "")          // Strip markdown headers
    .replace(/[*_`#]/g, "")         // Strip simple styling symbols
    .replace(/\n+/g, " ")           // Collapse lines to spaces
    .trim();

  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength) + "...";
}

/**
 * Standard date formatter.
 */
export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(date);
  } catch {
    return dateStr;
  }
}
