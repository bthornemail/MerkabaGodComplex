export default function nodeWorker() {
  const worker = new Worker("dist/app/worker.js");

  // Define a sample entity and identity
  const sampleEntity = {
    properties: [new Uint8Array([1, 2, 3]).buffer],
    parameters: [new Uint8Array([4, 5, 6])],
    events: [{ sourceBufferIndex: 0, targetBufferIndex: 0, eventType: "update" }],
    references: [{ fromBufferIndex: 0, toBufferIndex: 0 }],
  };

  const sampleIdentity = {
    identityKey: "user123",
    entityPath: ["entity", "userProfile"],
  };

  // Send messages to the worker
  worker.postMessage({
    action: "insertEntity",
    payload: { path: ["entity", "userProfile"], entity: sampleEntity },
  });

  worker.postMessage({
    action: "insertIdentity",
    payload: { path: ["identity", "user123"], identity: sampleIdentity },
  });

  // Listen for messages from the worker
  worker.onmessage = (event) => {
    const { status, message, entity, identity } = event.data;

    if (status === "success") {
      if (entity) {
        console.log("Read entity:", entity);
      } else if (identity) {
        console.log("Read identity:", identity);
      } else {
        console.log(message);
      }
    } else {
      console.error("Error:", message);
    }
  };

  // Read the entity and identity
  setTimeout(() => {
    worker.postMessage({
      action: "readEntity",
      payload: { path: ["entity", "userProfile"] },
    });

    worker.postMessage({
      action: "readIdentity",
      payload: { path: ["identity", "user123"] },
    });
  }, 1000);
  return worker;
}