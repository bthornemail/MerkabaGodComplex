import io from 'socket.io-client'
import mqtt from "mqtt";
export function mqttConnect() {
  try {
    const client = mqtt.connect("ws://127.0.0.1:3883");

    client.on("connect", () => {
      client.subscribe("presence", (err) => {
        if (!err) {
          client.publish("presence", "Hello mqtt");
        }
      });
    });
    client.on("message", (topic, message) => {
      // message is Buffer
      console.log(message.toString());
      client.end();
    });
    document.getElementById("input-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const text = document.getElementById("input").value;
      createNode(text.trim());

      client.publish("presence", "Hello mqtt");
      document.getElementById("input").value = "";
    })
    return client;
  } catch (error) {
    console.error(error)
  }
}
export function graphConnect() {
  try {
    const graph = new graphology.Graph();
    console.log(graph.export());
    return graph;
  } catch (error) {
    console.error(error)
  }
}
export function socketConnect() {
  try {
    const socket = io(":8888", {
      reconnectionDelayMax: 10000
    });
    socket.on("connect", () => {
      console.log("", socket.id)
    })
    socket.on("message", (msg, data) => {
      console.log({ msg, data })
    })
    return socket;
  } catch (error) {
    console.error(error)
  }
}
export function sseConnect() {
  try {
    var es = new EventSource('//0.0.0.0:8889/graph');
    es.onmessage = function (event, data) {
      console.log(event, data)
    };

    es.addEventListener("eventName", function (event) {
      console.log(event)
    });
    return es;
  } catch (error) {
    console.error(error)
  }
}
export function wsConnect() {
  try {
    const socket = new WebSocket("ws://localhost:33333");
    socket.onopen = async () => {
      // return es;
    }

    socket.onmessage = async (event) => {
      console.log("Received message:", event.data);
      const { extendedKey, root, hash, signature, content } = JSON.parse(event.data);
      // const response = await onMessage({ extendedKey, root, hash, signature, content });
      if (content) {
        let credential = await navigator.credentials.get(JSON.parse(content))

        // let credential = await navigator.credentials.get({
        // 	publicKey: {
        // 		challenge: new Uint8Array([139, 66, 181, 87, 7, 203, ...]),
        // 		rpId: "acme.com",
        // 		allowCredentials: [{
        // 			type: "public-key",
        // 			id: new Uint8Array([64, 66, 25, 78, 168, 226, 174, ...])
        // 		}],
        // 		userVerification: "required",
        // 	}
        // });
      } else {
        // let credential = await navigator.credentials.create({
        // 	publicKey: {
        // 	  challenge: new Uint8Array([117, 61, 252, 231, 191, 241, ...]),
        // 	  rp: { id: "acme.com", name: "ACME Corporation" },
        // 	  user: {
        // 		id: new Uint8Array([79, 252, 83, 72, 214, 7, 89, 26]),
        // 		name: "jamiedoe",
        // 		displayName: "Jamie Doe"
        // 	  },
        // 	  pubKeyCredParams: [ {type: "public-key", alg: -7} ]
        // 	}
        //   });
      }

      // return response ?? socket.send(response);
      return;
    };
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  } catch (error) {
    console.error(error)
  }

}