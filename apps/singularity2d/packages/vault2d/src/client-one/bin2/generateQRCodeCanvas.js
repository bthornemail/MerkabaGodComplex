let qrReaderCount = 0;
export default async function generateQRCodeCanvas(element, qrContent, imagePath, withCircle, showImage) {
    const canvasSize = 256;
    const canvas = document.createElement('canvas');
    canvas.id = `canvas-id-` + qrReaderCount++;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    // const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    element.innerHTML = "";
    element.append(canvas);

    const dialog = document.createElement('dialog');
    const dialogButton = document.createElement('button');
    dialogButton.classList.add(["btn", "btn-primary", "btn-lg"]);
    dialogButton.textContent = "Close"
    dialogButton.addEventListener("click", () => dialog.close())
    const reader = document.createElement('div');
    reader.id = canvas.id + "-reader";
    // reader.style.display = 'none';
    dialog.append(reader)
    dialog.append(dialogButton)
    element.append(dialog);
    // Generate QR code

    function onScanSuccess(decodedText, decodedResult) {
        alert(`QR Code detected: ${decodedText}`);
        generateQRCodeCanvas(element, qrContent, imagePath, withCircle, showImage);
        // handle the scanned code as you like, for example:
        console.log(`Code matched = ${decodedText}`, decodedResult);
        html5QrcodeScanner.clear()
    }

    function onScanFailure(error) {
        // handle scan failure, usually better to ignore and keep scanning.
        // for example:
        console.warn(`Code scan error = ${error}`);
    }
    function showScanner() {
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
        dialog.showModal()
    }
    let html5QrcodeScanner = new Html5QrcodeScanner(
        reader.id,
        { fps: 10, qrbox: { width: 256, height: 256 } },
        false);
    canvas.addEventListener("click", showScanner);
    if (!qrContent) {
        //sets immage to full canvas width
        if (imagePath) {
            const image = new Image();
            image.src = imagePath;
            image.onload = () => {
                const imageSize = Math.min(canvasSize / 1, image.width, image.height);
                const centerX = canvasSize / 2;
                const centerY = canvasSize / 2;
                // const radius = imageSize / 2 + 4;

                // // Draw circle around the image
                // ctx.beginPath();
                // ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                // ctx.strokeStyle = 'black';
                // ctx.fillStyle = 'white';
                // ctx.lineWidth = imageSize * 0.25;
                // ctx.stroke();
                // ctx.fill();

                // Draw the image at the center
                ctx.drawImage(image, centerX - imageSize / 2, centerY - imageSize / 2, imageSize, imageSize);
                return;
            };
        }
        // Load the main image
        return;
    }
    const qrOptions = {
        width: canvasSize,
        margin: 1,
        errorCorrectionLevel: "H",
    };
    QRCode.toDataURL(qrContent, qrOptions, async (err, qrDataURL) => {
        if (err) throw err;
        const qrImage = new Image();
        qrImage.src = qrDataURL;
        qrImage.onload = () => {
            // Draw QR code
            // if show image the dra wimage wbig with qr code in the corner
            if (imagePath && showImage) {
                const image = new Image();
                image.src = imagePath;
                image.onload = () => {
                    const imageSize = Math.min(canvasSize / 1, image.width, image.height);
                    const centerX = canvasSize / 2;
                    const centerY = canvasSize / 2;
                    ctx.drawImage(image, centerX - imageSize / 2, centerY - imageSize / 2, imageSize, imageSize);
                    ctx.drawImage(qrImage, 0, 0, canvasSize / 4, canvasSize / 4);
                    return;
                    };

                return;
            }
            ctx.drawImage(qrImage, 0, 0, canvasSize, canvasSize);
            if (imagePath) {
                // Load the main image
                const image = new Image();
                image.src = imagePath;
                image.onload = () => {
                    image.style.borderRadius = "50px";
                    const imageSize = Math.min(canvasSize / 4, image.width, image.height);

                    const centerX = canvasSize / 2;
                    const centerY = canvasSize / 2;
                    const radius = imageSize / 2 + 6;

                    ctx.beginPath();
                    if (withCircle) {
                        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                        ctx.fillStyle = 'white';
                        ctx.fill();
                    }

                    // Draw the image at the center
                    ctx.drawImage(image, centerX - imageSize / 2, centerY - imageSize / 2, imageSize, imageSize);

                    // Draw circle around the image
                    ctx.beginPath();
                    withCircle
                        ? ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
                        : ctx.rect(centerX - imageSize / 2, centerY - imageSize / 2, imageSize, imageSize);
                    ctx.strokeStyle = 'black';
                    ctx.fillStyle = 'white';
                    withCircle
                        ? ctx.lineWidth = 10//imageSize * 0.125;
                        : ctx.lineWidth = 8//imageSize * 0.125;

                    ctx.stroke();
                    // ctx.fill();
                };
            };
        }
    });

}
