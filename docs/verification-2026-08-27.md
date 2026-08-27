# Verification: August 27, 2026

## Automated checks

- TypeScript: `npm run typecheck`.
- Node regression suite: `npm test`, including isolated tests of the real storage API.
- Production web export: `npm run build:web`.

## Browser smoke checks on the production export

- Flashcard self-assessment is disabled before revealing the answer.
- Noble gas review proceeds He → Ne → Ar → Kr without skipping cards.
- Completion appears after all four cards are marked memorized.
- Canceling reset leaves 4/4 memorized; confirming reset was not exercised in the browser.
- At 390×650, the revealed card and both review actions are reachable by scrolling.
- Self-assessment leaves home quiz XP at zero.
- `H2O` finds five reactions containing the equivalent subscript formula.
- Favoriting does not open the reaction; favorites survive a page reload.
- A random pick stays inside the combustion filter and moves to the top.
- An unmatched search shows an empty state and disables random selection.
- Atom-count rows display matching counts for inspected catalog reactions.
- Study restores Nitrogen (Z=7) after a reload.
- Comparison's previous-left control is disabled at Hydrogen (Z=1).
- No JavaScript errors were captured during these smoke checks.

The temporary static server was stopped after testing. The favicon request returned
404; it is not a JavaScript failure. Android hardware Back and native rendering were
not tested. Escape dismissal was not conclusively verified (the modal has an exit
animation). A scientific-content audit and dependency upgrades remain separate work.
