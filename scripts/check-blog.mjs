import fs from 'node:fs';
import assert from 'node:assert/strict';
import {validatePosts,postWordCount,addCurrentPosts} from '../src/current-posts.mjs';
const posts=JSON.parse(fs.readFileSync('src/data/current-posts.json','utf8'));
const legacy=JSON.parse(fs.readFileSync('src/data/legacy-articles.json','utf8'));
validatePosts(posts,legacy.map(p=>p.slug));
const listing=fs.readFileSync('dist/academy/blogs/index.html','utf8');
const sitemap=fs.readFileSync('dist/academy/sitemap.xml','utf8');
assert(listing.indexOf('Latest insights')<listing.indexOf('Article archive'),'Current posts must precede the archive');
for(const p of posts){
 const url='https://academy.cyberdefend.in/blogs/'+p.slug+'/';
 const html=fs.readFileSync('dist/academy/blogs/'+p.slug+'/index.html','utf8');
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 const article=schema['@graph'].find(n=>n['@type']==='BlogPosting');
 assert(article,'Current article must have BlogPosting metadata');
 assert.equal(article.url,url);assert.equal(article.datePublished,p.datePublished);assert.equal(article.dateModified,p.dateModified);
 assert.equal(article.author['@type'],'Organization');assert.equal(article.author.name,'CyberDefend');
 assert.deepEqual(article.citation,p.sources.map(s=>s.url));
 assert(html.includes(`rel="canonical" href="${url}"`));assert(html.includes('property="og:type" content="article"'));
 assert(html.includes(`datetime="${p.datePublished}"`));assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
 assert(!html.includes('Archived educational content'),'Do not mark new content as archived');
 assert(listing.includes('/blogs/'+p.slug+'/'));assert(sitemap.includes(`<loc>${url}</loc><lastmod>${p.dateModified}</lastmod>`));
 if(process.env.PRODUCTION==='true')assert(html.includes('name="robots" content="index,follow,max-image-preview:large"'));
 for(const b of p.blocks.filter(b=>b.type==='heading'))assert(html.includes(`id="${b.id}"`)&&html.includes(`href="#${b.id}"`));
 assert(postWordCount(p)>=300,'Article unexpectedly empty or truncated');
}
for(const a of legacy){assert(listing.includes('/blogs/'+a.slug+'/'));assert(fs.existsSync('dist/academy/blogs/'+a.slug+'/index.html'));}
if(posts.length){
 const p=posts[0],changed=edit=>{const copy=structuredClone(p);edit(copy);return copy;};
 assert.throws(()=>validatePosts([p,{...p,slug:p.slug+'-duplicate'}]),/one new article/);
 assert.throws(()=>validatePosts([p],[p.slug]),/Duplicate article slug/);
 assert.throws(()=>validatePosts([changed(p=>p.sources[0].url='javascript:alert(1)')]),/HTTPS/);
 assert.throws(()=>validatePosts([changed(p=>p.blocks.push({type:'html',html:'<script>alert(1)</script>'}))]),/Unsupported/);
 assert.throws(()=>validatePosts([changed(p=>p.dateModified='9999-01-01')]),/future/);
 // Exercise escaping through the real renderer using a hostile source title in the read boundary.
 const originalRead=fs.readFileSync;
 const hostile=changed(p=>{p.title='<script>"unsafe"</script>';p.sources[0].title='<img src=x onerror=alert(1)>';});
 const defs={resources:['academy','blogs/'],academy:['academy',''],programmes:['academy','programmes/'],labs:['academy','labs/'],advisory:['services','security-advisory/']};
 for(const a of legacy)defs['article_'+a.slug]=['academy','blogs/'+a.slug+'/'];
 const pages={};
 try{
  fs.readFileSync=(file,...args)=>file==='src/data/current-posts.json'?JSON.stringify([hostile]):originalRead(file,...args);
  const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
  addCurrentPosts({defs,pages,link:k=>'/'+defs[k][1],pageHero:()=>'',section:s=>s,head:()=>'',textLink:()=>'',esc});
  const rendered=pages['post_'+hostile.slug].body;
  assert(!rendered.includes('<script>')&&!rendered.includes('<img src=x'));assert(rendered.includes('&lt;script>'));
 }finally{fs.readFileSync=originalRead;}
}
console.log(`PASS: ${posts.length} current posts; archive preservation, dates, canonical/schema/sitemap, safe rendering and duplicate-publication guards.`);
