import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist/preview');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon'};
http.createServer((req,res)=>{let p;try{p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));}catch{res.writeHead(400).end();return;}if(p!==root&&!p.startsWith(root+path.sep)){res.writeHead(403).end();return;}if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');if(!fs.existsSync(p)){res.writeHead(404,{'Content-Type':'text/html'});res.end(fs.readFileSync(path.join(root,'404.html')));return;}res.writeHead(200,{'Content-Type':mime[path.extname(p)]||'application/octet-stream'});fs.createReadStream(p).pipe(res);}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
