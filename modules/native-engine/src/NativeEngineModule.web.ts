import { registerWebModule, NativeModule } from 'expo';

class NativeEngineModule extends NativeModule<{}> {}

export default registerWebModule(NativeEngineModule, 'NativeEngineModule');
