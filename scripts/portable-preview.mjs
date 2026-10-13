import fs from 'node:fs';
import path from 'node:path';
const source=path.resolve('dist/preview'),dest=path.resolve('review');
fs.rmSync(dest,{recursive:true,force:true});fs.cpSync(source,dest,{recursive:true});
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
for(const file of walk(dest).filter(p=>p.endsWith('.html'))){let html=fs.readFileSync(file,'utf8');html=html.replace(/(href|src)="(\/[^\"]*)"/g,(_,attr,url)=>{const [pathname,...query]=url.split('?');const target=path.join(dest,pathname.endsWith('/')?pathname+'index.html':pathname);return `${attr}="${path.relative(path.dirname(file),target).split(path.sep).join('/')}${query.length?'?'+query.join('?'):''}"`;});fs.writeFileSync(file,html);}
console.log('Portable review/index.html ready');
