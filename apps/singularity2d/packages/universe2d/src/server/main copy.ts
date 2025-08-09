// import path from 'path'
// import { nodewhisper } from 'nodejs-whisper'
import { WebSocketServer } from "ws";
import express from "express";
import transcribe, { transcribeBuffer } from './transcribe';


const app = express();
const PORT = 30000;

// Create WebSocket Server
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
	console.log("Client connected");

	ws.on("message", async (message) => {
		console.log("Received:", message.toString());
		const data = JSON.parse(message.toString())
		switch (data.type) {
			case "transcribe":
			case "wav":
				// Transcribe message using node-whisper
				try {
					const transcription = await transcribeBuffer(message);
					// await transcribe("recording-1739165713577.wav");
					console.log("Transcription:", transcription);

					// Send transcription result back to client
					ws.send(JSON.stringify({ transcription }));
				} catch (error) {
					console.error("Error transcribing:", error);
					ws.send(JSON.stringify({ error: "Transcription failed" }));
				}
				break;
			default:
				console.log("Default response:", message.toString());
				break;
		}
	});

	ws.on("close", () => {
		console.log("Client disconnected");
	});
});

app.listen(PORT + 1, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});