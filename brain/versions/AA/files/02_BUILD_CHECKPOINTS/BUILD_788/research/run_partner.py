import sys,random,json,time,hashlib,pathlib,statistics
ROOT=pathlib.Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT/'original'/'src'))
from tournament import Adapter,ReplayDeal,verify_freeze
from challenger import Challenger
from load_champion import lab,Sol7
class Partner(Challenger):
 name='X1-PARTNER-01'
 def __init__(self):
  super().__init__();self.overrides=0;self.feed_overrides=0
 def play(self,h,trick,tr,seen,seat,ctx):
  choice=super().play(h,trick,tr,seen,seat,ctx)
  if len(trick)!=3 or lab.winner(trick,tr)!=(seat+2)%4:return choice
  legal=lab.legal(h,trick,tr)
  safe=[x for x in legal if lab.winner(trick+[(seat,x)],tr)==(seat+2)%4]
  if not safe:return choice
  # Trial hypothesis: when last to act and partner is winning, retain lead for partner,
  # and contribute counters that partner can safely capture.
  feed=[x for x in safe if x not in (('rook',99),('red',2)) and lab.pts(x)>0]
  if feed:
   target=max(feed,key=lambda x:(lab.pts(x),-lab.rank(x)))
   if choice!=target:self.feed_overrides+=1
  else:target=lab.lowcard(safe,tr)
  if target!=choice:self.overrides+=1
  return target

PROXIES={'Sol7':Sol7,'Extreme':lab.Extreme,'Meridian':lab.Meridian,'Corvus':lab.Corvus}
def play(deck,dealer,proxy_cls,use_partner,team):
 logs=[]; bots=[]
 for seat in range(4):
  if seat==team: b=Partner() if use_partner else Challenger()
  elif seat==(team+2)%4:b=proxy_cls()
  else:b=Sol7()
  bots.append(b)
 order=[Adapter(b,i,logs) for i,b in enumerate(bots)]
 r=lab.play_hand(ReplayDeal(deck),order,dealer,[0,0]); p=bots[team]
 return {'margin':r['delta'][team%2]-r['delta'][1-team%2], 'points':r['points'][team%2], 'made':r['made'],'bidder':r['bidder'],'bid':r['bid'],'overrides':getattr(p,'overrides',0),'feed_overrides':getattr(p,'feed_overrides',0),'searches':p.searches}

def main():
 verify_freeze(); rows=[]; started=time.time()
 for style,(name,cls) in enumerate(PROXIES.items()):
  for i in range(100):
   seed=202611150000+style*1000+i
   cards=lab.deck();random.Random(seed).shuffle(cards)
   dealer=i%4; team=i%4
   a=play(cards,dealer,cls,False,team)
   b=play(cards,dealer,cls,True,team)
   rows.append({'style':name,'seed':seed,'dealer':dealer,'seat':team,'x1':a,'partner':b,'margin_delta':b['margin']-a['margin']})
  print('completed',name, 'elapsed',round(time.time()-started,1),flush=True)
 p=ROOT/'results.json';p.write_text(json.dumps(rows,indent=1))
 summary={}
 for name in PROXIES:
  subset=[r for r in rows if r['style']==name]; d=[r['margin_delta'] for r in subset]
  summary[name]={'pairs':len(subset),'better':sum(x>0 for x in d),'worse':sum(x<0 for x in d),'tied':sum(x==0 for x in d),'mean_margin_change':round(statistics.mean(d),3),'overrides':sum(x['partner']['overrides'] for x in subset),'feed_overrides':sum(x['partner']['feed_overrides'] for x in subset)}
 all_d=[r['margin_delta'] for r in rows]
 summary['overall']={'pairs':len(rows),'better':sum(x>0 for x in all_d),'worse':sum(x<0 for x in all_d),'tied':sum(x==0 for x in all_d),'mean_margin_change':round(statistics.mean(all_d),3),'elapsed_seconds':round(time.time()-started,2),'source_sha256':hashlib.sha256((ROOT/'original/src/challenger.py').read_bytes()).hexdigest()}
 (ROOT/'summary.json').write_text(json.dumps(summary,indent=2));print(json.dumps(summary,indent=2))
if __name__=='__main__':main()
