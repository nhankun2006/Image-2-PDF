package expo.modules.nativeengine;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.pdf.PdfDocument;
import android.net.Uri;
import android.util.Log;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.List;

public class PdfProcessor {
    private static final String TAG = "PdfProcessor";

    public static String hello() {
        Log.d(TAG, "Hello from Pure Java!");
        return "Hello from Pure Java NativeEngine!";
    }

    public static String generatePdf(Context context, List<String> imageUris, String pageSize, String orientation, String quality) throws Exception {
        Log.d(TAG, "generatePdf called with " + imageUris.size() + " images");

        PdfDocument document = new PdfDocument();

        for (String uriString : imageUris) {
            Uri uri = Uri.parse(uriString);
            Bitmap bitmap = decodeBitmap(context, uri, quality);
            if (bitmap == null) continue;

            int imgW = bitmap.getWidth();
            int imgH = bitmap.getHeight();

            int[] pageDimens = resolvePageDimensions(pageSize, orientation, imgW, imgH);
            int pageW = pageDimens[0];
            int pageH = pageDimens[1];

            PdfDocument.PageInfo pageInfo = new PdfDocument.PageInfo.Builder(pageW, pageH, 1).create();
            PdfDocument.Page page = document.startPage(pageInfo);
            Canvas canvas = page.getCanvas();

            if ("FitImage".equals(pageSize)) {
                // If it's FitImage, the page is EXACTLY the image dimensions.
                canvas.drawBitmap(bitmap, 0, 0, null);
            } else {
                // Compute aspect ratio scaling and centering
                float scale = Math.min((float) pageW / imgW, (float) pageH / imgH);
                float drawW = imgW * scale;
                float drawH = imgH * scale;
                float x = (pageW - drawW) / 2f;
                float y = (pageH - drawH) / 2f;

                Matrix matrix = new Matrix();
                matrix.postScale(scale, scale);
                matrix.postTranslate(x, y);
                canvas.drawBitmap(bitmap, matrix, null);
            }

            document.finishPage(page);
            bitmap.recycle(); // Free memory immediately
        }

        // Save to cache dir
        File cacheDir = context.getCacheDir();
        File outFile = new File(cacheDir, "ImageToPDF_" + System.currentTimeMillis() + ".pdf");
        FileOutputStream fos = new FileOutputStream(outFile);
        document.writeTo(fos);
        document.close();
        fos.close();

        return outFile.toURI().toString();
    }

    private static Bitmap decodeBitmap(Context context, Uri uri, String quality) throws Exception {
        InputStream is = context.getContentResolver().openInputStream(uri);
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeStream(is, null, options);
        is.close();

        int maxDim;
        switch (quality) {
            case "Low": maxDim = 800; break;
            case "Medium": maxDim = 1500; break;
            case "High": default: maxDim = 2500; break;
        }

        int inSampleSize = 1;
        if (options.outHeight > maxDim || options.outWidth > maxDim) {
            int halfH = options.outHeight / 2;
            int halfW = options.outWidth / 2;
            while ((halfH / inSampleSize) >= maxDim && (halfW / inSampleSize) >= maxDim) {
                inSampleSize *= 2;
            }
        }

        options.inJustDecodeBounds = false;
        options.inSampleSize = inSampleSize;
        is = context.getContentResolver().openInputStream(uri);
        Bitmap bitmap = BitmapFactory.decodeStream(is, null, options);
        is.close();
        return bitmap;
    }

    private static int[] resolvePageDimensions(String pageSize, String orientation, int imgW, int imgH) {
        if ("FitImage".equals(pageSize)) {
            return new int[]{imgW, imgH};
        }

        int baseW, baseH;
        if ("Letter".equals(pageSize)) {
            baseW = 612;
            baseH = 792;
        } else {
            // Default A4
            baseW = 595;
            baseH = 842;
        }

        boolean isLandscape = "Landscape".equals(orientation);
        int pageW = isLandscape ? baseH : baseW;
        int pageH = isLandscape ? baseW : baseH;

        return new int[]{pageW, pageH};
    }
}
