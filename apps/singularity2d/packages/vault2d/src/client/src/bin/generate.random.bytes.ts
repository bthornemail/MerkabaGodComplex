export default function generateRandomBytes(length: number) {
	const array = new Uint8Array(length);
	window.crypto.getRandomValues(array);
	return array;
}