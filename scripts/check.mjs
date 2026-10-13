import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const hosts={'cyberdefend.in':'main','services.cyberdefend.in':'services','academy.cyberdefend.in':'academy'};
let pages=0,links=0;
for(const target of ['preview','main','services','academy'])for(const file of walk('dist/'+target).filter(f=>f.endsWith('.html'))){
 const html=fs.readFileSync(file,'utf8');pages++;
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${file}: one h1`);
 assert(/<title>[^<]+<\/title>/.test(html));assert(!/XXXXXXXX|TODO|Lorem ipsum/.test(html));
 for(const match of html.matchAll(/(?:href|src)="([^\"]+)"/g)){
  const raw=match[1];if(raw.startsWith('mailto:'))continue;
  if(raw.startsWith('#')){assert(html.includes(`id="${raw.slice(1)}"`),`${file}: missing fragment ${raw}`);continue;}
  let dest;
  if(raw.startsWith('/'))dest='dist/'+target+raw.split(/[?#]/)[0];
  else if(raw.startsWith('https://')){const u=new URL(raw);if(!hosts[u.host]||u.pathname.includes('sitemap'))continue;dest='dist/'+hosts[u.host]+u.pathname;}
  else continue;
  if(dest.endsWith('/'))dest+='index.html';assert(fs.existsSync(dest),`${file}: missing ${raw}`);links++;
 }
 for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))assert(JSON.parse(match[1])['@graph'].some(n=>n['@type']==='Organization')); 
}
function luminance(hex){const v=hex.match(/\w\w/g).map(c=>parseInt(c,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return v[0]*.2126+v[1]*.7152+v[2]*.0722;}
for(const [a,b] of [['122e3b','ffffff'],['536571','ffffff'],['ffffff','122e3b'],['536571','f4f7f8'],['087975','ffffff']]){const [hi,lo]=[luminance(a),luminance(b)].sort((a,b)=>b-a);assert((hi+.05)/(lo+.05)>=4.5,`Contrast failed ${a}/${b}`);}
console.log(`PASS: ${pages} pages; ${links} internal assets/links; JSON-LD; primary text contrast.`);
