# Implementation Plan: Manage and Filter Notes by Tags

**Branch**: `001-manage-and-filter-notes-by-tags` | **Date**: 2026-06-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-tags/spec.md`

## Summary

The goal of this feature is to allow users to manually assign tags to notes, manage those tags globally, and filter their notes by selected tags in the sidebar. This complements the existing auto-extracted hashtag system. We will introduce a `customTags` field to the `Note` entity, add store actions to manage tags, build a tag editor widget in the note header, and add a tag management modal.

## Technical Context

- **Language/Version**: TypeScript 5.x / React 19
- **Primary Dependencies**: Zustand 5.x, Radix UI 1.x, Lucide React
- **Storage**: LocalStorage (persisted via Zustand persist middleware under `notes-app-storage`)
- **Testing**: Vitest 4.x, React Testing Library
- **Target Platform**: Modern Web Browsers (Desktop & Mobile Web)
- **Project Type**: Web application (Vite-based Single-Page App)
- **Performance Goals**: Note list filtering under 50ms; state updates and persistence under 100ms.
- **Constraints**: Offline-capable, responsive styling using Tailwind CSS v4.
- **Scale/Scope**: Up to 1,000 notes, 100 unique tags, and up to 20 tags per note.

## Constitution Check

- **Component-Driven UI**: Passed. We will build reusable tag badges, a tag editor input, and a management dialog using Radix UI primitives.
- **Central State Management**: Passed. All tag additions, deletions, renames, and active filters will be handled through Zustand actions in `useNotesStore.ts`.
- **Test-Driven Assurance**: Passed. We will add automated unit tests in `src/store/__tests__/tags.test.ts`.
- **Clean Type Safety**: Passed. All structures will have strict TypeScript types.
- **Markdown Rendering & Persistence**: Passed. Note contents and automatic markdown hashtags will remain unaffected.

## Project Structure

### Documentation (this feature)

```text
specs/001-tags/
├── plan.md              # This file
├── research.md          # Research options and final design decisions
├── data-model.md        # Extended note types and store actions
└── quickstart.md        # Validation scenarios and testing instructions
```

### Source Code (repository root)

We will modify and create files in the following locations:

```text
src/
├── types/
│   └── note.ts          # Modify: Add customTags field & tag management store actions
├── store/
│   ├── useNotesStore.ts # Modify: Implement store actions & include customTags in persistence
│   └── __tests__/
│       └── tags.test.ts # [NEW] Test suite for tag actions
└── components/
    ├── editor/
    │   ├── NoteHeader.tsx # Modify: Add custom tag badge rendering & inline tag input
    │   └── TagEditor.tsx  # [NEW] Reusable tag dropdown editor
    └── sidebar/
        ├── TagFilter.tsx  # Modify: Render merged tag lists & add Tag Management trigger
        └── TagManager.tsx # [NEW] Global Tag Manager modal (rename/delete)
```

**Structure Decision**: Single React web application.
