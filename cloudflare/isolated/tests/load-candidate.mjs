import fs from 'node:fs';
const source=fs.readFileSync(new URL('../worker-candidate.mjs',import.meta.url),'utf8').replace('import { DurableObject } from "cloudflare:workers";', 'class DurableObject { constructor(ctx,env) {this.ctx=ctx;this.env=env;} }')+'\nexport { RoomService, applyBid, createMatch, finishHand, safeOptions, makeDeck };\n';
export const {RoomService,RoomDO,injectCloudGameAdapter,consumeRoomSocketTicket,applyBid,createMatch,finishHand,safeOptions,makeDeck}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
