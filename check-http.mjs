import test from 'node:test';
import assert from 'node:assert/strict';
// Run separately against npm start, to exercise HTTP boundaries without inference.
for(const [name,url,options,expected] of [
 ['cross-origin model request','/api/draft?id=SOC-1042',{method:'POST',headers:{Origin:'https://example.com'}},403],
 ['missing origin','/api/draft?id=SOC-1042',{method:'POST'},403],
 ['unknown fixture','/api/draft?id=unknown',{method:'POST',headers:{Origin:'http://127.0.0.1:4173'}},400],
 ['wrong method','/api/draft',{},405],
 ['local interface','/ai',{},200]
]) { const response=await fetch('http://127.0.0.1:4173'+url,options);assert.equal(response.status,expected,name);console.log('PASS '+name); }
