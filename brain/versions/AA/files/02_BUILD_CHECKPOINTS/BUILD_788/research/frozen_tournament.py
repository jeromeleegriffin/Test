"""Audited wrapper around the byte-unchanged historical hand/auction engine."""
import copy, hashlib, json, pathlib, random, time, types
from load_champion import lab, Sol7, ROOT
from challenger import Challenger
def immutable(x):
    if isinstance(x,dict):return types.MappingProxyType({k:immutable(v) for k,v in x.items()})
    if isinstance(x,(tuple,list)):return tuple(immutable(v) for v in x)
    if isinstance(x,set):return frozenset(x)
    return x
ALLOWED={
 'ceiling':{'seat','dealer','team_scores','high','bidder','bid_history'},
 'trump':{'seat','team_scores'},
 'discard':{'seat','team_scores','bid'},
 'play':{'team_scores','bid','bidder','trick_no','known_voids','captured_points','captured_cards','played_cards','nest_cards','nest_goes_to'}
}
class Adapter:
    def __init__(self,bot,seat,log):self.bot=bot;self.name=bot.name;self.seat=seat;self.log=log
    def invoke(self,method,h,ctx,*args):
        assert set(ctx)==ALLOWED[method],(method,set(ctx))
        assert len(set(h))==len(h)
        if method=='play':
            assert not ctx['nest_cards'] or self.seat==ctx['bidder']
            assert len(ctx['nest_cards'])==(6 if self.seat==ctx['bidder'] else 0)
            # The frozen policy concatenates trick + [(seat, card)], so retain
            # a detached list here instead of changing its interface to tuple.
            result_args=(immutable(h),copy.deepcopy(args[0]),args[1],immutable(args[2]),self.seat,immutable(ctx))
        elif method=='discard':result_args=(immutable(h),args[0],args[1],immutable(ctx))
        else:result_args=(immutable(h),immutable(ctx))
        start=time.perf_counter_ns(); result=getattr(self.bot,method)(*result_args); elapsed=time.perf_counter_ns()-start
        if method=='ceiling':assert isinstance(result,int) and 0<=result<=200 and result%5==0
        elif method=='trump':assert result in lab.COLORS
        elif method=='discard':assert len(result)==10 and len(set(result))==10 and set(result)<=set(h)
        else:assert result in lab.legal(h,args[0],args[1])
        row={'phase':method,'seat':self.seat,'bot':self.name,'result':result,'ns':elapsed}
        if method=='ceiling':row.update(high=ctx['high'],bidder=ctx['bidder'])
        if method=='play':row.update(trick_no=ctx['trick_no'],position=len(args[0]))
        self.log.append(row)
        return result
    def ceiling(self,h,ctx):return self.invoke('ceiling',h,ctx)
    def trump(self,h,ctx=None):return self.invoke('trump',h,ctx)
    def discard(self,h,n,tr,ctx):return list(self.invoke('discard',h,ctx,n,tr))
    def play(self,h,trick,tr,seen,seat,ctx):assert seat==self.seat;return self.invoke('play',h,ctx,trick,tr,seen)
class ReplayDeal:
    def __init__(self,cards):self.cards=[tuple(c) for c in cards];self.calls=0
    def shuffle(self,d):
        assert set(d)==set(self.cards) and len(d)==len(self.cards)==46
        self.calls+=1;assert self.calls==1;d[:]=self.cards
def play(cards,dealer,xteam):
    log=[]; raw=[Challenger() if s%2==xteam else Sol7() for s in range(4)]
    order=[Adapter(b,s,log) for s,b in enumerate(raw)]
    result=lab.play_hand(ReplayDeal(cards),order,dealer,[0,0])
    metrics={k:sum(getattr(b,k) for b in raw if isinstance(b,Challenger)) for k in ('searches','samples','rollouts','changed','swap_accepts','swap_proposals')}
    return {'challenger_team':xteam,'dealer':dealer,'result':result,'decisions':log,'search':metrics}
def deterministic(row):
    q=copy.deepcopy(row)
    for z in q['decisions']:z.pop('ns',None)
    return q
def digest(row):return hashlib.sha256(json.dumps(deterministic(row),sort_keys=True,separators=(',',':')).encode()).hexdigest()
def verify_freeze():
    f=json.loads((ROOT/'FREEZE.json').read_text())
    for file,expected in f['sha256'].items():assert hashlib.sha256((ROOT/file).read_bytes()).hexdigest()==expected,('Frozen file changed',file)
    return f
