import { ServerResponse } from "http";
import { MqttClient } from "mqtt";
/**
 * Broadcasts graph updates to all connected clients via MQTT and SSE.
 * @param {any} update - The graph update payload to broadcast.
 */
export default function broadcastGraphUpdate(update: any,{mqttClient,sseClients}: {mqttClient: MqttClient,sseClients: Set<ServerResponse>}) {
    mqttClient.publish('graph/updates', JSON.stringify(update));
    sseClients.forEach((client: ServerResponse) => {
        client.write(`data: ${JSON.stringify(update)}\n\n`);
    });
}