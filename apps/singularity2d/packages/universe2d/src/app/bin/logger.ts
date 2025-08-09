const openGraphViewFormInput = document.querySelector("#open-graph-view-form-input") as HTMLInputElement;
const openGraphViewFormQtyButton = document.querySelector("#open-graph-view-form-qty-button") as HTMLButtonElement;
const logsElement = document.getElementById('logs') as HTMLPreElement;
export default function logger(message: string) {
	console.log(message);
	const li = document.createElement("li");
	li.textContent = message;
	openGraphViewFormInput.value = JSON.stringify(message);
	li.classList.add("list-group-item");
	logsElement.append(li);
	openGraphViewFormQtyButton.textContent = logsElement.childElementCount.toFixed(0)
}