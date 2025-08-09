import { HDNodeWallet } from "ethers";
import Graphology from 'graphology';

// const _host = ethers.HDNodeWallet.createRandom("", "m/0");
// const _user = ethers.HDNodeWallet.fromPhrase("roast thank tiny coach seat ensure cruel auto shaft finish fee resemble");

// const graphView = document.getElementById('graph') as HTMLDivElement;

const openGraphViewFormInput = document.querySelector("#open-graph-view-form-input") as HTMLInputElement;
const openGraphViewFormQtyButton = document.querySelector("#open-graph-view-form-qty-button") as HTMLButtonElement;
const logsElement = document.getElementById('logs') as HTMLPreElement;

export function logger(message: string) {
	console.log(message);
	const li = document.createElement("li");
	li.textContent = message;
	openGraphViewFormInput.value = JSON.stringify(message);
	li.classList.add("list-group-item");
	logsElement.append(li);
	openGraphViewFormQtyButton.textContent = logsElement.childElementCount.toFixed(0)
}
export async function getData(url: string) {
	try {
		const response = await fetch(url, {
			headers: {
				"Content-Type": "text/plain",
			}
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const json = await response.text();
		//   console.log(json);
		return json;
		//   const json = await response.json();
		//   console.log(json);
		//   return json;
	} catch (error: any) {
		console.error(error.message);
	}
}
window.addEventListener("DOMContentLoaded", async () => {
	let clientID = HDNodeWallet.createRandom().extendedKey;
	const socket = new WebSocket("ws://localhost:30000", [
		"protocolOne",
		"protocolTwo",
	]);
	socket.onopen = () => {
		console.log("Connected to WebSocket");
		socket.send(JSON.stringify({ type: "webauthn-register", challenges: [12312] }))
	};
	socket.onmessage = (event) => {
		// const data = JSON.parse(event.data.toString());
		// switch (data.type) {
		// 	case "webauthn-options":
		// 		const options = data.options;
		// 		socket.send(JSON.stringify({type:"webauthn-register",options}))
		// 		break;

		// 	default:
		// 		break;
		// }
		// socket.close()
		// const f = (document.getElementById("chat-box") as any).contentWindow;
		let text = "";
		const msg = JSON.parse(event.data);
		const time = new Date(msg.date);
		const timeStr = time.toLocaleTimeString();

		switch (msg.type) {
			case "id":
				clientID = msg.id;
				// setUsername();
				break;
			case "username":
				text = `User <em>${msg.name}</em> signed in at ${timeStr}<br>`;
				break;
			case "message":
				text = `(${timeStr}) ${msg.name} : ${msg.text} <br>`;
				break;
			case "reject-username":
				text = `Your username has been set to <em>${msg.name}</em> because the name you chose is in use.<br>`;
				break;
			case "user-list":
				(document.getElementById("user-list-box") as HTMLDivElement).innerText = msg.users.join("\n");
				break;
		}

		if (text.length) {
			// f.write(text);
			(document.getElementById("chat-box") as any).contentWindow.scrollByPages(1);
		}
	};
	socket.onerror = (err) => console.error("WebSocket Error:", err);

	(async () => {
		const chatForm = document.createElement("form");
		chatForm.classList.add("form", "container", "input-group");
		(document.getElementById("chat-container") as HTMLDivElement).append(chatForm);
		const messgeInput = document.createElement("input");
		messgeInput.placeholder = "Message";
		messgeInput.classList.add("form-control")
		chatForm.append(messgeInput);
		const button = document.createElement("button");
		button.innerText = "Send"
		chatForm.append(button)
		// Send text to all users through the server
		async function sendText() {
			console.log("Sending messsge")
			// Construct a msg object containing the data the server needs to process the message from the chat client.
			const msg = {
				type: "message",
				text: messgeInput.value,//"first mesage",//(document.getElementById("text") as HTMLInputElement).value,
				id: clientID,
				date: Date.now(),
			};

			// Send the msg object as a JSON-formatted string.
			socket.send(JSON.stringify(msg));

			const response = await fetch("http://localhost:8080/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(msg),
			});

			const wordList = document.getElementById("word-list")//  as HTMLLIElement;
			const li = document.createElement("li");
			const result = await response.json();
			li.textContent = result.content;
			wordList?.append(result.content);
			// Blank the text input element, ready to receive the next line of text from the user.
			messgeInput.value = "";
		}
		button.onclick = (e) => {
			e.preventDefault();
			sendText();
		}
	})();

	const graph = new Graphology();
	const wallet = HDNodeWallet.createRandom();
	graph.setAttribute("extendedKey", wallet.extendedKey);
	graph.setAttribute("address", wallet.address);
	graph.addNode(wallet.address, Object.assign({ color: "yellow" }, { org: await getData("src/docs/org/template.org") }, { extendedKey: wallet.neuter().extendedKey }));
	// Set up basic variables for app
	const record = document.querySelector(".record") as HTMLButtonElement;
	const stop = document.querySelector(".stop") as HTMLButtonElement;
	const soundClips = document.querySelector(".sound-clips") as HTMLDivElement;
	const canvas = document.querySelector(".visualizer") as HTMLCanvasElement;
	const mainSection = document.querySelector(".main-controls") as HTMLDivElement;

	// Disable stop button while not recording
	stop.disabled = true;

	// Visualiser setup - create web audio api context and canvas
	let audioCtx: AudioContext;
	const canvasCtx = canvas.getContext("2d");

	// Main block for doing the audio recording
	if (navigator.mediaDevices.getUserMedia) {
		console.log("The mediaDevices.getUserMedia() method is supported.");

		const constraints = { audio: true };
		let chunks: BlobPart[] = [];

		let onSuccess = function (stream: any) {
			const mediaRecorder = new MediaRecorder(stream);

			visualize(stream);

			record.onclick = function () {
				mediaRecorder.start();
				console.log(mediaRecorder.state);
				console.log("Recorder started.");
				record.style.background = "red";

				stop.disabled = false;
				record.disabled = true;
			};

			stop.onclick = function () {
				mediaRecorder.stop();
				console.log(mediaRecorder.state);
				console.log("Recorder stopped.");
				record.style.background = "";
				record.style.color = "";

				stop.disabled = true;
				record.disabled = false;
			};

			mediaRecorder.onstop = function (e) {
				console.log("Last data to read (after MediaRecorder.stop() called).");

				const clipName = prompt(
					"Enter a name for your sound clip?",
					"My unnamed clip"
				);

				const clipLabel = document.createElement("p");
				const clipContainer = document.createElement("article");
				clipContainer.classList.add("clip");

				const audio = document.createElement("audio");
				audio.setAttribute("controls", "");

				const deleteButton = document.createElement("button");
				deleteButton.textContent = "Delete";
				deleteButton.className = "delete";
				const downloadButton = document.createElement("button");
				downloadButton.textContent = "Download";
				downloadButton.className = "delete";
				const transcribeButton = document.createElement("button");
				transcribeButton.textContent = "Transcribe";
				transcribeButton.className = "delete";
				const results = document.createElement("span");
				results.className = "delete";
				results.style.margin = "2rem";

				if (clipName === null) {
					clipLabel.textContent = "My unnamed clip";
				} else {
					clipLabel.textContent = clipName;
				}

				clipContainer.appendChild(audio);
				clipContainer.appendChild(clipLabel);
				clipContainer.appendChild(deleteButton);
				clipContainer.appendChild(downloadButton);
				clipContainer.appendChild(transcribeButton);
				clipContainer.appendChild(results);
				soundClips.appendChild(clipContainer);

				audio.controls = true;
				const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
				chunks = [];
				const audioURL = window.URL.createObjectURL(blob);

				audio.src = audioURL;
				console.log("recorder stopped");

				downloadButton.onclick = (e) => {
					const downloadLink = document.createElement('a');
					downloadLink.href = audioURL;
					downloadLink.download = `${clipLabel.textContent?.toLowerCase()}.wav`;
					document.body.appendChild(downloadLink);
					downloadLink.click();
				};
				deleteButton.onclick = (e: any) => {
					URL.revokeObjectURL(audioURL);
					e.target?.closest(".clip").remove();
				};
				transcribeButton.onclick = async (e) => {
					const arrayBuffer = await blob.arrayBuffer();
					const uint8Array = new Uint8Array(arrayBuffer);

					const payload = {
						id: clientID,
						date: Date.now(),
						audio: Array.from(uint8Array), // Convert Uint8Array to JSON-friendly format
					};

					const response = await fetch("http://localhost:8080/upload", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(payload),
					});

					const result = await response.json();
					const { transcription } = result;
					console.log("Server response:", transcription);
					results.textContent = transcription;
				};

				clipLabel.onclick = function () {
					const existingName = clipLabel.textContent;
					const newClipName = prompt("Enter a new name for your sound clip?");
					if (newClipName === null) {
						clipLabel.textContent = existingName;
					} else {
						clipLabel.textContent = newClipName;
					}
				};
			};

			mediaRecorder.ondataavailable = function (e) {
				chunks.push(e.data);
			};
		};

		let onError = function (err: any) {
			console.log("The following error occured: " + err);
		};

		navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
	} else {
		console.log("MediaDevices.getUserMedia() not supported on your browser!");
	}

	function visualize(stream: any) {
		if (!audioCtx) {
			audioCtx = new AudioContext();
		}

		const source = audioCtx.createMediaStreamSource(stream);

		const bufferLength = 2048;
		const analyser = audioCtx.createAnalyser();
		analyser.fftSize = bufferLength;
		const dataArray = new Uint8Array(bufferLength);

		source.connect(analyser);

		draw();

		function draw() {
			if (!canvasCtx) return;
			const WIDTH = canvas.width;
			const HEIGHT = canvas.height;

			requestAnimationFrame(draw);

			analyser.getByteTimeDomainData(dataArray);

			canvasCtx.fillStyle = "rgb(200, 200, 200)";
			canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

			canvasCtx.lineWidth = 2;
			canvasCtx.strokeStyle = "rgb(0, 0, 0)";

			canvasCtx.beginPath();

			let sliceWidth = (WIDTH * 1.0) / bufferLength;
			let x = 0;

			for (let i = 0; i < bufferLength; i++) {
				let v = dataArray[i] / 128.0;
				let y = (v * HEIGHT) / 2;

				if (i === 0) {
					canvasCtx.moveTo(x, y);
				} else {
					canvasCtx.lineTo(x, y);
				}

				x += sliceWidth;
			}

			canvasCtx.lineTo(canvas.width, canvas.height / 2);
			canvasCtx.stroke();
		}
	}

	window.onresize = function () {
		canvas.width = mainSection.offsetWidth;
	};
});
