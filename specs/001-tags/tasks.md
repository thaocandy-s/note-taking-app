# Tasks: Manage and Filter Notes by Tags

**Input**: Design documents from `specs/001-tags/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Contains exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Setup test configuration for tags in `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core model extensions and Zustand actions that must be complete before any UI work can begin

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Modify note interfaces to add customTags and new store actions in `src/types/note.ts`
- [x] T003 Implement tag addition, deletion, rename, and clear actions in `src/store/useNotesStore.ts`
- [x] T004 [P] Create store unit tests validating tag CRUD and global cascading changes in `src/store/__tests__/tags.test.ts`

**Checkpoint**: Foundation ready - store state and actions are fully tested and functional.

---

## Phase 3: User Story 1 - Create and Assign Tags to Notes (Priority: P1) 🎯 MVP

**Goal**: Allow users to manually add and remove custom tags on the active note in the editor.

**Independent Test**: Open a note, click "Add Tag", type a tag name, see it render as a badge, and click "x" to remove it.

### Implementation for User Story 1

- [x] T005 [P] [US1] Create a custom tag editor and popover selection component in `src/components/editor/TagEditor.tsx`
- [x] T006 [US1] Integrate the tag selection trigger and render custom tag badges with remove actions in `src/components/editor/NoteHeader.tsx`

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Filter Notes by Tags (Priority: P1)

**Goal**: Render a list of all unique tags in the sidebar and filter the notes list by the selected tag.

**Independent Test**: Click a tag in the sidebar; verify that only notes containing that tag (either as custom tag or inline hashtag) are displayed.

### Implementation for User Story 2

- [x] T007 [US2] Update the sidebar tag filter list compilation to merge tags and customTags in `src/components/sidebar/TagFilter.tsx`
- [x] T008 [US2] Update the note list filtering logic to match selectedTag against both tags and customTags in `src/components/sidebar/Sidebar.tsx`

**Checkpoint**: User Stories 1 and 2 are functional and testable together.

---

## Phase 5: User Story 3 - Global Tag Management (Priority: P2)

**Goal**: Build a management panel where users can view all unique tags, rename them globally, or delete them globally.

**Independent Test**: Open global tag management dialog, rename a tag, and verify it updates across all notes. Delete a tag, verify it's removed.

### Implementation for User Story 3

- [x] T009 [P] [US3] Create a global tag manager modal component displaying all tags with rename and delete buttons in `src/components/sidebar/TagManager.tsx`
- [x] T010 [US3] Add a "Manage Tags" button triggering the modal in `src/components/sidebar/TagFilter.tsx`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: UI refinement, responsiveness, and final validation

- [x] T011 Polish mobile responsiveness and styling of the tag popover and manager modal in `src/components/editor/TagEditor.tsx` and `src/components/sidebar/TagManager.tsx`
- [x] T012 Run automated tests and quickstart verification in `specs/001-tags/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User Story 1 (P1) is the MVP and must be completed first.
  - User Story 2 (P1) depends on User Story 1 to test filtering with custom tags.
  - User Story 3 (P2) can be implemented after User Story 2 is functional.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### Parallel Opportunities

- Foundational test task `T004` can be written in parallel with store implementation `T003`.
- User Story 3 UI components `T009` can be created in parallel with User Story 2 tasks once the foundational state actions are ready.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (state and store tests).
3. Complete Phase 3: User Story 1 (editor inline tagging UI).
4. **STOP and VALIDATE**: Verify that tags can be added and removed from notes and survive page reloads.

### Incremental Delivery

1. Complete Setup + Foundational.
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!).
3. Add User Story 2 → Test sidebar filtering of tags.
4. Add User Story 3 → Test global renaming and deletions.
