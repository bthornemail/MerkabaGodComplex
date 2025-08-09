import http, { IncomingMessage, ServerResponse } from "node:http";

const _port = 8001;
export default function SSE(generator: any, port: number = _port) {
    function sseStart(res: ServerResponse<IncomingMessage> & { req: IncomingMessage; }) {
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        });
    }
    const server = http.createServer(async (req, res) => {
        // get URI path
        const uri = new URL(`http://${process.env.HOST ?? 'localhost'}${req.url}`).pathname;
        // return response
        switch (uri) {
            case "/random":
            default:
                sseStart(res);
                // sseRandom(res);
                for await (const node of generator) {
                    res.write(JSON.stringify(node))
                }
                res.end();
                break;
        }

    })
    server.listen(port,()=>{
        console.log(`server running: http://localhost:${port}\n\n`);
    });
    return server;
}
SSE(["new Set()"])