# 📄 Image-to-PDF Converter

> ⚠️ **Important Note for Developers:** This project is **not** built for web previews, running through Expo Go, or testing on mobile emulators (Ex: Android Studio). It utilizes custom native modules and is specifically set up to be lightweight and shipped as a production-ready application for **physical devices**.

A lightweight, offline-first mobile app built with React Native, Expo SDK 56, and native Android SDK. Generate PDFs—all processed 100% on-device with zero cloud uploads.

## ✨ Features

- **Multi-image selection**
- **Camera capture**
- **Reorder & rotate**
- **PDF output configuration**
- **Local PDF generation**
- **Native share sheet** - to save, send, or print the generated PDF
- **Dark/light adaptive theme**

## 🛠 Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React Native 0.85 + [Expo SDK 56](https://docs.expo.dev/versions/v56.0.0/) |
| Routing | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based) |
| Native Core | Custom Java Native Module (`modules/native-engines`) handling PDF, Images, I/O & Sharing |
| Icons | `@expo/vector-icons` (Ionicons) |
| Styling | Native `StyleSheet` with design tokens in `src/constants/theme.ts` |

## 📁 Project Structure

```text
modules/native-engines/        # Custom native engine modules
├── android/                   # Android-specific (Java/Kotlin) native source & Gradle config
├── ios/                       # Later: Swift/Obj-C source for iOS (currently not implemented)
└── src/                       # React Native Expo brigde to help exporting native modules

src/
├── app/                       # Root navigation and Home screens (Expo Router)
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
└── utils/                     # Wrapper functions for native module calls, file handling, etc.
```


## 🚀 How to Build for Android

### Prerequisites

1. **Node.js & npm**
2. **JDK 17+**
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

To compile and run a debug build on a connected physical device:

```bash
npx expo run:android --device
```

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
