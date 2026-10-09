import test from 'node:test';import assert from 'node:assert/strict';
import {reviewEnvelope} from '../review-envelope.mjs';import {alerts} from '../dist/engine.js';
test('model cannot overwrite authoritative rule priority or factuality',()=>{
 const result=reviewEnvelope(alerts[0],{verdict:'Routine',priority:'Routine',factuality:'Verified'});
 assert.equal(result.priority,'Escalate');assert.equal(result.disagreement,true);assert.equal(result.factuality,'Not verified');assert.equal(result.reviewRequired,true);
});
test('agreement never implies factual verification',()=>{
 const result=reviewEnvelope(alerts[0],{verdict:'Escalate'});assert.equal(result.disagreement,false);assert.equal(result.factuality,'Not verified');
});
