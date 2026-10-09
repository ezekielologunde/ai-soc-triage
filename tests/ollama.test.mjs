import test from 'node:test';
import assert from 'node:assert/strict';
import {alerts} from '../dist/engine.js';
import {draftAlert,validateDraft} from '../ollama.mjs';
const valid={verdict:'Investigate',summary:'Review the supplied events.',citations:['AUTH-01'],limitations:'MFA context unavailable.'};
test('model output rejects invented references and action fields',()=>{
 assert.throws(()=>validateDraft({...valid,citations:['FAKE']},alerts[0]));
 assert.throws(()=>validateDraft({...valid,action:'close'},alerts[0]));
 assert.throws(()=>validateDraft({...valid,summary:''},alerts[0]));
 assert.equal(validateDraft(valid,alerts[0]).reviewRequired,true);
});
test('adapter excludes answer labels and exposes no model tools',async()=>{
 const result=await draftAlert(alerts[0],{model:'test',fetchImpl:async(url,options)=>{
  assert.equal(url,'http://127.0.0.1:11434/api/chat');
  const body=JSON.parse(options.body);assert.equal(body.tools,undefined);
  assert.equal(JSON.parse(body.messages[1].content).expected,undefined);
  return {ok:true,json:async()=>({message:{content:JSON.stringify(valid)}})};
 }});assert.equal(result.reviewRequired,true);
});
test('model failures are not disguised as successful AI output',async()=>{
 await assert.rejects(draftAlert(alerts[0],{model:'test',fetchImpl:async()=>({ok:false,status:503})}));
 await assert.rejects(draftAlert(alerts[0],{model:'test',fetchImpl:async()=>({ok:true,json:async()=>({message:{content:'bad json'}})})}));
});
