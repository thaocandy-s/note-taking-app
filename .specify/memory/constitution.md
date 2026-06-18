<!--
Sync Impact Report:
- Version change: N/A -> v1.0.0
- List of modified principles:
  - PRINCIPLE_1: Component-Driven UI
  - PRINCIPLE_2: Central State Management
  - PRINCIPLE_3: Test-Driven Assurance
  - PRINCIPLE_4: Clean Type Safety
  - PRINCIPLE_5: Markdown Rendering & Persistence
- Added sections: Core Principles, Additional Constraints, Development Workflow, Governance
- Removed sections: None
- Templates requiring updates (✅ updated / ⚠️ pending):
  - .specify/templates/plan-template.md (✅ updated)
  - .specify/templates/spec-template.md (✅ updated)
  - .specify/templates/tasks-template.md (✅ updated)
- Follow-up TODOs: None
-->

# note-space Constitution

## Core Principles

### I. Component-Driven UI
Develop the user interface using React 19, TypeScript, and Tailwind CSS v4. Interface components should be modular, reusable, accessible, and visually elegant.

### II. Central State Management
Use Zustand stores to manage global and page-level application state. Avoid deep prop drilling; components should access store states and actions directly, maintaining clear separation between presentation logic and state logic.

### III. Test-Driven Assurance
Write comprehensive unit and component tests using Vitest and React Testing Library. All code modifications should be validated against existing and new tests to prevent regressions.

### IV. Clean Type Safety
Maintain strict TypeScript guidelines across the codebase. Avoid using the 'any' type; define interfaces and types for all data structures, store states, and component properties.

### V. Markdown Rendering & Persistence
Notes are saved as Markdown format and rendered dynamically. Ensure markdown extensions, typography, and syntax highlighting remain consistent, robust, and functional.

## Additional Constraints
The application must perform well with fast page loads. Ensure clean UI/UX with curated color palettes, elegant typography (e.g. Outfit/Inter), responsive layouts for both mobile and desktop screens, and smooth interactive transitions.

## Development Workflow
Follow the Spec-Driven Development (SDD) process:
1. **Specify**: Define the "what" and "why" of the feature in a specification document.
2. **Plan**: Design the technical architecture and data schemas.
3. **Tasks**: Breakdown the plan into sequential, actionable tasks.
4. **Implement**: Implement code step-by-step following tasks.
5. **Converge**: Perform final validations and run tests.

## Governance
All changes to this constitution must increment the version number. Ensure all pull requests and code modifications comply with the established principles.

**Version**: 1.0.0 | **Ratified**: 2026-06-18 | **Last Amended**: 2026-06-18
