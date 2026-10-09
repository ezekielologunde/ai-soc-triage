import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {alerts} from './dist/engine.js';
import {draftAlert} from './ollama.mjs';
const root=path.resolve('dist');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css'};
let busy=false;
http.createServer(async(req,res)=>{
 const reply=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
 if(!['127.0.0.1:4173','localhost:4173'].includes(req.headers.host))return reply(403,{error:'Invalid host'});
 let url;try{url=new URL(req.url,'http://localhost');}catch{return reply(400,{error:'Invalid URL'});}
 if(url.pathname==='/api/draft'){
  if(req.method!=='POST')return reply(405,{error:'POST required'});
  if(req.headers.origin!==`http://${req.headers.host}`)return reply(403,{error:'Same-origin request required'});

  const alert=alerts.find(a=>a.id===url.searchParams.get('id'));
  if(!alert)return reply(400,{error:'Unknown synthetic alert'});
  if(busy)return reply(429,{error:'Model is busy. Retry after the current draft finishes.'});
  busy=true;try{reply(200,await draftAlert(alert));}catch(error){reply(502,{error:error.message});}finally{busy=false;}return;
 }
 if(req.method!=='GET')return reply(405,{error:'GET required'});
 let file;try{file=url.pathname==='/ai'?path.resolve('local-ai.html'):path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));}catch{return reply(400,{error:'Invalid path'});}
 if(url.pathname!=='/ai'&&!file.startsWith(root+path.sep))return reply(403,{error:'Forbidden'});
 fs.readFile(file,(error,data)=>{if(error)return reply(404,{error:'Not found'});res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(data);});
}).listen(4173,'127.0.0.1',()=>console.log('Demo: http://127.0.0.1:4173 | Local AI: http://127.0.0.1:4173/ai'));
