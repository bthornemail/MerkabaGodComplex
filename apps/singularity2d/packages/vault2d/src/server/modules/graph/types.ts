import MultiGraph from 'graphology';
import { forceSimulation } from "d3-force-3d";


export type Message = {
    role: "assistant" | "user" | "system";
    content: string;
}