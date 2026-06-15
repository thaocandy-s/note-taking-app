export type StyleMode = 'minimalist' | 'youthful' | 'knowledge';

export interface Note {
  id: string;                  // Unique note ID
  title: string;               // Auto-derived or custom title
  content: string;             // Raw Markdown content
  createdAt: string;           // ISO DateTime String
  updatedAt: string;           // ISO DateTime String
  tags: string[];              // Auto-extracted hashtag tokens

  // Style-specific metadata
  pageColor?: string;          // Youthful Mode: customizable background color
  stickers?: string[];         // Youthful Mode: floating emojis/stickers
  doodleData?: string;         // Youthful Mode: Base64 canvas overlay image URL
}


export interface NotesStoreState {
  notes: Note[];
  activeNoteId: string | null;
  styleMode: StyleMode;
  searchQuery: string;
  selectedTag: string | null;
  isFocusMode: boolean; // Minimalist Mode: full screen typing

  // Basic Actions
  setStyleMode: (mode: StyleMode) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  setFocusMode: (focused: boolean) => void;

  createNote: (title?: string, content?: string) => void;
  selectNote: (id: string) => void;
  updateNote: (id: string, patch: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // Custom Youthful Style Actions
  addSticker: (noteId: string, sticker: string) => void;
  removeSticker: (noteId: string, stickerIndex: number) => void;
  updateDoodle: (noteId: string, doodleData: string) => void;
}
