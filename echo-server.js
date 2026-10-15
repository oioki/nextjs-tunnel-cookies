// Stands in for Sentry ingest. The app's tunnel destination is overridden to point here
// (_SENTRY_TUNNEL_DESTINATION_OVERRIDE), so every envelope Next.js forwards lands on this server
// and we can print exactly which headers came along for the ride.
const http = require('http');

const PORT = process.env.ECHO_PORT || 3113;

const server = http.createServer((req, res) => {
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    console.log('\n--- tunnel request received ---');
    console.log(`${req.method} ${req.url}`);
    console.log(`Cookie: ${req.headers['cookie'] || '(none)'}`);
    if (req.headers['authorization']) {
      console.log(`Authorization: ${req.headers['authorization']}`);
    }
    console.log(`Body: ${Buffer.concat(chunks).length} bytes`);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{}');
  });
});

server.listen(PORT, () => {
  console.log(`Echo server listening on http://localhost:${PORT}`);
});
