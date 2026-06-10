import { NativeModule, requireNativeModule } from 'expo';

declare class NativeEngineModule extends NativeModule {
  generatePdf(imageUris: string[], pageSize: string, orientation: string, quality: string): Promise<string>;
  pickImages(): Promise<string[]>;
  takePhoto(): Promise<string[]>;
  sharePdf(pdfUri: string): Promise<void>;
}

export default requireNativeModule<NativeEngineModule>('NativeEngine');
