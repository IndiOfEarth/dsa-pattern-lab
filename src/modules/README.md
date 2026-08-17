# Adding a DSA module

Pattern Lab is one application. New topics should extend this repository rather than become standalone projects.

## Module workflow

1. Add the module metadata to `src/curriculum.ts` and mark it `available` when complete.
2. Create `src/modules/<module-id>/`.
3. Keep topic-specific lesson content and visualizers inside that folder.
4. Reuse shared components from `src/components/` for questions, coding challenges, hints and lesson sections.
5. Store section progress through `src/lib/progress.ts` using the module ID.
6. Register the module route in `src/App.tsx`.
7. Add mixed-diagnosis questions that include previously learned techniques; do not make the current topic always correct.
8. Run `npm run build` before merging.

## Expected module shape

```text
src/modules/two-pointers/
  TwoPointersModule.tsx
  TwoPointersVisualizer.tsx
  content.ts
```

The module should preserve the learning loop:

**Learn → Recognise → Predict → Code → Test → Explain → Mix**

A topic is not complete until its real lesson content, interactions, coding exercises, tests, hints, solutions, complexity reasoning and final mixed diagnosis exercise are implemented.
