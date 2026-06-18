# Data Model: Note Tagging System

This document outlines the data structures, types, and state additions for the Tag Management feature.

## Entities

### 1. Note (Extended)

The existing `Note` model is extended with a new field `customTags` to hold manually assigned tags.

```typescript
export interface Note {
  id: string;                  // Unique note ID
  title: string;               // Auto-derived or custom title
  content: string;             // Raw Markdown content
  createdAt: string;           // ISO DateTime String
  updatedAt: string;           // ISO DateTime String
  tags: string[];              // Auto-extracted hashtag tokens (read-only)
  customTags?: string[];       // [NEW] Manually assigned tags (UI-managed)

  // Style-specific metadata
  pageColor?: string;
  stickers?: string[];
  doodleData?: string;
}
```

### 2. Tag (Virtual Entity)

Tags are represented as virtual entities compiled at runtime to optimize storage.

```typescript
export interface Tag {
  name: string;                // Uniquely identifies the tag (case-insensitive)
  count: number;               // Number of notes assigned this tag
  type: 'hashtag' | 'custom';  // Indicates how the tag was created
}
```

---

## State & Actions in Zustand Store (`NotesStoreState`)

### New State Properties

- `selectedTags: string[]`: Array of currently selected tags for filtering (to support multi-tag selection if needed, or we can use the existing `selectedTag: string | null` for backward compatibility, keeping single selection but extending to a list later. Let's stick to single tag filter `selectedTag: string | null` for current compliance, but prepare for multi-tag).

### New Actions

```typescript
export interface NotesStoreState {
  // ... existing fields ...
  
  // Tag Management Actions
  addCustomTag: (noteId: string, tagName: string) => void;
  removeCustomTag: (noteId: string, tagName: string) => void;
  renameTagGlobally: (oldName: string, newName: string) => void;
  deleteTagGlobally: (tagName: string) => void;
}
```

---

## Validation & Business Rules

1. **Tag Uniqueness**: Tag names are case-insensitive. A note cannot have duplicates in `customTags`, nor can `customTags` overlap with the auto-extracted `tags` (if a tag exists in both, the custom tag takes precedence or is merged).
2. **Tag Format**: Tag names must be between 1 and 20 characters, containing only alphanumeric characters, dashes, and spaces.
3. **Cascading Deletes**: When a tag is globally deleted, it must be removed from `customTags` in all notes. If that tag was selected in the sidebar filter, the filter must reset to `null`.
