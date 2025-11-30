const http = require('http');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'attendance.json');

function ensureDataFile(){
  if(!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({}));
}

const server = http.createServer((req, res) => {
  if(req.method === 'GET' && (req.url === '/attendance')){
    ensureDataFile();
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(data);
    return;
  }

  if(req.method === 'POST' && req.url === '/attendance'){
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        ensureDataFile();
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        data[parsed.date] = parsed.status;
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.writeHead(200, {'Content-Type':'text/plain'});
        res.end('OK');
      } catch(e){
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
    return;
  }

  // Serve static files (index.html, css, js) for convenience
  const publicPath = path.join(__dirname, req.url === '/' ? '/index.html' : req.url);
  if(fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()){
    const ext = path.extname(publicPath).toLowerCase();
    const map = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.json':'application/json' };
    res.writeHead(200, {'Content-Type': map[ext] || 'application/octet-stream'});
    fs.createReadStream(publicPath).pipe(res);
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('Server listening on', port);
});
