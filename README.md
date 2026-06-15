# Note Space 🚀

**Note Space** is a premium, highly-interactive, local-first note-taking application built using React, TypeScript, and Vite. Designed to accommodate different workflows, the app offers three distinct styling modes—**Minimalist**, **Youthful**, and **Knowledge Management**—all backed by a robust state management layer and a comprehensive automated testing suite.

---

## 🌟 Core Features

### 1. Three Switchable Styling Modes
You can toggle between three custom-designed modes at the top right of the application:
- **Minimalist Mode**: A clean, distraction-free environment for pure writing.
  - *Focus Mode*: Collapses the sidebar to give you a full-width viewport.
  - *Metadata Info*: Bottom panel displaying character counts, word counts, and estimated reading time.
- **Fun & Youthful Mode**: A vibrant, playful theme with warm colors and bouncy animations.
  - *Sticker Emojis*: Pinned floating icons at the top of note headers.
  - *Canvas Sketchpad*: An HTML5 canvas to doodle or sketch directly on notes, automatically saved as image overlays.
  - *Custom Backgrounds*: Set the note page background to one of six beautiful pastel colors.
- **Knowledge Management Mode**: A structured dark academia/monospaced theme designed for linking thoughts.
  - *Wiki Links*: Double-bracket links (`[[Note Title]]`) that parse automatically into clickable navigation links (clicking a link to a non-existent note automatically creates it).
  - *Backlinks Panel*: Keeps track of all notes referencing the current note.

### 2. Automatic Tag System
Type any hashtag (e.g. `#work`, `#ideas`) inside your note body. The app will automatically extract, deduplicate, and catalog them in the sidebar's **Filter by Tag** selector.

### 3. Local-First & Offline Ready
Powered by a Zustand store with localStorage persistence. All note content, tags, custom color pages, doodles, stickers, and layout configurations are stored securely inside your browser's local cache. No database server needed.

---

## ⚙️ Technology Stack

- **Core**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 + Tailwind Typography (`prose`)
- **State Management**: Zustand (with Persist middleware)
- **UI Components**: Shadcn UI (Radix Primitives) + Lucide Icons
- **Markdown Render**: React Markdown
- **Testing**: Vitest + React Testing Library (JSDOM)

---

## 🛠️ Getting Started

### 1. Installation
Clone the repository, navigate into the directory, and install dependencies:
```bash
npm install
```

### 2. Run Development Server
Start the local server (usually at `http://localhost:5173/`):
```bash
npm run dev
```

### 3. Run Automated Tests
Execute the Vitest test suite checking store actions, utility helpers, and component mounts:
```bash
npm run test
```

### 4. Build for Production
Compile a production bundle optimized for speed:
```bash
npm run build
```

---

## 🔬 Test Suite Coverage
Note Space is built with test-driven stability. The codebase has **23 automated tests** covering:
- **Note Utilities (`src/lib/__tests__/note-utils.test.ts`)**: Unit tests for hashtag parsing, double-bracket wiki-link regex extraction, backlinks mapping, fallback title derivation, and content excerpt trimming.
- **Zustand Store (`src/store/__tests__/useNotesStore.test.ts`)**: Unit tests validating note creation, update reactivity, deletion transitions, sticker gimes, and theme switches.
- **UI Integration (`src/components/__tests__/App.test.tsx`)**: React Testing Library tests for app loading, empty states, click-to-create actions, and responsive layout theme switches.
