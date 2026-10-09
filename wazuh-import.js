export function importWazuh(text){
 if(typeof text!=='string'||new TextEncoder().encode(text).length>1048576)throw Error('Limit: 1 MiB');
 let input;try{input=JSON.parse(text);}catch{try{input=text.split(/\r?\n/).filter(x=>x.trim()).map(x=>JSON.parse(x));}catch{throw Error('Invalid JSON or JSONL. No records imported.');}}
 const rows=Array.isArray(input)?input:[input];if(!rows.length||rows.length>500)throw Error('Provide 1 to 500 records');
 return rows.map((a,i)=>{
  if(!a||typeof a!=='object'||Array.isArray(a)||!a.rule||!Number.isInteger(a.rule.level)||a.rule.level<0||a.rule.level>16||!/^\d{1,10}$/.test(String(a.rule.id)))throw Error('Invalid rule metadata at record '+(i+1)+'. No records imported.');
  // Deliberately retain only constrained numeric metadata. No free text survives.
  return {id:'IMPORT-'+String(i+1).padStart(3,'0'),ruleId:String(a.rule.id),sourceLevel:a.rule.level,priority:'Needs investigation',status:'Open',reviewNote:'',retainedFields:['rule.id','rule.level'],omitted:'All other fields, including timestamps, agent identity, addresses, narrative, full_log and nested data',limitation:'Metadata-only record. Consult original evidence locally; no semantic detection mapping or AI assessment.'};
 });
}
export function reviewImported(record,status,note){
 if(!['Open','Investigating','Reviewed'].includes(status))throw Error('Invalid status');
 if(typeof note!=='string'||!note.trim()||note.length>1500)throw Error('Provide a review note of 1 to 1500 characters');
 return {...record,status,reviewNote:note.trim(),priority:'Needs investigation'};
}
