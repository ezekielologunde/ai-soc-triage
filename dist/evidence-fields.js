export const supportedFields=['protocol','destinationPort','eventCount','hostAlias'];
export function selectedEvidence(alert,fields,aliases){
 if(fields.some(f=>!supportedFields.includes(f)))throw Error('Unsupported field selection');
 const evidence={};const d=alert.data??{};
 if(fields.includes('protocol')&&typeof d.protocol==='string'&&['TCP','UDP','ICMP'].includes(d.protocol.toUpperCase()))evidence.protocol=d.protocol.toUpperCase();
 if(fields.includes('destinationPort')&&/^\d{1,5}$/.test(String(d.dstport))&&Number(d.dstport)<=65535)evidence.destinationPort=Number(d.dstport);
 if(fields.includes('eventCount')&&Number.isSafeInteger(alert.rule.firedtimes)&&alert.rule.firedtimes>=0)evidence.eventCount=alert.rule.firedtimes;
 if(fields.includes('hostAlias')&&typeof alert.agent?.id==='string'&&alert.agent.id.length<=128){if(!aliases.has(alert.agent.id))aliases.set(alert.agent.id,'host-'+(aliases.size+1));evidence.hostAlias=aliases.get(alert.agent.id);}
 return evidence;
}
export async function provenance(text,fields){const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return {schemaVersion:2,sourceSha256:Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join(''),selectedFields:fields,importedAt:new Date().toISOString(),scope:'Local import; hash identifies input bytes, not authenticity; aliases scoped to batch'};}
