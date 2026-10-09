import {importWazuh} from './wazuh-import.js';
export function restoreWorkspace(text){
 if(typeof text!=='string'||new TextEncoder().encode(text).length>2097152)throw Error('Workspace limit: 2 MiB');
 let value;try{value=JSON.parse(text);}catch{throw Error('Invalid workspace JSON');}
 if(!value||!Array.isArray(value.cases)||!value.cases.length||value.cases.length>500)throw Error('Workspace must contain 1 to 500 cases');
 const ids=new Set();
 const cases=value.cases.map(r=>{
  if(!r||typeof r.id!=='string'||!/^IMPORT-\d{3}$/.test(r.id)||ids.has(r.id))throw Error('Invalid or duplicate case ID');ids.add(r.id);
  if(!['Open','Investigating','Reviewed'].includes(r.status)||typeof r.reviewNote!=='string'||r.reviewNote.length>1500||(r.status!=='Open'&&!r.reviewNote.trim()))throw Error('Invalid case review');
  const clean=importWazuh(JSON.stringify({rule:{id:r.ruleId,level:r.sourceLevel}}))[0];
  const e=r.evidence??{};if(typeof e!=='object'||Array.isArray(e))throw Error('Invalid evidence');const evidence={};
  for(const [key,v] of Object.entries(e)){
   const valid=key==='protocol'?['TCP','UDP','ICMP'].includes(v):key==='destinationPort'?Number.isInteger(v)&&v>=0&&v<=65535:key==='eventCount'?Number.isSafeInteger(v)&&v>=0:key==='hostAlias'?typeof v==='string'&&/^host-\d{1,3}$/.test(v):false;
   if(!valid)throw Error('Invalid evidence field');evidence[key]=v;
  }
  return {...clean,id:r.id,status:r.status,reviewNote:r.reviewNote,evidence,retainedFields:['rule.id','rule.level',...Object.keys(evidence).map(k=>'evidence.'+k)]};
 });
 const p=value.provenance;let provenance=null;
 if(p!=null){if(typeof p.sourceSha256!=='string'||! /^[a-f0-9]{64}$/.test(p.sourceSha256)||!Array.isArray(p.selectedFields)||p.selectedFields.some(f=>!['protocol','destinationPort','eventCount','hostAlias'].includes(f))||typeof p.importedAt!=='string'||!Number.isFinite(Date.parse(p.importedAt)))throw Error('Invalid provenance');provenance={schemaVersion:2,sourceSha256:p.sourceSha256,selectedFields:p.selectedFields,importedAt:p.importedAt,scope:'Restored, self-reported provenance; not independently verified'};}
 return {cases,provenance};
}
