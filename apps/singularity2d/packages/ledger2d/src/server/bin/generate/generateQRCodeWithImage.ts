import { createWriteStream } from 'node:fs';
import { createCanvas, loadImage } from 'canvas';
import * as QRCode from 'qrcode';
export default async function generateQRCodeWithImage(imagePath: string, qrContent: string, outputFilePath: string): Promise<void> {
    const canvasSize = 256; // Adjust as needed
    const canvas = createCanvas(canvasSize, canvasSize);
    const ctx = canvas.getContext('2d');
    // Generate QR code
    const qrOptions: QRCode.QRCodeToDataURLOptions = {
        width: canvasSize,
        margin: 1,
        errorCorrectionLevel: "H",
        // color: {
        //     dark:"#133fd7",
        //     light:"#d7c613"
        // }
    };
    const qrDataURL = await QRCode.toDataURL(qrContent, qrOptions);
    const qrImage = await loadImage(qrDataURL);

    // Draw QR code
    ctx.drawImage(qrImage, 0, 0, canvasSize, canvasSize);
    ctx.globalAlpha = .75;


    // Load and draw the image at the center
    const image = await loadImage(imagePath);
    const imageSize = Math.min(canvasSize / 1.5, image.width, image.height); // Limit the image size
    const centerX = (canvasSize - imageSize) / 2;
    const centerY = (canvasSize - imageSize) / 2;
    ctx.drawImage(image, centerX, centerY, imageSize, imageSize);

    // Save the canvas to a file
    const out = createWriteStream(outputFilePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    return new Promise<void>((resolve, reject) => {
        out.on('finish', () => resolve());
        out.on('error', (err: any) => reject(err));
    });
}
