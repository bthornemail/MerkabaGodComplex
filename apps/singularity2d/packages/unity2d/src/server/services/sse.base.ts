const http = require('http');

const server = http.createServer((req, res) => {
  // Set the headers for an SSE response
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  });

  // Send an initial event
  res.write('data: Hello world!\n\n');

  // Start an interval to send more events
  setInterval(() => {
    res.write('data: The time is now ' + new Date() + '\n\n');
  }, 1000);
});

server.listen(3000);
