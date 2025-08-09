"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEdge = isEdge;
exports.isTransformer = isTransformer;
exports.isServer = isServer;
exports.isProperties = isProperties;
function isEdge(block) {
    const { definitions } = block;
    if (!definitions)
        return;
    const { properties } = definitions;
    if (!properties)
        return;
    const { source, target } = properties;
    if (!source)
        return;
    if (!target)
        return;
    return true;
}
function isTransformer(block) {
    const { definitions } = block;
    if (!definitions)
        return;
    const { events } = definitions;
    if (!events)
        return;
    return true;
}
function isServer(block) {
    const { definitions } = block;
    if (!definitions)
        return;
    const { features } = definitions;
    if (!features)
        return;
    const { ipc, udp, app, curl, html, io, ioHTTP, sse, ws } = features;
    if (!ipc)
        return;
    return true;
}
function isProperties(block) {
    const { content } = block;
    if (!content)
        return;
    const { definitions } = content;
    if (!definitions)
        return;
    const { properties } = definitions;
    if (!properties)
        return;
    return true;
}
//# sourceMappingURL=assertions.js.map