import {alerts} from './dist/engine.js';
import {draftAlert} from './ollama.mjs';
const alert=alerts.find(a=>a.id===process.argv[2]);
if(!alert) { console.error('Usage: node draft-local.mjs SOC-1042');process.exitCode=1; }
else { try { console.log(JSON.stringify(await draftAlert(alert),null,2)); } catch(error) { console.error(error.message);process.exitCode=1; } }
