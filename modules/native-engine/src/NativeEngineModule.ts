import { NativeModule, requireNativeModule } from 'expo';

declare class NativeEngineModule extends NativeModule {
  generatePdf(imageUris: string[], pageSize: string, orientation: string, quality: string): Promise<string>;
}

export default requireNativeModule<NativeEngineModule>('NativeEngine');
