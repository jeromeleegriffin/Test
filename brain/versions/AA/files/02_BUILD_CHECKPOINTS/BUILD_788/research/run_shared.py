import sys,random,json,time,hashlib,pathlib,statistics,ctypes as C,inspect,types
ROOT=pathlib.Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT/'original'/'src'))
from tournament import Adapter,ReplayDeal,verify_freeze
from challenger import Challenger,ID,CARDS,mask,arr
from load_champion import lab,Sol7
from run_partner import PROXIES
# A laboratory-only copy of the verified game loop, modified solely to make
# the current partner hand available to the experimental adapter at decision time.
source=inspect.getsource(lab.play_hand)
needle='before=list(hands[s]); c=order[s].play(hands[s],trick,tr,seen,s,ctx)'
assert source.count(needle)==1
source=source.replace(needle,'order[s].partner_hand=tuple(hands[(s+2)%4]); '+needle)
ns={**lab.__dict__};exec(source,ns);play_hand_shared=ns['play_hand']
LIB=C.CDLL(str(ROOT/'rollout_shared.so'))
P=C.POINTER(C.c_int);U=C.c_uint64
LIB.x1_choose_shared.argtypes=[P,C.c_int,P,P,C.c_int,C.c_int,C.c_int,C.c_int,C.c_int,P,U,U,P,U,C.c_int,U,C.POINTER(C.c_double)]
LIB.x1_choose_shared.restype=C.c_int
class SharedX1(Challenger):
 name='X1-SHARED-HAND-EXPERIMENT'
 def play(self,h,trick,tr,seen,seat,ctx):
  L=lab.legal(h,trick,tr)
  if len(L)==1:return L[0]
  ph=getattr(self,'partner_hand',None)
  assert ph is not None and len(ph)==len(h) - (1 if (seat+2)%4 in [s for s,c in trick] else 0), 'partner hand length unexpected'
  played=mask(ctx['played_cards']);nest=mask(ctx['nest_cards']) if seat==ctx['bidder'] else 0
  voids=[sum(1<<lab.COLORS.index(v) for v in s) for s in ctx['known_voids']]
  hid=[ID[c] for c in h];tc=[ID[c] for s,c in trick];ts=[s for s,c in trick]
  payload=[hid,tc,ts,tr,seat,ctx['bidder'],ctx['bid'],ctx['captured_points'],played,nest,voids]
  seed=int.from_bytes(hashlib.sha256(json.dumps(payload,separators=(',',':')).encode()).digest()[:8],'little')
  samples=256 if len(h)<=3 else 128;out=(C.c_double*12)()
  result=LIB.x1_choose_shared(arr(hid),len(h),arr(tc),arr(ts),len(trick),lab.COLORS.index(tr),seat,ctx['bidder'],ctx['bid'],arr(ctx['captured_points']),played,nest,arr(voids),seed,samples,mask(ph),out)
  if result<0:raise RuntimeError(f'shared sampler failed {result}')
  card=CARDS[result];assert card in L
  self.searches+=1;self.samples+=int(out[0]);self.rollouts+=int(out[0]*out[1]);self.changed+=int(out[7]);self.swap_accepts+=int(out[5]);self.swap_proposals+=int(out[6])
  return card

def play(deck,dealer,proxy_cls,shared,seat):
 logs=[];bots=[]
 for s in range(4):
  if s==seat:b=SharedX1() if shared else Challenger()
  elif s==(seat+2)%4:b=proxy_cls()
  else:b=Sol7()
  bots.append(b)
 order=[Adapter(b,i,logs) for i,b in enumerate(bots)]
 # Adapter forwards only the usual context. The partner hand is passed separately
 # and exclusively to the one experimental bot, never to the other seats.
 class SharedAdapter(Adapter):
  def play(self,h,trick,tr,seen,seat,ctx):
   self.bot.partner_hand=self.partner_hand
   return super().play(h,trick,tr,seen,seat,ctx)
 order[seat]=SharedAdapter(bots[seat],seat,logs)
 r=play_hand_shared(ReplayDeal(deck),order,dealer,[0,0]);b=bots[seat]
 return {'margin':r['delta'][seat%2]-r['delta'][1-seat%2], 'points':r['points'][seat%2],'made':r['made'],'bidder':r['bidder'],'bid':r['bid'],'searches':b.searches}

def main():
 verify_freeze();rows=[];start=time.time()
 for style,(name,cls) in enumerate(PROXIES.items()):
  for i in range(1250):
   seed=202803170000+style*1000+i;deck=lab.deck();random.Random(seed).shuffle(deck)
   dealer=i%4;seat=i%4
   a=play(deck,dealer,cls,False,seat);b=play(deck,dealer,cls,True,seat)
   rows.append({'style':name,'seed':seed,'dealer':dealer,'seat':seat,'x1':a,'shared':b,'margin_delta':b['margin']-a['margin']})
  print('completed',name,'elapsed',round(time.time()-start,1),flush=True)
 (ROOT/'fresh_results.json').write_text(json.dumps(rows,indent=1))
 summary={}
 for name in list(PROXIES)+['overall']:
  subset=rows if name=='overall' else [r for r in rows if r['style']==name];d=[r['margin_delta'] for r in subset]
  summary[name]={'pairs':len(d),'shared_better':sum(x>0 for x in d),'frozen_better':sum(x<0 for x in d),'tied':sum(x==0 for x in d),'mean_margin_change':round(statistics.mean(d),3)}
 summary['elapsed_seconds']=round(time.time()-start,2)
 (ROOT/'fresh_summary.json').write_text(json.dumps(summary,indent=2));print(json.dumps(summary,indent=2))
if __name__=='__main__':main()
