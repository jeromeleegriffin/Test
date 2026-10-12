'use strict';
importScripts('core.js','sha256.js');
self.onmessage=function(e){let {id,v,payload}=e.data;try{let bytes=x1SHA256(payload),seed=0n;for(let i=7;i>=0;i--)seed=(seed<<8n)|BigInt(bytes[i]);v.seed=String(seed);let t=performance.now(),r=X1Core.choose(v);self.postMessage({id,...r,seed:String(seed),ms:performance.now()-t});}catch(e){self.postMessage({id,error:String(e)});}};
self.postMessage({ready:true});
