

var qrcode = new QRCode(
    document.getElementById("qrcode"),
    {
        text: "hello",
        // colorDark,
        // colorLight
        // width
        // height
        // correctLevel: "H" // Q M L
    }
);
var qrcode = new QRCode(
    document.getElementById("user-qrcode"),
    {
        text: "hello",
        // colorDark,
        // colorLight
        width: 64,
        height: 64
        // correctLevel: "H" // Q M L
    }
);
function onScanSuccess(decodedText, decodedResult) {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
}

function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
}

let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: { width: 250, height: 250 } },
/* verbose= */ false);
// html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);

html5QrcodeScanner.render(onScanSuccess, onScanFailure);
