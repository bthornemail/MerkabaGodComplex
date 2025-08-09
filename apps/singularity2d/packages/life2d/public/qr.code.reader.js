
export default function html5QrCodeReader(ParentElement) {
	const div = document.createElement("div")

	const html5QrCodeReader = document.createElement("input")
	html5QrCodeReader.id = "reader";
	html5QrCodeReader.width = "600px";
	html5QrCodeReader.hidden = "hidden";

	const qrCodeUpload = document.createElement("input")
	qrCodeUpload.id = "qr-input-file";
	qrCodeUpload.type = "file";
	qrCodeUpload.accept = "image/*";

	div.appendChild(html5QrCodeReader)
	div.appendChild(qrCodeUpload)
	ParentElement.replaceChildren(div)

	// document.addEventListener("DOMContentLoaded", function (event) {
		// File input scanning
		const html5QrCode = new Html5Qrcode("reader");

		qrCodeUpload.addEventListener('change', e => {
			if (e.target.files.length == 0) {
				// No file selected, ignore 
				return;
			}

			const imageFile = e.target.files[0];
			// Scan QR Code
			html5QrCode.scanFile(imageFile, true)
				.then(decodedText => {
					// success, use decodedText
					console.log(imageFile)
					alert(decodedText);
				})
				.catch(err => {
					// failure, handle it.
					alert(`Error scanning file. Reason: ${err}`)
				});
		});
	// });
}