import { createWriteStream } from 'node:fs';
import { createCanvas, loadImage } from 'canvas';
import * as QRCode from 'qrcode';
export default async function generateQRCodeWithImageAndCircle(imagePath: string, qrContent: string, outputFilePath: string): Promise<void> {
    const canvasSize = 256; // Adjust as needed
    const canvas = createCanvas(canvasSize, canvasSize);
    const ctx = canvas.getContext('2d');

    // Generate QR code
    const qrOptions: QRCode.QRCodeToDataURLOptions = {
        width: canvasSize,
        margin: 1,
        errorCorrectionLevel: "H",

    };
    const qrDataURL = await QRCode.toDataURL(qrContent, qrOptions);
    const qrImage = await loadImage(qrDataURL);

    // Draw QR code
    ctx.drawImage(qrImage, 0, 0, canvasSize, canvasSize);

    const image = await loadImage(imagePath);
    // Draw circle around the image
    const imageSize = Math.min(canvasSize / 4, image.width, image.height); // Limit the image size
    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;
    const radius = imageSize / 2 + 4; // Adjust as needed
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'black'; // Change color as needed
    ctx.fillStyle = 'white'; // Change color as needed
    ctx.lineWidth = imageSize * .25; // Adjust thickness as needed
    ctx.stroke();
    ctx.fill();

    // Load and draw the image at the center
    ctx.drawImage(image, centerX - imageSize / 2, centerY - imageSize / 2, imageSize, imageSize);

    // Save the canvas to a file
    const out = createWriteStream(outputFilePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    return new Promise<void>((resolve, reject) => {
        out.on('finish', () => resolve());
        out.on('error', (err: any) => reject(err));
    });
}