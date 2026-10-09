import fs from 'node:fs';import crypto from 'node:crypto';import {draftAlert} from '../../ollama.mjs';import {triage} from '../../dist/engine.js';
const root='evaluation/v2/';const cases=JSON.parse(fs.readFileSync(root+'cases.json'));const policy=fs.readFileSync(root+'policy.txt','utf8');
const files=[root+'cases.json',root+'policy.txt',root+'PROTOCOL.md',root+'run.mjs','ollama.mjs','dist/engine.js'];
const hashes=Object.fromEntries(files.map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')]));
const models=await(await fetch('http://127.0.0.1:11434/api/tags')).json();const dir=root+'run-'+new Date().toISOString().replace(/[:.]/g,'-');fs.mkdirSync(dir);
fs.writeFileSync(dir+'/manifest.json',JSON.stringify({hashes,models,model:'qwen2.5:3b',attempts:1},null,2));const rows=[];
for(const [i,c] of cases.entries())for(const arm of i%2?['policy','generic']:['generic','policy']){
 let raw=null,output=null,error=null;const start=performance.now();
 try{output=await draftAlert(c.alert,{model:'qwen2.5:3b',fetchImpl:async(url,options)=>{const body=JSON.parse(options.body);if(arm==='policy')body.messages[0].content+='\nTriage policy:\n'+policy;const response=await fetch(url,{...options,body:JSON.stringify(body)});raw=await response.clone().text();return response;}});}catch(e){error=e.message;}
 const row={caseId:c.caseId,arm,expected:c.expected,baseline:triage(c.alert).verdict,output,error,raw,latencyMs:Math.round(performance.now()-start)};rows.push(row);fs.writeFileSync(dir+'/'+c.caseId+'-'+arm+'.json',JSON.stringify(row,null,2));console.log(c.caseId,arm,output?.verdict??'INVALID',error??'');
}
const summary=Object.fromEntries(['generic','policy'].map(arm=>{const r=rows.filter(x=>x.arm===arm);return [arm,{n:r.length,valid:r.filter(x=>x.output).length,correct:r.filter(x=>x.output?.verdict===x.expected).length,pairs:cases.filter(x=>x.pair).map(c=>{const a=r.find(x=>x.caseId===c.pair),b=r.find(x=>x.caseId===c.caseId);return {base:c.pair,perturbed:c.caseId,bothValid:!!a.output&&!!b.output,sameVerdict:!!a.output&&!!b.output&&a.output.verdict===b.output.verdict};})}];}));fs.writeFileSync(dir+'/summary.json',JSON.stringify(summary,null,2));console.log(dir,JSON.stringify(summary));
