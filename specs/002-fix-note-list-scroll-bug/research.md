# Research: Sidebar Note List Scroll Bug

We investigated the cause of the non-scrollable note list in the sidebar and evaluated CSS layout fixes.

## Cause of the Bug
The sidebar container uses a flex column layout (`flex flex-col h-full overflow-hidden`).
Inside the sidebar, `<ScrollArea className="flex-1">` is expected to fill the remaining space.
However, in standard Flexbox, a flex item inside a flex column has an implicit `min-height: auto`. This means the flex item cannot shrink smaller than its contents (the entire long list of note cards). As a result, the `ScrollArea` expands to fit all note cards, overflowing the screen height, and the scrollbar never triggers because the container itself is overflowing rather than scrolling.

---

## Design Options

### Option 1: Apply `min-h-0` to the ScrollArea
Add the `min-h-0` utility class to the ScrollArea (`flex-1 min-h-0`).
- **How it works**: Setting `min-height: 0` overrides the default `min-height: auto` behavior in Flexbox, allowing the flex item to shrink and scroll its contents.
- **Pros**: standard CSS approach for flexbox children constraints. Very clean and semantic.
- **Cons**: None.

### Option 2: Apply `h-0` to the ScrollArea
Add the `h-0` utility class to the ScrollArea (`flex-1 h-0`).
- **How it works**: Setting `height: 0px` along with `flex-grow: 1` forces the browser to calculate the item's height solely based on flexbox allocation of remaining space.
- **Pros**: Widely compatible hack to force height constraints in flex containers.
- **Cons**: Can feel non-semantic.

### Option 3: Hardcoded Max Height
Set a hardcoded `max-h-[calc(100vh-200px)]` on the ScrollArea.
- **How it works**: Uses a hardcoded viewport-based calculation to restrict the height.
- **Pros**: Simple to write.
- **Cons**: Fragile. If header height, search bar size, or tag filters change, the calculation becomes incorrect, leading to double scrollbars or empty space at the bottom.

---

## Decision
We chose **Option 1 (`min-h-0` on `ScrollArea` in `Sidebar.tsx`)** as it is the most standard, semantic, and robust Flexbox solution. If needed, we will also verify if `h-0` provides better compatibility.
