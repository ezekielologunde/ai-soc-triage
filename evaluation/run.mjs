import fs from 'node:fs';import crypto from 'node:crypto';
import {draftAlert} from '../ollama.mjs';import {triage} from '../dist/engine.js';
const files=['evaluation/cases.json','evaluation/PROTOCOL.md','ollama.mjs','dist/engine.js'];
const hashes=Object.fromEntries(files.map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')]));
const directory='evaluation/run-'+new Date().toISOString().replace(/[:.]/g,'-');fs.mkdirSync(directory);
const models=await (await fetch('http://127.0.0.1:11434/api/tags')).json();
fs.writeFileSync(directory+'/manifest.json',JSON.stringify({started:new Date().toISOString(),hashes,models,model:'qwen2.5:3b',attemptsPerCase:1},null,2));
const rows=[];
for(const c of JSON.parse(fs.readFileSync(files[0],'utf8'))){
 let raw=null,output=null,error=null;const start=performance.now();
 try{output=await draftAlert(c.alert,{model:'qwen2.5:3b',fetchImpl:async(...args)=>{const response=await fetch(...args);raw=await response.clone().text();return response;}});}catch(e){error=e.message;}
 const row={id:c.id,expected:c.expected,baseline:triage(c.alert).verdict,output,error,raw,latencyMs:Math.round(performance.now()-start)};rows.push(row);
 fs.writeFileSync(directory+'/'+c.id+'.json',JSON.stringify(row,null,2));console.log(c.id,output?.verdict??'INVALID',error??'');
}
const summary={n:rows.length,valid:rows.filter(r=>r.output).length,modelCorrect:rows.filter(r=>r.output?.verdict===r.expected).length,baselineCorrect:rows.filter(r=>r.baseline===r.expected).length,recall:Object.fromEntries(['Escalate','Investigate','Routine'].map(v=>[v,{correct:rows.filter(r=>r.expected===v&&r.output?.verdict===v).length,total:rows.filter(r=>r.expected===v).length}])),scope:'Authored synthetic policy agreement; not independent accuracy',factuality:'Pending manual review'};
fs.writeFileSync(directory+'/summary.json',JSON.stringify(summary,null,2));console.log(directory,JSON.stringify(summary));
