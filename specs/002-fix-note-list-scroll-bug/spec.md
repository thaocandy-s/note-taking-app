# Feature Specification: Fix Sidebar Note List Scrolling

**Feature Branch**: `002-fix-note-list-scroll-bug`

**Created**: 2026-06-18

**Status**: Draft

**Input**: User description: "Tạo đặc tả sửa bug không thể cuộn trên danh sách ghi chú (sidebar) cho dự án note-space."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Smooth Scrolling of Note List (Priority: P1)

When the note list exceeds the vertical space of the sidebar, the user can scroll through the notes list while keeping the top action panels fixed.

**Why this priority**: Crucial for usability when the number of notes is larger than what fits in a single screen height.

**Independent Test**: Can be fully tested by creating 10+ notes on a standard screen, attempting to scroll down to the bottom notes using the trackpad/mouse, and verifying that they scroll within the sidebar and the "New Note" button and Search/Filter panels stay pinned at the top.

**Acceptance Scenarios**:

1. **Given** the note list has more notes than can fit on the screen, **When** the user scrolls vertically inside the sidebar, **Then** only the note card cards scroll, and the "New Note" button, Search Bar, and Tag Filter remain fixed at the top.
2. **Given** the note list is scrolled to the middle, **When** the user clicks "New Note", **Then** the note list scrolls to the top or the new note appears at the top, visible immediately.
3. **Given** the user is on a mobile device, **When** the mobile sidebar is toggled open, **Then** the note list within the mobile drawer is scrollable via swipe guestures without scrolling the body page underneath.

---

### Edge Cases

- **Small Viewport Heights**: On very short screens (e.g. mobile landscape or small laptops), the ScrollArea must shrink accordingly and remain scrollable without pushing the sidebar contents out of the bottom of the screen.
- **Empty State**: When there are no notes or search results, the empty state text "No matching notes found" should be centered in the remaining height and not scroll.
- **Scrollbar Styling**: The scrollbar must be styled using the thin scrollbar styling and match the styleMode:
  - Minimalist: subtle grey scrollbar.
  - Youthful: cute rounded pink or primary colored scrollbar track.
  - Knowledge: retro monospaced style scrollbar with no rounded corners.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The sidebar root container MUST have a fixed height of `100vh` and set `overflow: hidden`.
- **FR-002**: The note cards list MUST be wrapped in a scroll container (`ScrollArea`) that dynamically occupies the remaining height of the sidebar.
- **FR-003**: The "New Note" button, Search Bar, and Tag Filter sections MUST NOT scroll; they must remain fixed at the top.
- **FR-004**: The body of the page (editor area) MUST NOT scroll when the note list is scrolled.
- **FR-005**: The scrollbar MUST be styled customly via Radix UI ScrollArea scrollbar component or CSS rules to look premium and avoid default browser scrollbar overlays.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Sidebar container height is exactly constrained to the viewport height (`100%` of window/viewport height).
- **SC-002**: Top sections remain 100% visible (no scrolling out of bounds).
- **SC-003**: Scrolling inside the notes list runs smoothly at 60fps.
- **SC-004**: Mobile sidebar drawer behaves correctly with nested touch scrolling.

## Assumptions

- **Flexbox Layout**: The sidebar uses a vertical Flexbox layout (`flex flex-col h-full overflow-hidden`).
- **Radix UI ScrollArea**: The `ScrollArea` component in `src/components/ui/scroll-area.tsx` is used and properly configured with a height constraint.
