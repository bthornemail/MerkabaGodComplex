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