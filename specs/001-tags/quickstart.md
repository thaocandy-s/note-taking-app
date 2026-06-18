# Quickstart Validation Guide: Note Tagging System

This guide provides step-by-step instructions to verify that the Tag Management and Filtering feature works as expected, both through manual steps and automated testing.

## Prerequisites
- Node.js installed.
- Dependencies installed (`npm install`).

---

## 🧪 Automated Verification

Run the test suite to execute unit and integration tests:
```bash
npm run test
```

We will create a test file `src/store/__tests__/tags.test.ts` to test:
- Assigning custom tags.
- Removing custom tags.
- Global rename cascading to notes.
- Global delete cascading to notes and resetting active filters.

---

## 🕹️ Manual Verification Scenario

Start the local development server:
```bash
npm run dev
```

### Scenario 1: Assign and Remove Tags in Editor
1. Select the note **🚀 Hướng Dẫn Sử Dụng NoteSpace** or create a new note.
2. In the note header, locate the tag management area (next to the date/tags metadata).
3. Click **Add Tag**, type `Tutorial` and press **Enter** or click **Add**.
4. Verify that:
   - A tag badge `Tutorial` appears in the header.
   - The tag appears under the "Filter by Tag" list in the sidebar.
5. Click the "x" on the `Tutorial` tag badge in the note header.
6. Verify that:
   - The badge is removed from the note header.
   - The tag disappears from the sidebar list (since no other notes use it).

### Scenario 2: Sidebar Tag Filtering
1. Create a note and assign the tag `Work`.
2. Create another note and assign the tag `Personal`.
3. In the sidebar under **Filter by Tag**, click `#work`.
4. Verify that:
   - The note list only displays the first note.
5. Click `#personal`.
6. Verify that:
   - The note list only displays the second note.
7. Click **All** or click `#personal` again to clear the filter.
8. Verify that:
   - Both notes are shown in the note list.

### Scenario 3: Global Tag Management Panel
1. Click the **Manage Tags** button (to be added near the tag filter section).
2. For tag `Work`, click **Rename**, change it to `Office`, and click save.
3. Verify that:
   - The tag badge on the first note changes to `Office`.
   - The sidebar tag filter list displays `#office` instead of `#work`.
4. For tag `Personal`, click **Delete**.
5. Verify that:
   - The tag is removed from the second note.
   - The tag disappears from the sidebar tag filter list.
