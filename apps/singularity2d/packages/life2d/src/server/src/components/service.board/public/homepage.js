import {getWallet} from './main.js'
export function MainTopicsButtonGroup(){
	const buttonGroup = document.createElement("div")
	buttonGroup.innerHTML = `<div style="gap:1rem;text-align:center;">
		<div class="button-group" mt-2 mb-2>
		<button class="btn btn-small btn-outline-danger">Assets</button>
		<button class="btn btn-small btn-outline-warning">Content</button>
		<button class="btn btn-small btn-outline-success">Services</button>
		</div> 
		<button class="btn btn-small btn-outline-primary">Tokens</button>
	</div>`
	return buttonGroup
} 
export default function HomePage(LoginVew, ConnectWalletButton) {
	const div = document.createElement("div")
	const logo = new Image(240)
	div.id = "home-page";
	div.innerHTML = "<h1>Marketplace 2D</h1>";
	logo.src = "color-lineal-marketplace-svgrepo-com.svg";
	div.appendChild(logo);
	if(getWallet()) {div.appendChild(MainTopicsButtonGroup())}
	if(!getWallet()) {div.appendChild(ConnectWalletButton)}
	LoginVew.replaceChildren(div)
}