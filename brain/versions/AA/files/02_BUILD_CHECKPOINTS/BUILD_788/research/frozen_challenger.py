"""CHALLENGER-X1. Frozen Sol7 auction/nest policy; new sampled-play search."""
import ctypes as C, hashlib, json, pathlib
from load_champion import Sol7, lab, ROOT
CARDS=lab.deck(); ID={c:i for i,c in enumerate(CARDS)}
def arr(xs):return (C.c_int*len(xs))(*xs)
def mask(cards):return sum(1<<ID[c] for c in set(cards))
LIB=C.CDLL(str(ROOT/'src/rollout.so'))
P=C.POINTER(C.c_int); U=C.c_uint64
LIB.x1_choose.argtypes=[P,C.c_int,P,P,C.c_int,C.c_int,C.c_int,C.c_int,C.c_int,P,U,U,P,U,C.c_int,C.POINTER(C.c_double)]
LIB.x1_choose.restype=C.c_int
LIB.sol7_public.argtypes=[P,C.c_int,P,P,C.c_int,C.c_int,U,U,C.c_int];LIB.sol7_public.restype=C.c_int
class Challenger(Sol7):
    name='CHALLENGER-X1'
    def __init__(self):self.searches=0;self.samples=0;self.rollouts=0;self.changed=0;self.swap_accepts=0;self.swap_proposals=0
    def play(self,h,trick,tr,seen,seat,ctx):
        L=lab.legal(h,trick,tr)
        if len(L)==1:return L[0]
        played=mask(ctx['played_cards']); nest=mask(ctx['nest_cards']) if seat==ctx['bidder'] else 0
        voids=[sum(1<<lab.COLORS.index(v) for v in s) for s in ctx['known_voids']]
        hid=[ID[c] for c in h]; tc=[ID[c] for s,c in trick]; ts=[s for s,c in trick]
        # This seed contains public/own information only. Never use the deal RNG.
        payload=[hid,tc,ts,tr,seat,ctx['bidder'],ctx['bid'],ctx['captured_points'],played,nest,voids]
        seed=int.from_bytes(hashlib.sha256(json.dumps(payload,separators=(',',':')).encode()).digest()[:8],'little')
        samples=256 if len(h)<=3 else 128
        out=(C.c_double*12)()
        result=LIB.x1_choose(arr(hid),len(h),arr(tc),arr(ts),len(trick),lab.COLORS.index(tr),seat,ctx['bidder'],ctx['bid'],arr(ctx['captured_points']),played,nest,arr(voids),seed,samples,out)
        if result<0:raise RuntimeError(f'X1 sampling failure {result}: {payload}')
        card=CARDS[result]
        if card not in L:raise RuntimeError('Native search returned an illegal move')
        self.searches+=1;self.samples+=int(out[0]);self.rollouts+=int(out[0]*out[1]);self.changed+=int(out[7]);self.swap_accepts+=int(out[5]);self.swap_proposals+=int(out[6])
        return card
