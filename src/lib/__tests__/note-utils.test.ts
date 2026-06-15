import { describe, it, expect } from "vitest";
import {
  extractTags,
  extractWikiLinks,
  getBacklinks,
  getNoteTitle,
  getExcerpt
} from "../note-utils";
import type { Note } from "../../types/note";

describe("note-utils.ts unit tests", () => {
  describe("extractTags", () => {
    it("should extract simple tags", () => {
      const content = "This is a note with #work and #personal tags.";
      expect(extractTags(content)).toEqual(["work", "personal"]);
    });

    it("should normalize tags to lowercase and dedup", () => {
      const content = "Testing #Work, #work, and #WORK tags.";
      expect(extractTags(content)).toEqual(["work"]);
    });

    it("should return empty array if no tags found", () => {
      const content = "Just some text without any hashtags.";
      expect(extractTags(content)).toEqual([]);
    });

    it("should handle empty content", () => {
      expect(extractTags("")).toEqual([]);
    });
  });

  describe("extractWikiLinks", () => {
    it("should extract double bracket wiki links", () => {
      const content = "See [[Meeting Notes]] and [[Action Items]].";
      expect(extractWikiLinks(content)).toEqual(["Meeting Notes", "Action Items"]);
    });

    it("should trim and dedup wiki links", () => {
      const content = "Link to [[  Meeting Notes  ]] and [[Meeting Notes]].";
      expect(extractWikiLinks(content)).toEqual(["Meeting Notes"]);
    });

    it("should return empty array if no links", () => {
      const content = "Normal text [with brackets] but not double.";
      expect(extractWikiLinks(content)).toEqual([]);
    });
  });

  describe("getBacklinks", () => {
    const mockNotes: Note[] = [
      {
        id: "1",
        title: "A",
        content: "Links to [[B]] and [[C]]",
        createdAt: "",
        updatedAt: "",
        tags: []
      },
      {
        id: "2",
        title: "B",
        content: "Links to [[C]]",
        createdAt: "",
        updatedAt: "",
        tags: []
      },
      {
        id: "3",
        title: "C",
        content: "No links",
        createdAt: "",
        updatedAt: "",
        tags: []
      }
    ];

    it("should find backlinks linking to a specific note title", () => {
      const backlinksToC = getBacklinks(mockNotes, "C");
      expect(backlinksToC.map(n => n.title)).toEqual(["A", "B"]);
      
      const backlinksToB = getBacklinks(mockNotes, "B");
      expect(backlinksToB.map(n => n.title)).toEqual(["A"]);
    });

    it("should handle case-insensitivity in backlinks", () => {
      const backlinksToC = getBacklinks(mockNotes, "c");
      expect(backlinksToC.map(n => n.title)).toEqual(["A", "B"]);
    });

    it("should return empty array if no matches", () => {
      expect(getBacklinks(mockNotes, "D")).toEqual([]);
    });
  });

  describe("getNoteTitle", () => {
    it("should prioritize explicit title field if present", () => {
      const note = { title: "Custom Title", content: "# Header Title\nContent text" };
      expect(getNoteTitle(note)).toBe("Custom Title");
    });

    it("should extract first non-empty line as title if title is blank", () => {
      const note = { title: "", content: "\n\n  \n# Main Heading\nSecond line" };
      expect(getNoteTitle(note)).toBe("Main Heading");
    });

    it("should fallback to Untitled if content has no non-empty lines", () => {
      const note = { title: "", content: "\n\n   \n" };
      expect(getNoteTitle(note)).toBe("Untitled");
    });
  });

  describe("getExcerpt", () => {
    it("should strip markdown characters and return excerpt", () => {
      const content = "# Header\nThis is **bold** text and *italic* code `ticks` in [[Wiki Link]].";
      expect(getExcerpt(content, 40)).toBe("Header This is bold text and italic code...");
    });

    it("should truncate correctly", () => {
      const content = "Short text.";
      expect(getExcerpt(content, 40)).toBe("Short text.");
    });
  });
});
