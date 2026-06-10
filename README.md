# 📄 Image-to-PDF Converter

A lightweight, offline-first mobile app built with React Native and Expo SDK 56. Select multiple images from your gallery or camera, reorder and rotate them, configure page settings, then generate a PDF—all processed 100% on-device with zero cloud uploads.

## ✨ Features

- **Multi-image selection** from gallery with ordered picking
- **Camera capture** for quick single-photo additions
- **Reorder & rotate** images before conversion
- **PDF configuration** — Page size (A4 / Letter / Fit Image), orientation, quality
- **Local PDF generation** via `pdf-lib` (pure JS, no native binary)
- **Native share sheet** to save, send, or print the generated PDF
- **Dark/light adaptive theme** with a clean, minimal design

## 🛠 Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React Native 0.85 + [Expo SDK 56](https://docs.expo.dev/versions/v56.0.0/) |
| Routing | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based) |
| PDF engine | [`pdf-lib`](https://pdf-lib.js.org/) (pure JS) |
| Image picking | `expo-image-picker` |
| File system | `expo-file-system` (SDK 56 `File`/`Paths` API) |
| Sharing | `expo-sharing` |
| Icons | `@expo/vector-icons` (Ionicons) |
| Styling | Native `StyleSheet` with design tokens in `src/constants/theme.ts` |

## 📁 Project Structure

```text
src/
├── app/
│   ├── _layout.tsx            # Root Stack navigator
│   └── index.tsx              # Home screen (image grid + settings + generate)
├── components/
│   ├── EmptyState.tsx         # Placeholder when no images selected
│   ├── ImageCard.tsx          # Image thumbnail with action buttons
│   ├── LoadingModal.tsx       # Animated progress overlay
│   ├── SettingsPanel.tsx      # PDF config (page size, orientation, quality)
│   └── themed-text.tsx        # Theme-aware Text component
├── constants/
│   └── theme.ts               # Single source of truth: Colors, Spacing, BorderRadius, Fonts
├── hooks/
│   ├── useImageList.ts        # Image state: add, remove, reorder, rotate
│   ├── usePdfGenerator.ts     # PDF generation orchestrator
│   └── use-theme.ts           # Returns current color palette
└── utils/
    ├── fileHelpers.ts         # Native share sheet wrapper
    ├── imageHelpers.ts        # Gallery & camera picker wrappers
    └── pdf.ts                 # pdf-lib PDF generation engine
```

## 🚀 How to Build for Android

### Prerequisites

1. **Node.js & npm** installed
2. **JDK 17+** (17 or later — required by Gradle 8.x used under the hood)
3. **Android SDK** (via Android Studio or command-line tools)
4. **`ANDROID_HOME`** environment variable configured:

```bash
# Add to your ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/android-sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin
```

### Build Steps for Android

```bash
# 1. Install dependencies
npm install

# 2. Generate the native Android project
npx expo prebuild --platform android --clean

# 3. Compile the release APK
cd android && ./gradlew assembleRelease
```

The APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### When to Re-prebuild

| Change type | Command needed |
|-------------|----------------|
| JS/TS code only (editing `.tsx`, `.ts`) | `cd android && ./gradlew assembleRelease` |
| Added/removed an npm package | `npx expo prebuild --platform android --clean` then `cd android && ./gradlew assembleRelease` |
| Changed `app.json` (permissions, plugins) | `npx expo prebuild --platform android --clean` then `cd android && ./gradlew assembleRelease` |

### Install via ADB

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

## 👨‍💻 Development

Run in development mode with hot reload:

```bash
npx expo start
```

Press `a` to open in an Android Emulator, or scan the QR code with the Expo Go app on your device.

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
