# Google Play Release Handoff

## Technical release state

- Package name: `com.periodiclab.app` — confirm this permanent identifier before the first Play upload.
- Version: `1.0.0` (`versionCode` 1).
- Target SDK: 36.
- Minimum SDK: 24.
- Release artifact: `android/app/build/outputs/bundle/release/app-release.aab`.
- Upload key and `android/keystore.properties` are local-only and ignored by Git. Back both up securely; losing the upload key complicates future updates.
- Release manifest removes storage and system-overlay permissions. The remaining app permissions are Internet and Vibration.

## Play Console declarations

- Ads: No.
- App access: All functionality is available without sign-in.
- Data safety: No user data collected or shared, based on the current code and dependencies. Re-audit before adding analytics, crash reporting, accounts, ads, cloud sync, or external APIs.
- Content rating: complete the IARC questionnaire truthfully as an educational app.
- Target audience: confirm intended age group. If children are included, complete Families requirements and host/link the privacy policy both in Play Console and in-app.
- Privacy policy: replace the contact placeholder, publish `docs/privacy-policy.md` at a stable HTTPS URL, and enter that URL in Play Console.

## Account-owned launch gates

- Confirm developer identity and real-device verification.
- If this is a personal developer account created after November 13, 2023, run a closed test with at least 12 opted-in testers continuously for 14 days before applying for production access.
- Create the app in Play Console with the confirmed package name, enable Play App Signing, upload the AAB, complete declarations, add store graphics/screenshots, and submit the appropriate testing track.
- Install the Play-delivered build on at least one low-end and one modern Android device; verify cold start, RTL/Hebrew, offline use, daily quest rollover, progress persistence, and process restoration.

## Growth validation after launch

Track store conversion, day-1/day-7 retention, daily-quest completion, quiz completion, and shares. The current app deliberately ships without analytics; add privacy-respecting measurement only with an updated privacy policy and Data safety declaration.
