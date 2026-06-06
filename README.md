# 📄 Image-To-PDF Converter

A completely local, offline-first mobile application built with React Native and Expo. This app allows users to seamlessly select multiple images from their gallery, reorder them, and convert them into a single, high-quality PDF file—all processed 100% on-device without any cloud uploading.

## 🛠 Tech Stack

- **Framework**: React Native with [Expo SDK 56](https://docs.expo.dev/)
- **Architecture**: [Expo Router](https://docs.expo.dev/router/introduction) (File-based routing)
- **PDF Generation**: [`pdf-lib`](https://pdf-lib.js.org/) (Pure JavaScript, entirely local execution to keep binary size small)
- **File Management**: `expo-file-system` and `expo-sharing`
- **Media**: `expo-image-picker` and `expo-image`
- **Styling**: Native StyleSheet & Vanilla CSS, using a predefined design token system for a modern, glass-morphism aesthetic.

## 🚀 How to Build for Android Locally

If you want to compile a production `.apk` file entirely on your own machine—without relying on Expo Go or the EAS Cloud—follow these steps.

### Prerequisites

Before starting, ensure your development environment is properly configured:
1. **Node.js & npm** installed.
2. **Java Development Kit (JDK)** installed (JDK 17 is recommended for React Native 0.85).
3. **Android SDK** installed (usually via Android Studio or command-line tools).
4. **Environment Variables Configured:** You **must** have `ANDROID_HOME` set in your terminal profile (e.g., `~/.bashrc` or `~/.zshrc`) so Gradle knows where your SDK is located.

```bash
# Add this to your ~/.bashrc
export ANDROID_HOME=$HOME/android-sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/emulator
```

### Build Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Generate the Native Android Folder:**
   Expo manages the native code dynamically. We need to generate the Android project files based on the Expo configuration.
   ```bash
   npx expo prebuild --platform android --clean
   ```

3. **Compile the APK with Gradle:**
   Navigate into the newly generated Android directory and trigger the release build. This will compile all C++/Java code and bundle the JavaScript.
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   *Note: The first build will take a few minutes as it downloads dependencies and compiles native React Native modules.*

4. **Locate the APK:**
   Once the build is successful, your deployable `.apk` file will be located at:
   ```text
   android/app/build/outputs/apk/release/app-release.apk
   ```

### 📱 Installing via ADB

If you have an Android device connected via USB (with USB Debugging enabled) or an active Emulator, you can install the generated APK directly from your terminal using the Android Debug Bridge (`adb`):

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

## 👨‍💻 Development

To run the app in development mode with Hot-Module Replacement (HMR):

```bash
npx expo start
```
You can press `a` to open in an Android Emulator, or scan the QR code using the Expo Go app on your physical device.
