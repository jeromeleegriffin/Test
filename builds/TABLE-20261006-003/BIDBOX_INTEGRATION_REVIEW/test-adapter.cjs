const fs=require('fs'),vm=require('vm'),assert=require('assert');
let mutations=0;class Node{
 constructor(tag='div'){this.tagName=tag;this.nodeType=1;this.childNodes=[];this.attrs={};this.tokens=new Set();this.listeners={};this.classList={contains:n=>this.tokens.has(n),add:n=>{this.tokens.add(n);mutations++;},remove:n=>{this.tokens.delete(n);mutations++;}};}
 set className(v){this.tokens=new Set(v.split(/\s+/));}get children(){return this.childNodes.filter(n=>n.nodeType===1);}get firstChild(){return this.childNodes[0]||null;}
 setAttribute(k,v){this.attrs[k]=v;}appendChild(n){if(n.parent)n.parent.childNodes.splice(n.parent.childNodes.indexOf(n),1);n.parent=this;this.childNodes.push(n);mutations++;return n;}
 insertBefore(n,b){if(n.parent)n.parent.childNodes.splice(n.parent.childNodes.indexOf(n),1);n.parent=this;this.childNodes.splice(this.childNodes.indexOf(b),0,n);mutations++;}
 remove(){this.parent.childNodes.splice(this.parent.childNodes.indexOf(this),1);this.parent=null;mutations++;}
}
const dock=new Node();dock.className='decision-mode-bid';const originals=['title','name','meta','stepper','actions'].map(n=>{const e=new Node();e.id=n;e.onclick=()=>n;dock.appendChild(e);return e;});
let callback,orientationCallback;const media={matches:true,addEventListener:(n,f)=>orientationCallback=f};
const ctx=vm.createContext({document:{readyState:'complete',getElementById:()=>dock,createElement:t=>new Node(t)},window:{matchMedia:()=>media},MutationObserver:class{constructor(f){callback=f;}observe(){}}});
vm.runInContext(fs.readFileSync('candidate/Rook710/approved-bid-portrait.js','utf8'),ctx);
assert.equal(dock.children.length,1);const surface=dock.firstChild;assert(surface.classList.contains('approved-bid-surface'));assert.deepStrictEqual(surface.childNodes.slice(1),originals);assert.equal(surface.firstChild.src,'assets/bidbox-approved/bidbox_complete_blank.png');
let before=mutations;callback();assert.equal(mutations,before,'Observer must settle without mutation loop');
for(let hand=0;hand<20;hand++){
 media.matches=false;orientationCallback();assert.deepStrictEqual(dock.childNodes,originals);assert(!dock.classList.contains('approved-bid-portrait'));before=mutations;callback();assert.equal(mutations,before);
 media.matches=true;orientationCallback();assert.equal(dock.children.length,1);assert.deepStrictEqual(dock.firstChild.childNodes.slice(1),originals);
 dock.classList.add('hidden');callback();assert.deepStrictEqual(dock.childNodes,originals);dock.classList.remove('hidden');callback();
}
for(const n of originals)assert.equal(n.onclick(),n.id);
dock.classList.remove('decision-mode-bid');dock.classList.add('decision-mode-trump');callback();assert.deepStrictEqual(dock.childNodes,originals);assert(!dock.classList.contains('approved-bid-portrait'));
console.log('Adapter identity, one surface, 20 repeated hide/reopen/orientation cycles, landscape unwrap, trump teardown and observer settling: passed');
