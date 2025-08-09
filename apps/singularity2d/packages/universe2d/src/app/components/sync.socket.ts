import { HDNodeWallet } from 'ethers';

export default async function getSocket() {
    let clientID = HDNodeWallet.createRandom().extendedKey;
    const socket = new WebSocket("ws://localhost:30000", [
        "protocolOne",
        "protocolTwo",
    ]);
    socket.onopen = () => {
        console.log("Connected to WebSocket");
        socket.send(JSON.stringify({ type: "webauthn-register", challenges: [12312] }))
    };
    socket.onmessage = (event) => {
        // const data = JSON.parse(event.data.toString());
        // switch (data.type) {
        // 	case "webauthn-options":
        // 		const options = data.options;
        // 		socket.send(JSON.stringify({type:"webauthn-register",options}))
        // 		break;

        // 	default:
        // 		break;
        // }
        // socket.close()
        // const f = (document.getElementById("chat-box") as any).contentWindow;
        let text = "";
        const msg = JSON.parse(event.data);
        const time = new Date(msg.date);
        const timeStr = time.toLocaleTimeString();

        switch (msg.type) {
            case "id":
                clientID = msg.id;
                // setUsername();
                break;
            case "username":
                text = `User <em>${msg.name}</em> signed in at ${timeStr}<br>`;
                break;
            case "message":
                text = `(${timeStr}) ${msg.name} : ${msg.text} <br>`;
                break;
            case "reject-username":
                text = `Your username has been set to <em>${msg.name}</em> because the name you chose is in use.<br>`;
                break;
            case "user-list":
                (document.getElementById("user-list-box") as HTMLDivElement).innerText = msg.users.join("\n");
                break;
        }

        // if (text.length) {
        //     // f.write(text);
        //     (document.getElementById("chat-box") as any).contentWindow.scrollByPages(1);
        // }
    };
    socket.onerror = (err) => console.error("WebSocket Error:", err);
    return socket;
};