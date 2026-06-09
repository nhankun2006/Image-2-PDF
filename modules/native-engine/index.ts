// Re-export the native module. On web, it will be resolved to NativeEngineModule.web.ts
// and on native platforms to NativeEngineModule.ts
export { default } from './src/NativeEngineModule';
