export default async function sendAudio(clipName: string, audioURL: string, blob: Blob){
	const formData = new FormData();
	formData.append("audio",blob,clipName);
	try {
		const response  = await fetch("http://127.0.0.1:33333/upload",{
			method:"POST",
			
			body: formData
		})
		const result = await response.json();
		console.log("result: ",result)
		return result;
	} catch (error) {
		console.log("error: ",error)
	}
}