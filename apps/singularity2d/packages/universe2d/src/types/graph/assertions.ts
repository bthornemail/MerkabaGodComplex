import { ENVIRONMENT_BLOCK } from "../../../unity2d/types/environment/environment";
import { iBlock } from "../blockchain/interfaces";

export function isEdge(block: ENVIRONMENT_BLOCK) {
    const { definitions } = block;
    if (!definitions) return
    const { properties } = definitions;
    if (!properties) return
    const { source, target } = properties;
    if (!source) return;
    if (!target) return;
    return true;

}
export function isTransformer(block: ENVIRONMENT_BLOCK) {
    const { definitions } = block;
    if (!definitions) return
    const { events } = definitions;
    if (!events) return
    return true;

}

export function isServer(block: ENVIRONMENT_BLOCK) {
    const { definitions } = block;
    if (!definitions) return
    const { features } = definitions;
    if (!features) return
    const { ipc, udp, app, curl, html, io, ioHTTP, sse, ws } = features;
    if (!ipc) return;
    return true;
}

export function isProperties(block: iBlock) {
    const { content } = block;
    if (!content) return
    const { definitions } = content;
    if (!definitions) return
    const { properties } = definitions;
    if (!properties) return
    return true;
}