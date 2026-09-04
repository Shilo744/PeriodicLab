# Google Play Asset Production Sheet

## Ready asset

- Play Store icon: `assets/store/play-icon.png` (512 × 512, 32-bit PNG with alpha, under 1 MB)
- Feature graphic: `assets/store/feature-graphic.jpg`
- Required upload size: 1024 × 500 px
- Format: JPEG, sRGB, no transparency
- Creative direction: an interactive atom, periodic-table context, spectra and reactions; no promotional text, ranking claims, device frame or store badge

## Phone screenshot set

Capture eight portrait screenshots at 1080 × 1920 px from the signed release build. Keep the first three focused on the actual UI because Google may feature them outside the full listing.

| Order | Screen and state | English overlay | Hebrew overlay | Alt text (English, ≤140 characters) |
|---|---|---|---|---|
| 1 | Home, daily challenge and progress visible | Learn chemistry by doing | לומדים כימיה דרך התנסות | Home screen with a daily science challenge, XP, streak and guided learning progress |
| 2 | Study, Carbon overview with interactive atom | Explore every atom | חוקרים כל אטום | Interactive Carbon model with atomic structure and key element properties |
| 3 | Atom Builder during a valid discovery | Build atoms. Make discoveries. | בונים אטומים ומגלים יסודות | Atom Builder with proton, neutron and electron controls used to discover an element |
| 4 | Daily challenge with four answer choices | A fresh challenge every day | אתגר חדש בכל יום | Daily recall challenge asking about the featured element with four answer choices |
| 5 | Quiz with an active streak | Turn knowledge into streaks | הופכים ידע לרצף הצלחות | Chemistry quiz showing answer choices, a learning streak and an XP multiplier |
| 6 | Periodic table with a useful category filter | All 118 elements, connected | כל 118 היסודות במקום אחד | Searchable periodic table with chemical-family colors and learning progress |
| 7 | Reaction Lab on a balanced equation | See why reactions balance | מבינים מדוע תגובות מתאזנות | Balanced chemical reaction with reactants, products and atom conservation details |
| 8 | Flashcards or comparison with mastered state | Remember what you learn | זוכרים את מה שלומדים | Chemistry flashcard practice with mastery tracking for focused review |

## Capture rules

- Use the current signed release, not Expo Go or a debug build.
- Hide emulator controls, notifications, developer overlays and personal information.
- Use realistic seeded progress so screens are understandable, but do not fabricate functionality.
- Keep overlay text under 20% of the image and localize every added overlay.
- Do not include “best,” “top,” “new,” ratings, testimonials, pricing or download claims.
- Export JPEG or 24-bit PNG without alpha; verify each file is sharp and correctly oriented.

## Upload checklist

- 512 × 512 Play icon, 32-bit PNG, maximum 1 MB — ready at `assets/store/play-icon.png`
- 1024 × 500 feature graphic
- At least four high-resolution phone screenshots for recommendation eligibility; this plan supplies eight
- English and Hebrew localized graphics uploaded to their matching store listings
- Alt text entered for every graphic

Official requirements: [Preview asset guidance](https://support.google.com/googleplay/android-developer/answer/9866151) and [store listing setup](https://support.google.com/googleplay/android-developer/answer/9859152).
