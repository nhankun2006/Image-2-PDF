package expo.modules.nativeengine

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.provider.MediaStore
import androidx.core.content.FileProvider
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File

class NativeEngineModule : Module() {
  private var pendingPromise: Promise? = null
  private var cameraPhotoUri: Uri? = null

  override fun definition() = ModuleDefinition {
    Name("NativeEngine")

    AsyncFunction("generatePdf") { imageUris: List<String>, pageSize: String, orientation: String, quality: String ->
      val context = appContext.reactContext ?: throw Exception("React context is null")
      return@AsyncFunction PdfProcessor.generatePdf(context, imageUris, pageSize, orientation, quality)
    }

    AsyncFunction("pickImages") { promise: Promise ->
      val activity = appContext.currentActivity
      if (activity == null) {
        promise.reject("E_MISSING_ACTIVITY", "Current activity is null", null)
        return@AsyncFunction
      }
      pendingPromise = promise
      val intent = Intent(Intent.ACTION_GET_CONTENT).apply {
        type = "image/*"
        putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
      }
      activity.startActivityForResult(intent, 1001)
    }

    AsyncFunction("takePhoto") { promise: Promise ->
      val activity = appContext.currentActivity
      val context = appContext.reactContext
      if (activity == null || context == null) {
        promise.reject("E_MISSING_ACTIVITY", "Activity or Context is null", null)
        return@AsyncFunction
      }
      pendingPromise = promise
      val photoDir = File(context.cacheDir, "camera_photos")
      if (photoDir.exists()) {
        photoDir.listFiles()?.forEach { it.delete() }
      }
      photoDir.mkdirs()
      
      val photoFile = File(photoDir, "camera_photo_${System.currentTimeMillis()}.jpg")
      
      val authority = "${context.packageName}.NativeEngineFileProvider"
      cameraPhotoUri = FileProvider.getUriForFile(context, authority, photoFile)
      
      val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE).apply {
        putExtra(MediaStore.EXTRA_OUTPUT, cameraPhotoUri)
        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_WRITE_URI_PERMISSION)
      }
      activity.startActivityForResult(intent, 1002)
    }

    AsyncFunction("sharePdf") { pdfUriString: String, promise: Promise ->
      val activity = appContext.currentActivity
      val context = appContext.reactContext
      if (activity == null || context == null) {
        promise.reject("E_MISSING_ACTIVITY", "Current activity or context is null", null)
        return@AsyncFunction
      }

      try {
        val fileUri = Uri.parse(pdfUriString)
        val file = File(fileUri.path!!)
        
        val authority = "${context.packageName}.NativeEngineFileProvider"
        val contentUri = FileProvider.getUriForFile(context, authority, file)

        val intent = Intent(Intent.ACTION_SEND).apply {
          type = "application/pdf"
          putExtra(Intent.EXTRA_STREAM, contentUri)
          addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        
        val chooser = Intent.createChooser(intent, "Share PDF Document")
        activity.startActivity(chooser)
        promise.resolve(null)
      } catch (e: Exception) {
        promise.reject("E_SHARE_FAILED", "Failed to share PDF: ${e.message}", e)
      }
    }

    OnActivityResult { _, payload ->
      val promise = pendingPromise ?: return@OnActivityResult
      
      if (payload.requestCode == 1001) {
        pendingPromise = null
        if (payload.resultCode != Activity.RESULT_OK) {
          promise.resolve(emptyList<String>())
          return@OnActivityResult
        }
        val intent = payload.data
        val uris = mutableListOf<String>()
        if (intent?.clipData != null) {
          val clipData = intent.clipData!!
          for (i in 0 until clipData.itemCount) {
            uris.add(clipData.getItemAt(i).uri.toString())
          }
        } else if (intent?.data != null) {
          uris.add(intent.data!!.toString())
        }
        promise.resolve(uris)
      } 
      else if (payload.requestCode == 1002) {
        pendingPromise = null
        if (payload.resultCode != Activity.RESULT_OK) {
          promise.resolve(emptyList<String>())
          return@OnActivityResult
        }
        val photoUri = cameraPhotoUri?.toString()
        if (photoUri != null) {
          promise.resolve(listOf(photoUri))
        } else {
          promise.resolve(emptyList<String>())
        }
      }
    }
  }
}
