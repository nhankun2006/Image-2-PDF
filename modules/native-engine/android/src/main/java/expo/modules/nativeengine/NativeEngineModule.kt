package expo.modules.nativeengine

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class NativeEngineModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NativeEngine")

    AsyncFunction("generatePdf") { imageUris: List<String>, pageSize: String, orientation: String, quality: String ->
      val context = appContext.reactContext ?: throw Exception("React context is null")
      return@AsyncFunction PdfProcessor.generatePdf(context, imageUris, pageSize, orientation, quality)
    }
  }
}
