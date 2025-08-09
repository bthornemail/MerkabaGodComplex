export async function getDictaphone(clientID: string,onComplete: (clipName: string,audioURL: string,blob: Blob)=>void){
    // Set up basic variables for app
    const record = document.querySelector(".record") as HTMLButtonElement;
    const stop = document.querySelector(".stop") as HTMLButtonElement;
    const soundClips = document.querySelector(".sound-clips") as HTMLDivElement;
    const canvas = document.querySelector(".visualizer") as HTMLCanvasElement;
    const mainSection = document.querySelector(".main-controls") as HTMLDivElement;

    // Disable stop button while not recording
    stop.disabled = true;

    // Visualiser setup - create web audio api context and canvas
    let audioCtx: AudioContext | null = null;
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
                onComplete(clipLabel.textContent,audioURL,blob)
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
    canvas.width = mainSection.offsetWidth;
    return {record,stop,soundClips,canvas,audioCtx,canvasCtx}
};
