# Feature Specification: Manage and Filter Notes by Tags

**Feature Branch**: `001-manage-and-filter-notes-by-tags`

**Created**: 2026-06-18

**Status**: Draft

**Input**: User description: "Tạo đặc tả tính năng quản lý thẻ (Tag) và lọc ghi chú theo thẻ cho dự án note-taking-app."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and Assign Tags to Notes (Priority: P1)

Users can create new tags and assign them to notes so they can categorize their thoughts.

**Why this priority**: Categorizing notes is the foundational step of tag management. Without assigning tags, filtering is not possible.

**Independent Test**: Can be fully tested by opening a note, creating a tag "Personal", assigning it to the note, and verifying that the badge "Personal" appears on the note card and note editor.

**Acceptance Scenarios**:

1. **Given** a note is open in the editor, **When** the user clicks "Add Tag" and enters "Work", **Then** the "Work" tag badge is created and displayed on that note.
2. **Given** a note has a tag badge "Work", **When** the user clicks the "x" (remove) button on the tag badge, **Then** the tag is unassigned from the note.
3. **Given** a note has existing tags, **When** the user opens the tag selector, **Then** the existing tags are shown as selected, and other tags can be toggled.

---

### User Story 2 - Filter Notes by Tags (Priority: P1)

Users can select one or more tags in the sidebar to filter their note list, showing only the notes that contain the selected tags.

**Why this priority**: Essential for retrieving categorized notes quickly when the total number of notes grows.

**Independent Test**: Can be fully tested by selecting "Work" in the sidebar tag list and verifying that the notes list only displays notes containing the "Work" tag.

**Acceptance Scenarios**:

1. **Given** notes list contains notes with tags "Work", "Ideas", and some with no tags, **When** the user clicks the "Work" tag in the sidebar, **Then** only the notes with the "Work" tag are displayed.
2. **Given** the user has selected "Work" tag filter in the sidebar, **When** the user clicks "Clear Filter" or deselects the "Work" tag, **Then** the full list of notes is displayed again.
3. **Given** multiple tags are selected, **When** filtering is active, **Then** the list shows notes that match *any* of the selected tags (OR filtering).

---

### User Story 3 - Global Tag Management (Priority: P2)

Users can view all unique tags in a central list, rename a tag globally, or delete a tag globally.

**Why this priority**: Helps maintain a clean set of tags over time without having to edit notes individually.

**Independent Test**: Can be fully tested by renaming a tag "Urgent" to "Priority 1" in the management panel, and checking that all notes previously tagged "Urgent" now show "Priority 1".

**Acceptance Scenarios**:

1. **Given** a tag "Marketing" is assigned to 3 notes, **When** the user deletes the tag "Marketing" in the global tag manager, **Then** the tag is removed from the global list and from all 3 notes.
2. **Given** a tag "ProjectA" is assigned to 2 notes, **When** the user renames it to "Project-Alpha" globally, **Then** the global tag is updated and both notes display "Project-Alpha".

---

### Edge Cases

- **Duplicate Tags**: The system must prevent assigning the exact same tag name multiple times to a single note. Tag names should be case-insensitive (e.g., "Work" and "work" are treated as the same tag).
- **Empty / Too Long Tag Names**: Tag names must not be empty or consist only of whitespace. They should have a maximum length of 20 characters to prevent UI layout breakage.
- **Deleting Active Filter Tag**: If a user is filtering by a tag "Temporary", and they globally delete the tag "Temporary", the active filter must be cleared automatically so the user is not left with an empty list.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to create tags with a custom text name (alphanumeric, spaces, max 20 chars).
- **FR-002**: Users MUST be able to assign multiple tags to a single note.
- **FR-003**: The sidebar MUST render a "Tags" section listing all unique tags currently defined in the application.
- **FR-004**: Clicking a tag in the sidebar MUST filter the active notes list.
- **FR-005**: All tags and note-tag relationships MUST be persisted locally so they remain after a page refresh.
- **FR-006**: Removing a tag from a note MUST NOT delete the tag globally if it is still used by other notes.

### Key Entities *(include if feature involves data)*

- **Tag**:
  - `id`: Unique string identifier.
  - `name`: String (non-empty, max 20 chars, case-insensitive uniqueness).
  - `color`: String (HEX or Tailwind color class for visual styling).
- **Note**:
  - Has a collection of `tagIds` or relationship to `Tag` objects.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can assign a tag to a note in less than 3 user clicks.
- **SC-002**: Notes list updates within 50ms upon selecting or deselecting a tag filter.
- **SC-003**: All tag assignments are persisted in under 100ms.
- **SC-004**: 100% of assigned tags survive a hard browser page reload.

## Assumptions

- **Local Persistence**: State and tags are persisted in LocalStorage (configured via Zustand persist middleware).
- **Predefined Colors**: The system will automatically assign a color to new tags from a set of predefined aesthetic pastel colors (e.g., soft blue, soft green, soft purple, soft yellow).
- **No Backend**: All tag data management is frontend-only; there is no backend database synchronisation in this version.
