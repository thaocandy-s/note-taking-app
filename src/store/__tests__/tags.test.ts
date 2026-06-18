import { describe, it, expect, beforeEach } from "vitest";
import { useNotesStore } from "../useNotesStore";

describe("useNotesStore Custom Tag Actions", () => {
  beforeEach(() => {
    useNotesStore.setState({
      notes: [],
      activeNoteId: null,
      styleMode: "minimalist",
      searchQuery: "",
      selectedTag: null,
      isFocusMode: false
    });
  });

  it("should add a custom tag to a note", () => {
    const store = useNotesStore.getState();
    store.createNote();
    const noteId = useNotesStore.getState().notes[0].id;

    useNotesStore.getState().addCustomTag(noteId, "Work");
    expect(useNotesStore.getState().notes[0].customTags).toEqual(["Work"]);

    // Ignore duplicate tags (case-insensitive)
    useNotesStore.getState().addCustomTag(noteId, "work");
    expect(useNotesStore.getState().notes[0].customTags).toEqual(["Work"]);

    // Add another custom tag
    useNotesStore.getState().addCustomTag(noteId, "Important");
    expect(useNotesStore.getState().notes[0].customTags).toEqual(["Work", "Important"]);
  });

  it("should enforce tag validation constraints", () => {
    const store = useNotesStore.getState();
    store.createNote();
    const noteId = useNotesStore.getState().notes[0].id;

    // Ignore empty/whitespace tags
    useNotesStore.getState().addCustomTag(noteId, "   ");
    expect(useNotesStore.getState().notes[0].customTags || []).toEqual([]);

    // Ignore tags longer than 20 characters
    useNotesStore.getState().addCustomTag(noteId, "thisisanextremelylongtagname");
    expect(useNotesStore.getState().notes[0].customTags || []).toEqual([]);
  });

  it("should prevent custom tags overlapping with auto-extracted hashtags", () => {
    const store = useNotesStore.getState();
    store.createNote();
    const noteId = useNotesStore.getState().notes[0].id;

    // Set content that auto-extracts #ideas
    useNotesStore.getState().updateNote(noteId, {
      content: "Here is some #ideas"
    });
    expect(useNotesStore.getState().notes[0].tags).toEqual(["ideas"]);

    // Attempting to add "ideas" or "Ideas" as a custom tag should be ignored
    useNotesStore.getState().addCustomTag(noteId, "Ideas");
    expect(useNotesStore.getState().notes[0].customTags || []).toEqual([]);
  });

  it("should remove a custom tag from a note", () => {
    const store = useNotesStore.getState();
    store.createNote();
    const noteId = useNotesStore.getState().notes[0].id;

    useNotesStore.getState().addCustomTag(noteId, "Work");
    useNotesStore.getState().addCustomTag(noteId, "Personal");

    useNotesStore.getState().removeCustomTag(noteId, "work"); // case-insensitive remove
    expect(useNotesStore.getState().notes[0].customTags).toEqual(["Personal"]);
  });

  it("should rename custom tags globally and update filter", () => {
    const store = useNotesStore.getState();
    
    // Create note 1 and tag it
    store.createNote();
    const noteId1 = useNotesStore.getState().notes[0].id;
    useNotesStore.getState().addCustomTag(noteId1, "ProjectA");
    useNotesStore.getState().addCustomTag(noteId1, "Shared");

    // Create note 2 and tag it
    store.createNote();
    const noteId2 = useNotesStore.getState().notes[0].id;
    useNotesStore.getState().addCustomTag(noteId2, "ProjectA");

    // Set selected filter
    useNotesStore.getState().setSelectedTag("ProjectA");

    // Rename globally
    useNotesStore.getState().renameTagGlobally("ProjectA", "ProjectAlpha");

    const notes = useNotesStore.getState().notes;
    const note1 = notes.find(n => n.id === noteId1);
    const note2 = notes.find(n => n.id === noteId2);

    expect(note1?.customTags).toEqual(["Shared", "ProjectAlpha"]);
    expect(note2?.customTags).toEqual(["ProjectAlpha"]);
    expect(useNotesStore.getState().selectedTag).toBe("ProjectAlpha");
  });

  it("should delete custom tags globally and reset filter if active", () => {
    const store = useNotesStore.getState();

    store.createNote();
    const noteId1 = useNotesStore.getState().notes[0].id;
    useNotesStore.getState().addCustomTag(noteId1, "Temporary");
    useNotesStore.getState().addCustomTag(noteId1, "Permanent");

    useNotesStore.getState().setSelectedTag("Temporary");

    // Delete globally
    useNotesStore.getState().deleteTagGlobally("Temporary");

    expect(useNotesStore.getState().notes[0].customTags).toEqual(["Permanent"]);
    expect(useNotesStore.getState().selectedTag).toBeNull();
  });
});
