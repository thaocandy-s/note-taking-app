# Tasks: Fix Sidebar Note List Scrolling

**Input**: Design documents from `specs/002-fix-note-list-scroll-bug/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Contains exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project layout verification

- [x] T001 Verify project CSS configuration and viewport responsiveness in `src/index.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core container height configurations

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Verify that the sidebar container layout uses absolute height and overflow constraints in `src/components/layout/Shell.tsx`

**Checkpoint**: Foundation ready - parent containers verified.

---

## Phase 3: User Story 1 - Smooth Scrolling of Note List (Priority: P1) 🎯 MVP

**Goal**: Enable vertical scrolling in the note list sidebar by applying flexbox height constraints.

**Independent Test**: Create 15+ notes on the page and verify you can scroll down to the bottom note cards, while top panels stay fixed.

### Implementation for User Story 1

- [x] T003 [US1] Add the `min-h-0` (or `h-0` if compatibility requires) class to the `<ScrollArea>` tag inside `src/components/sidebar/Sidebar.tsx` to override Flexbox default minimum height behavior

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Responsive checks and validation

- [x] T004 Run manual scroll verification steps defined in `specs/002-fix-note-list-scroll-bug/quickstart.md`
- [x] T005 Run final production build test `npm run build` to verify compiling
- [x] T006 Ensure mobile menu drawer touch scrolling behaves correctly on mobile layouts
