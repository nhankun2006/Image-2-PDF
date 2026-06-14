# 📄 Image-to-PDF Converter

> ⚠️ **Important Note for Developers:** This project is **not** built for web previews, running through Expo Go, or testing on mobile emulators. It utilizes custom native modules and is specifically set up to be lightweight, fast, and shipped as a production-ready application for **physical devices**.

A lightweight, offline-first mobile app built with React Native and Expo SDK 56. Select multiple images from your gallery or camera, reorder and rotate them, configure page settings, then generate a PDF—all processed 100% on-device with zero cloud uploads.

## ✨ Features

- **Multi-image selection** from gallery with ordered picking
- **Camera capture** for quick single-photo additions
- **Reorder & rotate** images before conversion
- **PDF configuration** — Page size (A4 / Letter / Fit Image), orientation, quality
- **Local PDF generation** via custom Java Native Module (high performance, fully offline)
- **Native share sheet** to save, send, or print the generated PDF
- **Dark/light adaptive theme** with a clean, minimal design

## 🛠 Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React Native 0.85 + [Expo SDK 56](https://docs.expo.dev/versions/v56.0.0/) |
| Routing | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based) |
| PDF engine | Custom Java Native Module (`modules/native-engine`) |
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
    └── imageHelpers.ts        # Gallery & camera picker wrappers
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

# 3.1 Compile the fully compatible/general release APK (support all cpu architectures, larger size, slower build)
cd android && ./gradlew assembleRelease

# 3.2 (NOTE: Android only) Compile optimized APK for arm64-v8a only (smaller size, faster build, native modern Anroids)
cd android && ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
```

The APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

NOTE: if the command 3.2 fails, pick the 3.1 version to build a universal APK that supports all architectures.

### When to Re-prebuild

| Change type | Command needed |
|-------------|----------------|
| JS/TS code only (editing `.tsx`, `.ts`) | `cd android && ./gradlew assembleRelease` |
| Native code (editing `.kt`, `.java`, `.cpp`) | `cd android && ./gradlew assembleRelease` (Do **not** run prebuild) |
| Added/removed an npm package | `npx expo prebuild --platform android --clean` then `cd android && ./gradlew assembleRelease` |
| Changed `app.json` (permissions, plugins) | `npx expo prebuild --platform android --clean` then `cd android && ./gradlew assembleRelease` |

### Install via ADB

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

## 👨‍💻 Development

Since this project relies on custom native modules, it **cannot** be run in the standard Expo Go app or web preview. It is highly recommended to test on a physical Android device.

To compile and run a debug build on a connected physical device:

```bash
npx expo run:android --device
```

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
