# Quickstart Validation Guide: Sidebar Scrolling

This guide explains how to verify that the sidebar note list scroll bug is fixed and scrolling operates correctly.

## Prerequisites
- Node.js installed.
- Dependencies installed (`npm install`).

---

## 🕹️ Manual Verification Scenario

Start the local development server:
```bash
npm run dev
```

Open `http://localhost:5173` on a desktop or mobile browser.

### Verification Steps
1. Create at least 15 new notes using the **New Note** button in the sidebar.
2. Verify that:
   - The total note cards exceed the screen height.
   - A scrollbar appears on the sidebar notes list.
   - You can scroll the notes list smoothly.
3. Verify that the **New Note** button, **Search Bar**, and **Tag Filter** remain fixed at the top of the sidebar.
4. Reduce the browser viewport height (make the window very short).
5. Verify that the layout remains stable:
   - The top panels stay fully visible.
   - The notes list continues to scroll.
   - No double scrollbars appear on the main page.
