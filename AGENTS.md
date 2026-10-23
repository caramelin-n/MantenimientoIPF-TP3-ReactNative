# MantenimientoIPF

Expo / React Native app for TP3 (“Mantenimiento IPF”). The authoritative spec is `ACTIVIDADES.md` (especially Parte G); `RESPUESTAS.md` is completed theory work and should not be regenerated.

## Tooling
- Package manager: pnpm (`pnpm-lock.yaml`). Install with `pnpm install`; run scripts with `pnpm run …`.
- Expo tooling uses npx: `pnpm exec expo …`. Install dependencies only with `pnpm exec expo install <pkg>` (never `pnpm add`/`npm add`, so SDK versions resolve).
- Scripts: `pnpm start`, `pnpm run android`, `pnpm run ios`, `pnpm run web`, `pnpm run lint` (`expo lint`).
- Typecheck: `pnpm exec tsc --noEmit`. There is no test runner; do not add one.
- Verification order: `pnpm run lint` → `pnpm exec tsc --noEmit`.
- Expo SDK 57 (~57.0.31); use `https://docs.expo.dev/versions/v57.0.0/`, never API memory.

## Structure
- Expo Router: screens only in `src/app/` (`_layout.tsx` defines navigators); hooks/components/logic live in `src/hooks`, `src/components`, `src/lib`.
- Aliases: `@/*` → `./src/*`, `@/assets/*` → `./assets/*`.
- Strict TS; `typedRoutes` and `reactCompiler` are enabled in `app.json`.
- Continuous Native Generation: `ios/`/`android/` do not exist; configure native behavior in `app.json`/plugins. Inspect generated files with `pnpm exec expo prebuild --clean`.
- The starter template files were intentionally removed; do not restore them as “missing”.

## TP3 / permission constraints
- Required routes and fallbacks are in `ACTIVIDADES.md` Parte G1–G2.
- `expo-permissions` is forbidden; use each module’s own hooks (`expo-camera`, `expo-location`, `expo-image-picker`, `expo-notifications`) — install with `pnpm exec expo install`.
- Unified permission hook goes in `src/hooks/usePermiso.ts`; status states and AppState refresh are required.
- Minimum privilege in `app.json`: `expo-camera` `microphonePermission: false` and `recordAudioAndroid: false`; no `READ_MEDIA_*`; gallery selection uses the system picker (no permission).
- `blockedPermissions` only lists permissions the app does not use; justify each in `README.md`.
- Purpose strings follow “Usamos tu [dato] para [beneficio concreto]”.
- Notifications are requested only from the settings screen; create the Android channel `"reportes"` first; a denied permission must fall back to in-app `/avisos`.
- No denied permission may block creating a report.

## Platform quirks
- Permission dialogs/text purposes only appear in a development build (`pnpm exec expo run:android|ios` or an EAS development profile), not Expo Go.
- Reset a permission state without reinstalling via platform tools (`adb` / `xcrun simctl`) rather than reinstalls.
```
