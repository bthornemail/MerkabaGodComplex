import { ethers, Wallet } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
const wallet = new Wallet("0xf0d2107407e615557422da7fbf09d4a4dd0405c62fcbc19358604a64081f8a7e")
const address = wallet.address;

// const innerHTML = `
// <div className="card">
// 	<p>id: ${id}</p>
// 	<p>content_html: ${content_html}</p>
// 	<p>url: ${url}</p>
// 	<p>title: ${title}</p>
// 	<p>summary: ${summary}</p>
// 	<p>image: ${image}</p>
// 	<p>date_modified: ${date_modified}</p>
// 	<div className="card">
// 		<p>author: ${author}</p>
// 		<p>name: ${name}</p>
// 		<p>authorUrl: ${authorUrl}</p>
// 	</div>
// </div>`
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
html5QrcodeScanner.render(onScanSuccess, onScanFailure);

