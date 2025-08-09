const user = {
	peerId: {
		toString: ()=>"Qm83763838374838282"
	},
	wallet: {
		address: "0x83763838374838282"
	}
}
export const data = {
	nodes: [
		{
			id: user.peerId.toString(),
			img: "vault.svg",
			name: "Brian",
			title: "Brian",
			color: "black",
			val: 1
		},
		{
			id: "Service_Board",
			img: "board-svgrepo-com.svg",
			name: "Service Board",
			title: "Service Board",
			color: "green",
			val: 2
		},
		{
			id: "Asset_Manager",
			img: "bar-code-scan-svgrepo-com.svg",
			name: "Asset Manager",
			title: "Asset Manager",
			color: "red",
			val: 2
		},
		{
			id: "Knowledge_College",
			img: "cap-education-hat-svgrepo-com.svg",
			name: "Knowledge College",
			title: "Knowledge College",
			color: "blue",
			val: 2
		},
		{
			id: user.wallet.address,
			img: "wallet-wallet-svgrepo-com.svg",
			name: "Wallet",
			title: "Wallet",
			color: "yellow",
			val: 2
		}
	],
	links: [
		{
			source: user.peerId.toString(),
			target: "Service_Board"
		},
		{
			source: user.peerId.toString(),
			target: "Asset_Manager"
		},
		{
			source: user.peerId.toString(),
			target: "Knowledge_College"
		},
		{
			source: user.peerId.toString(),
			target: "Service_Board"
		},
		{
			source: user.peerId.toString(),
			target: user.wallet.address
		},
	]
}
export default function getData(user?: any) {
	return {
		nodes: data.nodes.map((node: any, index: number) => {
			// console.log(node)
			// if(!user && node.id === user.peerId.toString()){
			// 	node.img = "loading-reload-svgrepo-com.svg"
			// }
			return Object.assign({},node,{
				img: `src/images/${node.img}`,
				label: `<div className="card">
					<div className="card-title">${node.title}</div>
					<div className="card-subtitle">${node.value ?? ""}</div>
					<div className="card-body">${node.summary ?? ""}</div>
				</div>`,
			})
			// return node
		}),
		links: data.links.map(({ source, target }: any, index: number) => {
			return { source, target }
		})
	}
}