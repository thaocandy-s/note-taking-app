# Research: Note Tagging and Filtering Implementations

For the Tag Management feature in `note-space`, we evaluated different approaches to balance the existing hashtag auto-extraction with the new requirement for manual tag management (creating, assigning, renaming, and deleting tags globally).

## Design Options

### Option 1: Pure Markdown-Native (Content-Attached Tags)
Unify manual tags with the existing hashtag extraction system.
- **How it works**: Adding a tag via the UI appends `#tagname` to the end of the note content. Removing a tag removes the `#tagname` substring. Renaming/deleting globally performs a search-and-replace on all notes' content.
- **Pros**: Matches the Obsidian/Wiki-style knowledge management ethos; tags are fully portable within the raw Markdown file. No changes required to the `Note` database structure.
- **Cons**: UI-based edits alter the user's raw text content directly, which can feel intrusive or clutter the notes with a list of hashtags at the bottom.

### Option 2: Separate UI-Managed Tag State (Recommended)
Decouple manual tag assignments from markdown hashtags, storing them in a dedicated property.
- **How it works**: Add a `customTags: string[]` field to the `Note` object. Provide a global tag dictionary if needed, or compute the global list by merging auto-extracted hashtags and custom tags.
- **Pros**: Clean separation. Users can add tags through the UI without modifying their text files.
- **Cons**: Requires managing two separate sources of tags (hashtags in text vs. custom tags in metadata).

### Option 3: Standard Database Field (Unified Metadata)
Turn `tags: string[]` into a metadata-only field.
- **How it works**: The `tags` array stores all tags assigned to the note. Auto-extraction of hashtags is run on save, and any new hashtags are appended to the metadata `tags` array. The user can also add tags manually to the metadata `tags` array. Global rename/delete just updates the metadata arrays.
- **Pros**: Simplifies rendering and querying. One single array represents all tags.
- **Cons**: If a tag was auto-extracted from text, deleting it from metadata won't remove the `#tagname` text from the markdown. If the note is edited again, the hashtag will be re-extracted.

---

## Decision

We chose **Option 2 (Separate UI-Managed Tag State)** with a unified rendering layer:
1. We will add a `customTags: string[]` array to the `Note` interface.
2. The UI will render badges for both auto-extracted `tags` (hashtags) and `customTags`.
3. In the sidebar and tag filter, we will list all unique tags from both sources.
4. Manually added tags (custom tags) can be deleted or renamed globally. When renaming a custom tag globally, we rename it in the `customTags` array of all notes. When deleting globally, we remove it from all `customTags` arrays.
5. This respects the user's markdown files (no automated text injections) while providing a robust tag management system.
