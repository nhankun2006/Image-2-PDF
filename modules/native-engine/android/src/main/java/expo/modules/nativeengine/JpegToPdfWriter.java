package expo.modules.nativeengine;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class JpegToPdfWriter {
    private OutputStream out;
    private long currentOffset = 0;
    private List<Long> xrefs = new ArrayList<>();
    private int objectCounter = 0;

    public static void generatePdf(Context context, List<String> imageUris, String pageSize, String orientation, File outFile, PdfProcessor.ProgressCallback progressCallback) throws Exception {
        JpegToPdfWriter writer = new JpegToPdfWriter();
        writer.createPdf(context, imageUris, pageSize, orientation, outFile, progressCallback);
    }

    private void writeString(String str) throws Exception {
        byte[] b = str.getBytes("US-ASCII");
        out.write(b);
        currentOffset += b.length;
    }

    private void writeBytes(byte[] b, int len) throws Exception {
        out.write(b, 0, len);
        currentOffset += len;
    }

    private int nextObj() {
        xrefs.add(currentOffset);
        return ++objectCounter;
    }

    private void createPdf(Context context, List<String> imageUris, String pageSize, String orientation, File outFile, PdfProcessor.ProgressCallback progressCallback) throws Exception {
        FileOutputStream fos = new FileOutputStream(outFile);
        this.out = fos;
        this.currentOffset = 0;
        this.xrefs = new ArrayList<>();
        // 0 object is dummy
        this.xrefs.add(0L);
        this.objectCounter = 0;

        writeString("%PDF-1.4\n%\u00E2\u00E3\u00CF\u00D3\n");

        int catalogObj = objectCounter + 1;
        int pagesObj = objectCounter + 2;

        List<Integer> pageObjects = new ArrayList<>();

        // Reserve offsets for Catalog (1) and Pages (2)
        nextObj(); // 1
        nextObj(); // 2

        int total = imageUris.size();
        int current = 0;

        for (String uriString : imageUris) {
            Uri uri = Uri.parse(uriString);
            
            // Get exact dimensions without fully decoding
            InputStream is = context.getContentResolver().openInputStream(uri);
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inJustDecodeBounds = true;
            BitmapFactory.decodeStream(is, null, options);
            is.close();
            
            int imgW = options.outWidth;
            int imgH = options.outHeight;
            if (imgW <= 0 || imgH <= 0) continue;

            int[] dimens = resolvePageDimensions(pageSize, orientation, imgW, imgH);
            int pageW = dimens[0];
            int pageH = dimens[1];

            // Image XObject
            int imageObj = nextObj();
            writeString(imageObj + " 0 obj\n");
            writeString("<< /Type /XObject /Subtype /Image /Width " + imgW + " /Height " + imgH + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ");
            
            // Check magic bytes for JPEG
            is = context.getContentResolver().openInputStream(uri);
            byte[] header = new byte[2];
            is.read(header, 0, 2);
            boolean isJpeg = (header[0] == (byte)0xFF && header[1] == (byte)0xD8);
            is.close();

            byte[] jpegBytes;
            if (isJpeg) {
                is = context.getContentResolver().openInputStream(uri);
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                byte[] buf = new byte[8192];
                int read;
                while ((read = is.read(buf)) != -1) baos.write(buf, 0, read);
                is.close();
                jpegBytes = baos.toByteArray();
            } else {
                // If it's a PNG/WebP, convert to JPEG in-memory
                is = context.getContentResolver().openInputStream(uri);
                Bitmap bmp = BitmapFactory.decodeStream(is);
                is.close();
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                bmp.compress(Bitmap.CompressFormat.JPEG, 90, baos);
                jpegBytes = baos.toByteArray();
                bmp.recycle();
            }
            
            writeString(jpegBytes.length + " >>\nstream\n");
            writeBytes(jpegBytes, jpegBytes.length);
            writeString("\nendstream\nendobj\n");

            // Compute scaling
            float scale = Math.min((float) pageW / imgW, (float) pageH / imgH);
            float drawW = imgW * scale;
            float drawH = imgH * scale;
            float x = (pageW - drawW) / 2f;
            float y = (pageH - drawH) / 2f;

            // Contents (MUST use Locale.US for periods instead of commas)
            int contentsObj = nextObj();
            String content = String.format(Locale.US, "q %f 0 0 %f %f %f cm /I1 Do Q", drawW, drawH, x, y);
            byte[] contentBytes = content.getBytes("US-ASCII");
            writeString(contentsObj + " 0 obj\n");
            writeString("<< /Length " + contentBytes.length + " >>\nstream\n");
            writeBytes(contentBytes, contentBytes.length);
            writeString("\nendstream\nendobj\n");

            // Page
            int pageObj = nextObj();
            pageObjects.add(pageObj);
            writeString(pageObj + " 0 obj\n");
            writeString("<< /Type /Page /Parent " + pagesObj + " 0 R /MediaBox [0 0 " + pageW + " " + pageH + "] /Resources << /XObject << /I1 " + imageObj + " 0 R >> >> /Contents " + contentsObj + " 0 R >>\nendobj\n");

            current++;
            if (progressCallback != null) {
                progressCallback.onProgress(current, total);
            }
        }

        // Now inject Catalog offset
        long catOffset = currentOffset;
        xrefs.set(1, catOffset);
        writeString("1 0 obj\n<< /Type /Catalog /Pages " + pagesObj + " 0 R >>\nendobj\n");

        // Now inject Pages offset
        long pagesOffset = currentOffset;
        xrefs.set(2, pagesOffset);
        writeString("2 0 obj\n<< /Type /Pages /Count " + pageObjects.size() + " /Kids [");
        for (int p : pageObjects) {
            writeString(p + " 0 R ");
        }
        writeString("] >>\nendobj\n");

        // XRef Table
        long startXref = currentOffset;
        writeString("xref\n0 " + (objectCounter + 1) + "\n");
        writeString("0000000000 65535 f \n");
        for (int i = 1; i <= objectCounter; i++) {
            writeString(String.format(Locale.US, "%010d 00000 n \n", xrefs.get(i)));
        }

        // Trailer
        writeString("trailer\n<< /Size " + (objectCounter + 1) + " /Root 1 0 R >>\nstartxref\n" + startXref + "\n%%EOF\n");

        fos.close();
    }

    private int[] resolvePageDimensions(String pageSize, String orientation, int imgW, int imgH) {
        if ("FitImage".equals(pageSize)) {
            return new int[]{imgW, imgH};
        }
        int baseW = "Letter".equals(pageSize) ? 612 : 595;
        int baseH = "Letter".equals(pageSize) ? 792 : 842;
        boolean isLandscape = "Landscape".equals(orientation);
        return new int[]{isLandscape ? baseH : baseW, isLandscape ? baseW : baseH};
    }
}
