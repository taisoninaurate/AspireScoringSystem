// Built-in HTTP static server for ASPIRE Judges Mobile App
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8080;
const PUBLIC_DIR = 'C:\\Users\\SAQ-Izzul\\.gemini\\antigravity\\scratch\\aspire-judge-app';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('File Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Find Local IP Address
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const localIp = getLocalIp();

server.listen(PORT, () => {
  console.log(`\n🚀 ASPIRE Judges Mobile App Server Running!`);
  console.log(`-------------------------------------------`);
  console.log(`💻 Local PC Access:  http://localhost:${PORT}`);
  console.log(`📱 Phone Access:     http://${localIp}:${PORT}`);
  console.log(`-------------------------------------------\n`);
});
