import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { WebSocketServer } from 'ws';
import { RoomDO, injectCloudGameAdapter, consumeRoomSocketTicket } from './load-candidate.mjs';
const root=path.resolve(new URL('../../../',import.meta.url).pathname);
const rooms=new Map(), contexts=new Map();
const storage=()=>{const m=new Map();return {async get(k){return structuredClone(m.get(k))},async put(k,v){m.set(k,structuredClone(v))},async delete(k){return m.delete(k)},async setAlarm(){},async deleteAlarm(){}}};
const getRoom=code=>{if(!rooms.has(code)){const ctx={storage:storage(),id:{toString:()=>"DO-"+code},getWebSockets:()=>ctx.sockets, sockets:[]};contexts.set(code,ctx);rooms.set(code,new RoomDO(ctx,{}))}return rooms.get(code)};
const types={'.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.mp3':'audio/mpeg','.ogg':'audio/ogg','.wav':'audio/wav','.wasm':'application/wasm'};
const server=http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost:8080');let body='';for await(const c of req)body+=c;
if(u.pathname==='/rooms'||u.pathname.startsWith('/rooms/')){let code,route;if(u.pathname==='/rooms'){code=crypto.randomUUID().replaceAll('-','').slice(0,8).toUpperCase();route='create'}else [, ,code,route]=u.pathname.split('/');const r=await getRoom(code).fetch(new Request('http://local/'+route,{method:req.method,headers:req.headers,...(body?{body}:{} )}));const text=await r.text();res.writeHead(r.status,{'Content-Type':'application/json'});res.end(route==='create'?JSON.stringify({...JSON.parse(text),roomCode:code}):text);return;}
if(u.pathname==='/cloud-game/game'){let html=await fs.readFile(root+'/index.html','utf8');html=injectCloudGameAdapter(html);const adapter=await fs.readFile(root+'/cloudflare/isolated/846-cloud-game-adapter-candidate.js','utf8');html=html.replace(/<script>\s*\/\*\n \* Build-797[\s\S]*?<\/script>/,`<script>${adapter}</script>`);res.writeHead(200,{'Content-Type':'text/html'});res.end(html);return;}
let file=path.resolve(root,'.'+u.pathname.replace('/cloud-game/assets',''));if(!file.startsWith(root+'/'))throw Error('bad path');const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data);
}catch(e){res.writeHead(404);res.end(e.message)}});
const wss=new WebSocketServer({noServer:true});
server.on('upgrade',async(req,socket,head)=>{try{
 const u=new URL(req.url,'http://localhost');const [, ,code,route]=u.pathname.split('/');if(route!=='ws')throw Error('not ws');
 const room=getRoom(code),ctx=contexts.get(code);const record=await consumeRoomSocketTicket(ctx.storage,u.searchParams.get('ticket'),ctx.id.toString());if(!record)throw Error('invalid ticket');
 wss.handleUpgrade(req,socket,head,async ws=>{ws.deserializeAttachment=()=>({seat:record.seat,seatToken:record.seatToken});ctx.sockets.push(ws);ws.on('close',()=>{ctx.sockets=ctx.sockets.filter(s=>s!==ws)});ws.send(JSON.stringify({type:'snapshot',snapshot:await room.service.snapshot(ctx.id.toString(),record.seatToken)}));});
}catch{socket.destroy()}});
server.listen(8080,'127.0.0.1',()=>console.log('Isolated local server 8080'));
