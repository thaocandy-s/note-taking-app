import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import App from "../../App";
import { useNotesStore } from "../../store/useNotesStore";

// Mock ResizeObserver for jsdom environment compatibility
beforeAll(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("App Integration Tests", () => {
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

  it("should render empty state and create a new note", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Verify initial layout empty state
    expect(screen.getByText("No Note Selected")).toBeInTheDocument();

    // Click to create note
    const createBtn = screen.getByRole("button", { name: /create first note/i });
    await user.click(createBtn);

    // Note card in list
    const noteCards = screen.getAllByText("Untitled");
    expect(noteCards.length).toBeGreaterThan(0);

    // Input text area in workspace
    const textarea = screen.getByPlaceholderText(/start typing in markdown/i);
    expect(textarea).toBeInTheDocument();
  });

  it("should support switching style themes", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(useNotesStore.getState().styleMode).toBe("minimalist");

    // Click Youthful theme selector
    const youthfulTab = screen.getByTitle("Fun & Youthful Style");
    await user.click(youthfulTab);
    expect(useNotesStore.getState().styleMode).toBe("youthful");

    // Click Knowledge theme selector
    const knowledgeTab = screen.getByTitle("Knowledge Management Style");
    await user.click(knowledgeTab);
    expect(useNotesStore.getState().styleMode).toBe("knowledge");
  });
});
