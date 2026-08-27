# PeriodicLab

An Expo / React Native learning app with a periodic table, atom builder, quizzes,
practice flashcards, comparison tools, and a chemical reaction reference.

## Local development

Use Node 22 and the committed package lock:

```sh
npm ci
npm run web -- --port 8081
```

Stop the development server with **Ctrl+C**. Nothing is deployed by this command.
The Android source is also present; `npm run android` requires an Android SDK.

## Verification

```sh
npm run check
npm run build:web
```

`check` runs TypeScript and Node regression tests. The test-only loader compiles
TypeScript with the existing TypeScript dependency; it is not part of the app.
`build:web` exports static assets into the ignored `dist` directory without
starting a server or publishing the site.

Tests cover catalog identity, formula parsing/conservation, formula search,
shuffle/navigation behavior, preference write races, damaged saved data,
storage fallback, and local-calendar streak boundaries.

## Smoke-test checklist

- Open Flashcards: reveal is required before self-assessment; it grants no quiz XP.
- Mark a card memorized in unmastered-only mode: the next card must not be skipped.
- Finish a small filtered deck: completion should replace the empty review deck.
- Cancel a reset: mastery should remain unchanged. Confirm resets practice only.
- At a narrow/short viewport, scroll to both flashcard action buttons.
- In Reaction Lab, search `H2O`: it must find equations containing `H₂O`.
- Favorite a reaction without opening it. Favorites must survive a reload.
- Use random selection with a filter: the selected reaction must match the filter
  and appear at the top. With no matches, random selection is disabled.
- Inspect a reaction's atom-count rows; each side should have matching totals.
- Close comparison and builder modals using Android Back (or Escape on web).
- Reload while viewing Study: the selected module and element should return.

## Scope and limitations

Flashcards are self-assessed practice for the first 36 elements, not scheduled
spaced repetition. Mastery reset does not change quiz/discovery XP. Reaction Lab
is a reference, not a physical simulation or instructions for experiments; it
does not award the catalog's proposed XP rewards.

The formula checker supports simple uncharged formulas in the current catalog.
Parenthesized groups, hydrates, and charge balance are not implemented and are
not silently accepted. Atom conservation alone does not verify thermodynamics,
reaction conditions, or all scientific claims in the data. Some scientific
properties and isotope models remain incomplete or simplified.

Progress is stored locally. During storage failures an in-memory fallback is
used, which cannot survive closing the app. Existing storage keys are preserved.
Expo dependency compatibility warnings remain a separate maintenance task;
passing type checks and web export does not establish Android compatibility.
