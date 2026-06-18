# Implementation Plan: Fix Sidebar Note List Scrolling

**Branch**: `002-fix-note-list-scroll-bug` | **Date**: 2026-06-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-fix-note-list-scroll-bug/spec.md`

## Summary

The notes list in the sidebar currently overflows the viewport height when many notes are created, making them unreachable. This is caused by Flexbox's default `min-height: auto` on flex items inside a flex column layout. We will resolve this by overriding the default behavior, adding the `min-h-0` class to the `ScrollArea` component inside the sidebar.

## Technical Context

- **Language/Version**: React 19 / TypeScript 5.x
- **Primary Dependencies**: Radix UI ScrollArea
- **Storage**: N/A
- **Testing**: Manual visual testing (verifying scroll behaviour in browser viewports)
- **Target Platform**: Desktop & Mobile Web Browsers
- **Project Type**: Web application
- **Performance Goals**: 60fps scroll animation rendering.
- **Constraints**: No parent window scrollbars, sidebar height strictly constrained to `100vh`.
- **Scale/Scope**: Sidebar layout sizing.

## Constitution Check

- **Component-Driven UI**: Passed. Standard layout adjustments using Tailwind CSS classes.
- **Central State Management**: Passed. No state logic changes are required.
- **Test-Driven Assurance**: Passed. Manually tested across multiple viewport dimensions.
- **Clean Type Safety**: Passed. Verified no type modifications are needed.
- **Markdown Rendering & Persistence**: Passed. No impact on notes parsing or markdown display.

## Project Structure

### Documentation (this feature)

```text
specs/002-fix-note-list-scroll-bug/
├── plan.md              # This file
├── research.md          # Layout investigation and decision
├── data-model.md        # State/Data changes statement (None)
└── quickstart.md        # Visual verification scenarios
```

### Source Code (repository root)

We will modify and verify the following components:

```text
src/
└── components/
    └── sidebar/
        └── Sidebar.tsx  # Modify: Add min-h-0 class to ScrollArea element
```

**Structure Decision**: Single React web application sidebar layout fix.
