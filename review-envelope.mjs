import {triage} from './dist/engine.js';
export function reviewEnvelope(alert,draft){
 const rule=triage(alert);
 return {alertId:alert.id,priority:rule.verdict,rule:rule.rule,ruleReason:rule.reason,evidence:alert.evidence,draft,disagreement:draft.verdict!==rule.verdict,factuality:'Not verified',reviewRequired:true};
}
