import fs from 'node:fs';
// Local simulation only: retain reducer/service bytes; substitute the platform base class.
const source=fs.readFileSync(new URL('./deployed-worker.snapshot.mjs',import.meta.url),'utf8')
.replace('import { DurableObject } from "cloudflare:workers";', 'class DurableObject { constructor(ctx,env) {this.ctx=ctx;this.env=env;} }')
+'\nexport { RoomService };\n';
export const {RoomService}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
