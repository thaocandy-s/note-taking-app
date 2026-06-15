import { describe, it, expect, beforeEach } from "vitest";
import { useNotesStore } from "../useNotesStore";

describe("useNotesStore Zustand store tests", () => {
  beforeEach(() => {
    // Reset Zustand store state before each test run
    useNotesStore.setState({
      notes: [],
      activeNoteId: null,
      styleMode: "minimalist",
      searchQuery: "",
      selectedTag: null,
      isFocusMode: false
    });
  });

  it("should create a note with defaults and select it", () => {
    const store = useNotesStore.getState();
    store.createNote();

    const state = useNotesStore.getState();
    expect(state.notes.length).toBe(1);
    expect(state.notes[0].title).toBe("Untitled");
    expect(state.notes[0].content).toBe("");
    expect(state.activeNoteId).toBe(state.notes[0].id);
  });

  it("should select a note", () => {
    const store = useNotesStore.getState();
    store.createNote();
    const noteId1 = useNotesStore.getState().notes[0].id;
    store.createNote();
    const noteId2 = useNotesStore.getState().notes[0].id;

    expect(useNotesStore.getState().activeNoteId).toBe(noteId2);

    useNotesStore.getState().selectNote(noteId1);
    expect(useNotesStore.getState().activeNoteId).toBe(noteId1);
  });

  it("should update a note and auto-extract tags and titles", () => {
    const store = useNotesStore.getState();
    store.createNote();
    const noteId = useNotesStore.getState().notes[0].id;

    useNotesStore.getState().updateNote(noteId, {
      content: "# Meeting Notes\nDiscussion about #project and #deadline."
    });

    const updated = useNotesStore.getState().notes[0];
    expect(updated.title).toBe("Meeting Notes");
    expect(updated.tags).toEqual(["project", "deadline"]);
  });

  it("should delete a note and adjust active selection", () => {
    const store = useNotesStore.getState();
    store.createNote();
    const noteId1 = useNotesStore.getState().notes[0].id;
    store.createNote();
    const noteId2 = useNotesStore.getState().notes[0].id;

    expect(useNotesStore.getState().activeNoteId).toBe(noteId2);

    useNotesStore.getState().deleteNote(noteId2);
    expect(useNotesStore.getState().notes.length).toBe(1);
    expect(useNotesStore.getState().activeNoteId).toBe(noteId1);

    useNotesStore.getState().deleteNote(noteId1);
    expect(useNotesStore.getState().notes.length).toBe(0);
    expect(useNotesStore.getState().activeNoteId).toBeNull();
  });

  it("should manage stickers on notes", () => {
    const store = useNotesStore.getState();
    store.createNote();
    const noteId = useNotesStore.getState().notes[0].id;

    useNotesStore.getState().addSticker(noteId, "🌸");
    expect(useNotesStore.getState().notes[0].stickers).toEqual(["🌸"]);

    useNotesStore.getState().addSticker(noteId, "🧸");
    expect(useNotesStore.getState().notes[0].stickers).toEqual(["🌸", "🧸"]);

    useNotesStore.getState().removeSticker(noteId, 0); // Removes 🌸
    expect(useNotesStore.getState().notes[0].stickers).toEqual(["🧸"]);
  });

  it("should change style modes", () => {
    expect(useNotesStore.getState().styleMode).toBe("minimalist");

    useNotesStore.getState().setStyleMode("youthful");
    expect(useNotesStore.getState().styleMode).toBe("youthful");
  });
});
