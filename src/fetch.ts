// This function is a template for fetching binary data from a given URL and returns it as an ArrayBuffer.
export async function fetchBinaryData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        // Now 'arrayBuffer' contains the raw binary data
        // You can then use TypedArrays (e.g., Uint8Array, Float32Array)
        // or DataView to interpret and manipulate the data.
        const uint8Array = new Uint8Array(arrayBuffer);
        console.log('Received bytes:', uint8Array);
        return arrayBuffer;
    } catch (error) {
        console.error('Error fetching binary data:', error);
    }
}
// This function is a template for propagating binary data from a given URL and returns it as an ArrayBuffer.
export async function sendArrayBuffer(url, arrayBuffer) {
    try {
        const response = await fetch(url, {
            method: 'POST', // Or 'PUT', depending on your API
            headers: {
                'Content-Type': 'application/octet-stream', // Or the appropriate MIME type
            },
            body: arrayBuffer,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.text(); // Or response.json(), depending on server response
        console.log('Server response:', result);
    } catch (error) {
        console.error('Error sending ArrayBuffer:', error);
    }
}
export async function getData(url: string) {
//   const url = "https://example.org/products.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    return json
  } catch (error) {
    console.error(error.message);
  }
}