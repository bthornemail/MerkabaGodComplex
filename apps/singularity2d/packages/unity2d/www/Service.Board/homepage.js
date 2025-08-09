
export default function HomePage(LoginVew, ConnectWalletButton, address, mnemonic) {
	const div = document.createElement("div")
	const logo = new Image(240)
	
	let buttonGroup = ConnectWalletButton;

	div.id = "home-page";
	div.innerHTML = "<h1>Marketplace 2D</h1>";
	logo.src = "color-lineal-marketplace-svgrepo-com.svg";
	
	if (mnemonic) {
		div.innerHTML = `<div style="text-align:center;">
			<h2>Save this code to reload your account</h2> 
			<p>${mnemonic}</p>
		</div>`
	}
	if (address) {
		const buttonGroup = document.createElement("div")
		buttonGroup.innerHTML = `<div style="gap:1rem;text-align:center;">
			<div class="button-group" mt-2 mb-2>
			<button class="btn btn-small btn-outline-danger">Assets</button>
			<button class="btn btn-small btn-outline-warning">Content</button>
			<button class="btn btn-small btn-outline-success">Services</button>
			</div> 
			<button class="btn btn-small btn-outline-primary">Tokens</button>
		</div>`
	}
	div.appendChild(logo);
	div.appendChild(buttonGroup)
	LoginVew.replaceChildren(div)
}