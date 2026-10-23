# MantenimientoIPF

App Expo / React Native (SDK 57) para reportar desperfectos del Instituto Politécnico Formosa. Spec: `ACTIVIDADES.md` Parte G.

## Árbol de `src/app`

```text
src/app/
  _layout.tsx
  (tabs)/
    _layout.tsx
    index.tsx          # / Reportes
    avisos.tsx         # /avisos
    permisos.tsx       # /permisos
  reporte/
    nuevo.tsx          # /reporte/nuevo
    escanear.tsx       # /reporte/escanear
    foto.tsx           # /reporte/foto
    ubicacion.tsx      # /reporte/ubicacion
    [id].tsx           # /reporte/[id]
  permisos/
    [recurso].tsx      # /permisos/[recurso] (modal)
  ajustes-app.tsx      # /ajustes-app
```

## `plugins` de `app.json` (comentado)

```json
"plugins": [
  "expo-router",
  ["expo-splash-screen", { "backgroundColor": "#208AEF", "image": "./assets/images/splash-icon.png", "imageWidth": 76 }],
  ["expo-camera", {
    "cameraPermission": "Usamos tu cámara para leer el QR del aula y fotografiar el desperfecto.",
    "microphonePermission": false,   // sin micrófono: no se graba audio
    "recordAudioAndroid": false      // sin RECORD_AUDIO en Android
  }],
  ["expo-location", {
    "locationWhenInUsePermission": "Usamos tu ubicación para marcar dónde está el problema.",
    "locationAlwaysAndWhenInUsePermission": false  // sin ubicación en segundo plano
  }],
  ["expo-image-picker", {
    "photosPermission": false       // sin permiso de galería: se usa el selector del sistema
  }],
  "expo-notifications"
]
```

`android.blockedPermissions`:
`RECORD_AUDIO`, `READ_EXTERNAL_STORAGE`, `READ_MEDIA_*`, `ACCESS_BACKGROUND_LOCATION`, `SYSTEM_ALERT_WINDOW`.
Justificación: esos permisos no corresponden a ninguna función de la app; se quitan del manifiesto generado para mínimo privilegio.

## Permisos

| Recurso | Módulo | Cuándo se pide | Alternativa si se deniega |
|---|---|---|---|
| Cámara | `expo-camera` | Al tocar escanear o sacar foto | Código de aula a mano / elegir foto de galería |
| Ubicación | `expo-location` | Al marcar ubicación | Elegir sector a mano |
| Notificaciones | `expo-notifications` | Al activar el interruptor en `/ajustes-app` | Bandeja `/avisos` dentro de la app |

La selección de fotos no pide permiso de galería; usa `ImagePicker.launchImageLibraryAsync`.

## Auditoría del manifiesto (`npx expo prebuild --clean`)

Permisos generados en `AndroidManifest.xml`:
- `CAMERA` (expo-camera)
- `ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION` (expo-location)
- `POST_NOTIFICATIONS` (expo-notifications)
- `INTERNET`, `VIBRATE` (base Expo)
- Removidos con `tools:node="remove"`: `RECORD_AUDIO`, `READ_EXTERNAL_STORAGE`, `READ_MEDIA_*`, `ACCESS_BACKGROUND_LOCATION`, `SYSTEM_ALERT_WINDOW`.

En iOS no se agregan claves de micrófono ni galería gracias a `microphonePermission: false` y `photosPermission: false`; solo `NSCameraUsageDescription` y `NSLocationWhenInUseUsageDescription`.

## Comandos

```bash
pnpm install
pnpm exec expo install expo-camera expo-location expo-image-picker expo-notifications
pnpm run lint
pnpm exec tsc --noEmit
pnpm exec expo prebuild --clean
pnpm exec expo run:android
```

## Capturas / video

Completar con capturas o video corto de: escáner en sus cuatro estados, ubicación concedida y denegada, foto desde el selector, notificación recibida y panel de permisos antes y después de volver de Ajustes, más el diálogo del sistema con el texto de propósito en una development build.