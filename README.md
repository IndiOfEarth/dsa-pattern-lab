# DSA Pattern Lab

A pattern-first, interactive DSA learning application built with React + TypeScript. The goal is to develop the mental process:

**Problem → clues → likely pattern/data structure → brute force → better approach → complexity → implementation**

This repository is the single source of truth for the full curriculum. New topics are added as modules to this application rather than created as separate apps.

## Current status

- **Arrays** — complete interactive module
- Strings — planned
- Hash Maps & Sets — planned
- Two Pointers — planned
- Sliding Window — planned
- Prefix Sums — planned
- Sorting — planned
- Binary Search — planned
- Stacks — planned
- Queues — planned
- Linked Lists — planned
- Recursion — planned
- Big-O — planned

The home dashboard exposes the entire essential curriculum and reads module progress from local storage.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Architecture

```text
src/
  components/                shared learning UI
    CodeChallenge.tsx
    CurriculumHome.tsx
    LessonSection.tsx
    MultipleChoiceQuestion.tsx
  lib/
    progress.ts              versioned module progress + legacy migration
  modules/
    arrays/
      ArraysModule.tsx
      ArrayVisualizer.tsx
      content.ts
    README.md                module authoring guide
  curriculum.ts              curriculum metadata / topic registry
  App.tsx                    lightweight hash router
  styles.css
  types.ts
```

### Why this structure

- **One application:** all DSA topics live together.
- **Reusable engine:** coding challenges, question interactions and lesson sections are shared.
- **Topic-specific visualizers:** specialised intuition tools stay inside each module.
- **Expandable curriculum:** adding a topic means adding a module and registering it, not rebuilding the product.
- **Durable browser progress:** module section progress is stored under a versioned key. The original Arrays progress key is migrated automatically so existing progress is not discarded by this refactor.
- **Editor preservation:** each coding challenge retains its existing localStorage-backed editor code.

## Coding sandbox

User TypeScript is transpiled in the browser with the TypeScript compiler and executed inside a short-lived Web Worker. Common network APIs are disabled and execution is terminated after 1.5 seconds. This is a lightweight local learning sandbox, not a production untrusted-code execution environment.

## Adding the next topic

See [`src/modules/README.md`](src/modules/README.md). A typical next module looks like:

```text
src/modules/two-pointers/
  TwoPointersModule.tsx
  TwoPointersVisualizer.tsx
  content.ts
```

Then register it in `src/curriculum.ts` and `src/App.tsx`.

## Git workflow

Use `main` as the stable branch. Add each topic on a feature branch, for example:

```bash
git switch -c feature/two-pointers
git add .
git commit -m "feat: add two pointers module"
git push -u origin feature/two-pointers
```

Merge through a pull request after the production build passes. This keeps every version recoverable as the learning application grows.
