import { pipe } from 'it-pipe'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
export default function handleP2P(libp2p) {
    console.log('Relay listening on multiaddr(s): ', libp2p.getMultiaddrs().map((ma) => ma.toString()))
    function onEvent(libp2p) {
      libp2p.addEventListener("start", (e) => {
        console.log("start", e)
      })
      libp2p.addEventListener("self:peer:update", (e) => {
        console.log("self:peer:update", e)
      })
      libp2p.addEventListener("peer:discovery", (evt) => {
        console.log("peer:discovery", evt)
        console.log('found peer: ', evt.detail.toString())
        // libp2p.dial(evt.detail.multiaddrs) // dial discovered peers
      })
      libp2p.addEventListener("peer:connect", (e) => {
        console.log("peer:connect", e)
      })
      libp2p.addEventListener("peer:disconnect", (e) => {
        console.log("peer:disconnect", e)
      })
      libp2p.addEventListener("peer:identify", (e) => {
        console.log("peer:identify", e)
      })
      libp2p.addEventListener("peer:reconnect-failure", (e) => {
        console.log("peer:reconnect-failure", e)
      })
      libp2p.addEventListener("peer:update", (e) => {
        console.log("peer:update", e)
      })

      libp2p.addEventListener("transport:listening", (e) => {
        console.log("transport:listening", e)
      })
      libp2p.addEventListener("transport:close", (e) => {
        console.log("transport:close", e)
      })

      libp2p.addEventListener("connection:open", (e) => {
        console.log("connection:open", e)
      })
      libp2p.addEventListener("connection:prune", (e) => {
        console.log("connection:prune", e)
      })
      libp2p.addEventListener("connection:close", (e) => {
        console.log("connection:close", e)
      })

      libp2p.addEventListener('certificate:provision', (e) => {
        console.log("certificate:provision", e)
      })
      libp2p.addEventListener('certificate:renew', (e) => {
        console.log("certificate:renew", e)
      })
    }
    function onListening(libp2p) {
      libp2p.handle('/another-protocol/1.0.0', ({ connection, stream }) => {
        pipe(
          stream,
          async function (source) {
            for await (const msg of source) {
              console.log(new TextDecoder().decode(msg.subarray()))
              const {
                id,
                direction,
                protocol,
                metadata,
                log,
                status,
                writeStatus,
                readStatus,
                timeline
              } = stream;
              const {
                id: connectionID,
                direction: connectionDirection,
                remoteAddr,
                remotePeer,
                status: connectionStatus,
                tags,
                rtt,
                multiplexer
              } = connection;
              console.log({
                id: connectionID,
                direction: connectionDirection,
                remoteAddr,
                remotePeer,
                status: connectionStatus,
                tags,
                rtt,
                multiplexer
              })
              console.log({
                id,
                direction,
                protocol,
                metadata,
                status,
                writeStatus,
                readStatus,
                timeline
              });
            }
          }
        )
      })
      libp2p.handle('/another-protocol/2.0.0', ({ connection, stream }) => {
        pipe(
          stream,
          async function (source) {
            for await (const msg of source) {
              console.log(new TextDecoder().decode(msg.subarray()))
              const {
                id,
                direction,
                protocol,
                metadata,
                log,
                status,
                writeStatus,
                readStatus,
                timeline
              } = stream;
              console.log({
                id,
                direction,
                protocol,
                metadata,
                status,
                writeStatus,
                readStatus,
                timeline
              });
            }
          }
        )
      })
    }
    function onPing() {
      setInterval(() => {
        console.warn("---")
        for (const connection of libp2p.getConnections()) {
          // console.warn(peerId, connection.remoteAddr.toString())
          console.warn(connection.remotePeer.toString())
          // Logs the PeerId string and the observed remote multiaddr of each Connection
        }
      }, 3000)
    }
    onListening(libp2p);
  }