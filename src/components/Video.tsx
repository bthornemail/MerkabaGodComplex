import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ControllerContext } from "../hooks/useController";

export type NodeType = 'input' | 'output' | 'socket' | 'server' | 'tetrahedron';


const fps = 60;
const width = 1280;
const height = 720;
let canvasInterval = null;
export default function Video() {
    const startBtn = useRef<HTMLButtonElement>(null);
    const recordBtn = useRef<HTMLButtonElement>(null);
    const video = useRef<HTMLVideoElement>(null); // document.getElementById('myVideo');
    const canvas = useRef<HTMLCanvasElement>(null); // document.getElementById('myCanvas');
    const [recording, setRecording] = useState<boolean>(false);
    const [mediaRecorder, setMediaRecorder] = useState<any>(null);
    let recordedChunks;
    let stream; // Store the webcam stream
    const [context, setContext] = useState(canvas.current?.getContext('2d'));
    // const ctx = canvas.current?.getContext('2d');
    const {
        error,
        setError,
        isLoading,
        useContextualSearch,
        selectedNode,
        searchResults,
        setUseContextualSearch,
        setSelectedNode,
        setSearchResults,
        setIsLoading,
    } = useContext(ControllerContext);
    useEffect(() => {
        setContext(canvas.current?.getContext('2d'))
    }, [])
    useEffect(() => {
        // Stop the stream when the page unloads
        window.addEventListener('beforeunload', () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        });
    }, []);
    useEffect(() => {
        video.current?.addEventListener('play', () => {
            function drawVideoFrame() {
                if (!video.current || !canvas.current || !context) return;
                context.drawImage(video.current, 0, 0, canvas.current.width, canvas.current.height);
                requestAnimationFrame(drawVideoFrame);
            }
            requestAnimationFrame(drawVideoFrame);
        });
    });
    function drawImage(video) {
        canvas.current?.getContext('2d', { alpha: false })?.drawImage(video, 0, 0, width, height);
    }
    useEffect(() => {
        if (!video.current) return;
        const Video = video.current;
        let canvasInterval = window.setInterval(() => {
            drawImage(Video);
        }, 1000 / fps);
        Video.onpause = function () {
            clearInterval(canvasInterval);
        };
        Video.onended = function () {
            clearInterval(canvasInterval);
        };
        Video.onplay = function () {
            clearInterval(canvasInterval);
            canvasInterval = window.setInterval(() => {
                drawImage(Video);
            }, 1000 / fps);
        };

    }, []);

    // Function to start the webcam stream
    async function startWebcam() {
        if (!video.current) return;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.current.srcObject = stream;
        } catch (error) {
            console.error("Error accessing webcam:", error);
        }
    }

    // Function to draw the video frame onto the canvas
    function drawWebcam() {
        if (!video.current || !context || !canvas.current) return;
        if (video.current.readyState === video.current.HAVE_ENOUGH_DATA) {
            context.drawImage(video.current, 0, 0, canvas.current.width, canvas.current.height);
        }
        requestAnimationFrame(drawWebcam);
    }
    const handleStart = async () => {
        await startWebcam();
        drawWebcam(); // Start drawing the frames after the stream is active
    }
    const handleClick = useCallback(() => {
        if (!recordBtn.current || !canvas.current) return;
        // setRecording(!recording);
        if (recording) {
            setRecording(!recording);

            // if (!canvas.current) return;
            recordBtn.current.textContent = "Stop";
            const stream = canvas.current.captureStream(25);
            setMediaRecorder(new MediaRecorder(stream!, {
                mimeType: 'video/webm;codecs=vp9',
                // ignoreMutedMedia: true
            }));
            recordedChunks = [];
            mediaRecorder.ondataavailable = e => {
                if (e.data.size > 0) {
                    recordedChunks.push(e.data);
                }
            };
            mediaRecorder.start();
        } else {
            setRecording(!recording);

            if (!mediaRecorder || !mediaRecorder.current) return;
            recordBtn.current.textContent = "Record"
            mediaRecorder.current.stop();
            setTimeout(() => {
                const blob = new Blob(recordedChunks, {
                    type: "video/webm"
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "recording.webm";
                a.click();
                URL.revokeObjectURL(url);
            }, 0);
        }
    }, [mediaRecorder, recordBtn])
    return (<div>
        {isLoading && <div className="zg-loading">Searching...</div>}
        {error && <div className="zg-error">{error}</div>}
        <video id="myVideo" ref={video} src="sample_video.mp4 (240p).mp4" controls crossOrigin={"anonymous"}></video>
        <canvas ref={canvas} id="myCanvas"></canvas>
        <canvas id="c1" width="160" height="96"></canvas>
        <canvas id="c2" width="160" height="96"></canvas>
        <button onClick={handleClick}>Record</button>
        <button onClick={handleStart}>Start</button>
    </div>);
}