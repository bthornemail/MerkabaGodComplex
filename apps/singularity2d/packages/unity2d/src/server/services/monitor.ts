import { createInterface } from 'node:readline';
import http, { IncomingMessage, ServerResponse } from "node:http";
import ngrok from '@ngrok/ngrok';
import * as mqtt from 'mqtt';
import { HDNodeWallet } from 'ethers';

export class Monitor {
  local: string = "mqtt://127.0.0.1:1883";
  broker: string = "mqtt://test.mosquitto.org:1883";
  topic: string = "unity2d/service/monitor";
  identity: string = HDNodeWallet.fromPhrase(process.env.PHRASE ?? "roast thank tiny coach seat ensure cruel auto shaft finish fee resemble").extendedKey;
  protocol: string = "http";
  host: string = "127.0.0.1";
  port: number = 8888;
  client: mqtt.MqttClient = mqtt.connect(this.local);
  isListening: boolean = false;
  watching: Set<string> = new Set();
  server = http.createServer(async (req, res) => {
    // get URI path
    const uri = new URL(`http://${process.env.HOST ?? 'localhost'}${req.url}`).pathname;
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    });
    // client.publishAsync(MQTT_TOPIC, uri)
    this.client.on("message", (topic, payload, packet) => {
      res.write(this.onMessage({ url: uri, topic, message: new TextDecoder().decode(payload) }));
    });
  })
  onMessage(message: { [key: string]: any }) {
    if (message.message) console.log(message.message);
    return JSON.stringify(message);
  }
  async sendMessage(message: { [key: string]: any }) {
    const node = Object.assign({}, {
      broker: this.broker,
      topic: this.topic,
      identity: this.identity,
      protocol: this.protocol,
      host: this.host,
      port: this.port,
      event: 'message'
    }, message);
    await this.client.publishAsync(message.topic ?? `${this.topic}/${this.identity}`, JSON.stringify(node))
  }
  toggleListening(active: boolean) {
    if (active) {
      console.log("Listening mode active");
    } else {
      console.log("Publishing mode active");
    }
    this.isListening = active;
  }
  async watch(topic) {
    await this.client.subscribeAsync(topic);
    return this.watching.add(topic);
    // return topic;
  }
  constructor() {
    this.client.on('connect', async () => {
      console.log(`Connected to MQTT broker at ${this.broker}`);

      const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: `${this.identity}: `,
        terminal: true,
        completer: (line: string) => {
          // const completions = '.help .error .exit .quit .q'.split(' ');
          // const hits = completions.filter((c) => c.startsWith(line));
          // Show all completions if none found 
          !this.isListening ? this.toggleListening(true) : this.toggleListening(false);
          this.isListening ? console.log(Array.from(this.watching)) : rl.prompt();
          return [line, line];
        }
      });
      console.log(await this.watch(`${this.topic}`));
      console.log(await this.watch(`${this.topic}/+`));
      /*
      const listener = await ngrok.forward({
        addr: this.port,
        authtoken: "7pokcWyw8pGbxw6daKiYE_3xPiaTA2qpLnDhtLooBk1",
        onStatusChange(status) {
              console.log(`NGROK status:\n ${status}`);
        }
      });
      console.log(await this.client.publishAsync(this.topic, JSON.stringify({ event: 'connected', url: listener.url(), identity: this.identity })));
      this.sendMessage({ event: 'connected', url: listener.url(), identity: this.identity })
      console.log("Ingress established listener at: " + listener.url());
      */
      // rl.prompt();
      this.server.listen(this.port, () => {
        console.log(`server running: ${this.protocol}://${this.host}:${this.port}\n\n`);
        rl.on('line', async (line: string) => {
          if (this.isListening) {
            console.log("Listening Mode - Fetching updates");
            return rl.prompt()
          };
          if (!this.client.connected) {
            this.client = mqtt.connect(this.local);
            return console.log("please wait... connecting")
          };
          this.sendMessage({ event: 'message', url: `${this.client.options.protocol}://${this.client.options.hostname}/${this.client.options.path}:${this.client.options.port}`, identity: this.identity, message: line });
          // await this.client.publishAsync(`${this.topic}/${this.identity}`, JSON.stringify({ event: 'message', url: `${this.client.options.protocol}://${this.client.options.hostname}/${this.client.options.path}:${this.client.options.port}`, identity: this.identity, message: line }))
          rl.prompt()
        });
        rl.prompt();
      });
    });
  }
}
new Monitor();