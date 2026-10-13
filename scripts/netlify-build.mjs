import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const target=process.env.SITE_TARGET||'main';
if(!['main','services','academy'].includes(target))throw new Error('SITE_TARGET must be main, services or academy');
const prod=process.env.CONTEXT==='production'&&process.env.LAUNCH_APPROVED==='true';
execFileSync(process.execPath,['scripts/build.mjs'],{stdio:'inherit',env:{...process.env,SITE:target,PRODUCTION:String(prod)}});
fs.rmSync('dist/deploy',{recursive:true,force:true});fs.cpSync('dist/'+target,'dist/deploy',{recursive:true});
