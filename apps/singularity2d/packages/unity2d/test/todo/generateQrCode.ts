import generateQRCodeWithImage from '../../bin/generate/generateQRCodeWithImage';
import generateQRCodeWithImageAndCircle from '../../bin/generate/generateQRCodeWithImageAndCircle';


// Example usage
const imagePath = './src/images/map-map-marker-svgrepo-com.svg'//'input.svg';
const qrContent = 'Your QR Code Content';
const outputFilePath = 'image.png';

generateQRCodeWithImage(imagePath, qrContent, "generateQRCodeWithImage.png")
    .then(() => console.log('QR code with image generated successfully'))
    .catch(err => console.error('Error generating QR code with image:', err));

generateQRCodeWithImageAndCircle(imagePath, qrContent, "generateQRCodeWithImageAndCircle.png")
    .then(() => console.log('QR code with image and circle generated successfully'))
    .catch(err => console.error('Error generating QR code with image and circle:', err));
