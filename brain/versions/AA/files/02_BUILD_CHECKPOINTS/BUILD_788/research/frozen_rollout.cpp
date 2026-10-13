// CHALLENGER-X1: information-set Monte Carlo policy improvement.
// No actual hidden hands or deal seed enter the exported decision interface.
#include <algorithm>
#include <array>
#include <cmath>
#include <cstdint>
#include <cstring>
#include <vector>
using U=uint64_t;
constexpr U FULL=(1ULL<<46)-1;
struct RNG { U x; U next(){x+=0x9e3779b97f4a7c15ULL; U z=x;z=(z^(z>>30))*0xbf58476d1ce4e5b9ULL;z=(z^(z>>27))*0x94d049bb133111ebULL;return z^(z>>31);} int n(int k){return int(next()%k);} };
int col(int c){return c<40?c/10:c<44?c-40:c==44?1:4;}
int rankof(int c){return c<40?c%10+5:c<44?15:c==44?999:1000;}
int point(int c){if(c>=44)return 20;if(c>=40)return 15;int r=c%10+5;return r==5?5:(r==10||r==14)?10:0;}
int cat(int c,int tr){return c>=44?tr:col(c);}
bool beat(int a,int b,int led,int tr){int ac=cat(a,tr),bc=cat(b,tr);if(ac!=bc)return ac==tr||(bc!=tr&&ac==led);return rankof(a)>rankof(b);}
struct Hand {int a[16]{},n=0; void add(int c){a[n++]=c;} void remove(int c){int k=0;while(k<n&&a[k]!=c)++k;for(int i=k;i<n-1;++i)a[i]=a[i+1];--n;} U mask()const{U m=0;for(int i=0;i<n;++i)m|=1ULL<<a[i];return m;} };
struct Trick {int c[4]{},s[4]{},n=0;};
struct State {Hand h[4];Trick t;int tr=0,bidder=0,bid=70,points[2]{},nestpts=0;U played=0,nest=0;};
Hand legal(const Hand& h,const Trick&t,int tr){if(!t.n)return h;Hand q;int led=cat(t.c[0],tr);for(int i=0;i<h.n;++i)if(cat(h.a[i],tr)==led)q.add(h.a[i]);return q.n?q:h;}
int winidx(const Trick&t,int tr){int w=0,led=cat(t.c[0],tr);for(int i=1;i<t.n;++i)if(beat(t.c[i],t.c[w],led,tr))w=i;return w;}
int lowkey(int c,int tr){return (cat(c,tr)==tr?1000000:0)+point(c)*2000+rankof(c);}
int low(const Hand&h,int tr){int c=h.a[0];for(int i=1;i<h.n;++i)if(lowkey(h.a[i],tr)<lowkey(c,tr))c=h.a[i];return c;}
Hand nonperm(const Hand&h){Hand q;for(int i=0;i<h.n;++i)if(h.a[i]<44)q.add(h.a[i]);return q.n?q:h;}
// Exact ordered-list port of frozen Sol7.play. Each simulated seat reads only
// its own sampled hand and simulated public information, never other hands.
int solmove(const Hand&h,const Trick&t,int tr,U played,U visibleNest,int seat){
 Hand L=legal(h,t,tr);int partner=(seat+2)%4;
 U unseen=FULL&~(h.mask()|played|visibleNest);for(int i=0;i<t.n;++i)unseen&=~(1ULL<<t.c[i]);
 auto top=[&](int c,int led){U m=unseen;while(m){int x=__builtin_ctzll(m);m&=m-1;if(beat(x,c,led,tr))return false;}return true;};
 if(!t.n){
  Hand ts,plain,side;int out=0;
  for(int i=0;i<L.n;++i){int c=L.a[i];if(cat(c,tr)==tr){ts.add(c);if(c<44)plain.add(c);}else side.add(c);}
  U m=unseen;while(m){int c=__builtin_ctzll(m);m&=m-1;out+=cat(c,tr)==tr;}
  if(ts.n>=4&&out>=2&&plain.n)return low(plain,tr);
  if(side.n){Hand groups[4];for(int i=0;i<side.n;++i)groups[col(side.a[i])].add(side.a[i]);int best=-1,bn=-1,br=-1;
   for(int c=0;c<4;++c){if(c==tr||!groups[c].n)continue;int r=0;for(int i=0;i<groups[c].n;++i)r=std::max(r,rankof(groups[c].a[i]));if(groups[c].n>bn||(groups[c].n==bn&&r>br)){best=c;bn=groups[c].n;br=r;}}
   if(best>=0){Hand tops,zeros;for(int i=0;i<groups[best].n;++i){int c=groups[best].a[i];if(top(c,best))tops.add(c);if(!point(c))zeros.add(c);}if(tops.n)return low(tops,tr);return low(zeros.n?zeros:groups[best],tr);}
  }
  return low(nonperm(L),tr);
 }
 int wi=winidx(t,tr),w=t.s[wi],val=0;for(int i=0;i<t.n;++i)val+=point(t.c[i]);int led=cat(t.c[0],tr);Hand winners,zeros;
 for(int i=0;i<L.n;++i){int c=L.a[i];if(beat(c,t.c[wi],led,tr))winners.add(c);if(!point(c))zeros.add(c);}
 if(w==partner){if(t.n==3){Hand feed;for(int i=0;i<L.n;++i){int c=L.a[i];if(point(c)&&c<44&&!beat(c,t.c[wi],led,tr))feed.add(c);}if(feed.n){int c=feed.a[0];for(int i=1;i<feed.n;++i)if(point(feed.a[i])>point(c)||(point(feed.a[i])==point(c)&&rankof(feed.a[i])<rankof(c)))c=feed.a[i];return c;}}return low(nonperm(zeros.n?zeros:L),tr);}
 if(winners.n){if(t.n==3||val>=10)return low(nonperm(winners),tr);Hand cheap;for(int i=0;i<winners.n;++i)if(cat(winners.a[i],tr)!=tr&&!point(winners.a[i]))cheap.add(winners.a[i]);if(cheap.n){int c=cheap.a[0];for(int i=1;i<cheap.n;++i)if(rankof(cheap.a[i])<rankof(c))c=cheap.a[i];return c;}}
 // The frozen explicit ruff branch is redundant with val>=10 winner branch.
 return low(nonperm(zeros.n?zeros:L),tr);
}
int complete(State s,int seat,int first){
 int rootteam=seat%2,c=first;
 while(true){
  s.h[seat].remove(c);s.t.c[s.t.n]=c;s.t.s[s.t.n++]=seat;s.played|=1ULL<<c;
  if(s.t.n==4){int w=s.t.s[winidx(s.t,s.tr)],p=0;for(int i=0;i<4;++i)p+=point(s.t.c[i]);s.points[w%2]+=p;s.t.n=0;seat=w;
   if(!s.h[0].n&&!s.h[1].n&&!s.h[2].n&&!s.h[3].n){s.points[w%2]+=s.nestpts;break;}
  }else seat=(seat+1)%4;
  c=solmove(s.h[seat],s.t,s.tr,s.played,seat==s.bidder?s.nest:0,seat);
 }
 int b=s.bidder%2;if(s.points[b]<s.bid)s.points[b]=-s.bid;
 return s.points[rootteam]-s.points[1-rootteam];
}
struct Sampler {
 RNG rng;int G=0,N=0;int groupSeat[4]{},sizes[4]{},slots[46]{},slotGroup[46]{},allow[46]{};long accepted=0,proposed=0;
 bool feasible(const int*remain,const int*counts){for(int mask=1;mask<(1<<G);++mask){int need=0,cap=0;for(int m=1;m<(1<<G);++m)if((m&mask)==m)need+=counts[m];for(int g=0;g<G;++g)if(mask&(1<<g))cap+=remain[g];if(need>cap)return false;}return true;}
 bool init(U unseen,int seat,const int*lengths,const int*voids,int tr,bool hiddenNest){
  for(int s=0;s<4;++s)if(s!=seat){groupSeat[G]=s;sizes[G++]=lengths[s];}
  if(hiddenNest){groupSeat[G]=4;sizes[G++]=6;}
  int cards[46],cn=0,counts[16]{},remain[4]{};for(int g=0;g<G;++g)remain[g]=sizes[g];
  while(unseen){int c=__builtin_ctzll(unseen);unseen&=unseen-1;cards[cn++]=c;int m=0;for(int g=0;g<G;++g)if(groupSeat[g]==4||!(voids[groupSeat[g]]&(1<<cat(c,tr))))m|=1<<g;allow[c]=m;if(!m)return false;++counts[m];}
  if(!feasible(remain,counts))return false;
  for(int i=cn-1;i>0;--i)std::swap(cards[i],cards[rng.n(i+1)]);
  std::stable_sort(cards,cards+cn,[&](int a,int b){return __builtin_popcount((unsigned)allow[a])<__builtin_popcount((unsigned)allow[b]);});
  int grouped[4][46]{},gn[4]{};
  for(int i=0;i<cn;++i){int c=cards[i],m=allow[c];--counts[m];int opts[4],weights[4],k=0,total=0;
   for(int g=0;g<G;++g)if(remain[g]&&(m&(1<<g))){--remain[g];bool ok=feasible(remain,counts);++remain[g];if(ok){opts[k]=g;weights[k++]=remain[g];total+=remain[g];}}
   if(!k)return false;
   int q=rng.n(total),j=0;while(q>=weights[j])q-=weights[j++];int g=opts[j];--remain[g];grouped[g][gn[g]++]=c;
  }
  for(int g=0;g<G;++g)for(int i=0;i<gn[g];++i){slots[N]=grouped[g][i];slotGroup[N++]=g;}
  if(N!=cn)return false;
  mix(512);return true;
 }
 void mix(int steps){if(N<2)return;for(int z=0;z<steps;++z){++proposed;int k=2;if(N>=3&&rng.n(4)==0)k=std::min(N,3+rng.n(2));int ix[4];for(int j=0;j<k;++j){bool duplicate;do{ix[j]=rng.n(N);duplicate=false;for(int l=0;l<j;++l)duplicate|=ix[l]==ix[j];}while(duplicate);}bool ok=true;for(int j=0;j<k;++j)ok&=bool(allow[slots[ix[j]]]&(1<<slotGroup[ix[(j+1)%k]]));if(!ok)continue;int last=slots[ix[k-1]];for(int j=k-1;j>0;--j)slots[ix[j]]=slots[ix[j-1]];slots[ix[0]]=last;++accepted;}}
 void fill(State&s){for(int g=0;g<G;++g)if(groupSeat[g]<4)s.h[groupSeat[g]].n=0;bool hidden=G==4;if(hidden){s.nest=0;s.nestpts=0;}for(int i=0;i<N;++i){int seat=groupSeat[slotGroup[i]],c=slots[i];if(seat==4){s.nest|=1ULL<<c;s.nestpts+=point(c);}else s.h[seat].add(c);}for(int g=0;g<G;++g){int seat=groupSeat[g];if(seat==4)continue;Hand&h=s.h[seat];for(int i=h.n-1;i>0;--i)std::swap(h.a[i],h.a[rng.n(i+1)]);}}
};
extern "C" int sol7_public(const int*h,int hn,const int*tc,const int*ts,int tn,int tr,U played,U nest,int seat){Hand a;Trick t;for(int i=0;i<hn;++i)a.add(h[i]);for(int i=0;i<tn;++i){t.c[i]=tc[i];t.s[i]=ts[i];}t.n=tn;return solmove(a,t,tr,played,nest,seat);}
extern "C" int x1_choose(const int*h,int hn,const int*tc,const int*ts,int tn,int tr,int seat,int bidder,int bid,const int*points,U played,U nest,const int*voids,U seed,int samples,double*out){
 State base;base.tr=tr;base.bidder=bidder;base.bid=bid;base.played=played;base.nest=nest;base.points[0]=points[0];base.points[1]=points[1];for(int i=0;i<hn;++i)base.h[seat].add(h[i]);for(int i=0;i<tn;++i){base.t.c[i]=tc[i];base.t.s[i]=ts[i];}base.t.n=tn;U m=nest;while(m){base.nestpts+=point(__builtin_ctzll(m));m&=m-1;}
 Hand L=legal(base.h[seat],base.t,tr);int reference=solmove(base.h[seat],base.t,tr,played,nest,seat);for(int i=0;i<12;++i)out[i]=0;if(L.n==1)return L.a[0];
 int lengths[4];int completed=(__builtin_popcountll(played)-tn)/4;for(int s=0;s<4;++s)lengths[s]=10-completed;for(int i=0;i<tn;++i)--lengths[ts[i]];
 if(lengths[seat]!=hn)return -2;
 Sampler sampler{{seed}};if(!sampler.init(FULL&~(played|nest|base.h[seat].mask()),seat,lengths,voids,tr,seat!=bidder))return -3;
 double sum[16]{},dsq[16]{};int ri=0;for(int j=0;j<L.n;++j)if(L.a[j]==reference)ri=j;
 for(int i=0;i<samples;++i){sampler.mix(64);State world=base;sampler.fill(world);
  // Fail closed on an inconsistent hypothetical world. No unconstrained fallback.
  U all=played;if(__builtin_popcountll(world.nest)!=6||(all&world.nest))return -4;all|=world.nest;
  for(int s=0;s<4;++s){U hm=world.h[s].mask();if(world.h[s].n!=lengths[s]||__builtin_popcountll(hm)!=lengths[s]||(all&hm))return -5;all|=hm;for(int j=0;j<world.h[s].n;++j)if(voids[s]&(1<<cat(world.h[s].a[j],tr)))return -6;}
  if(all!=FULL)return -7;
  int vals[16];for(int j=0;j<L.n;++j){vals[j]=complete(world,seat,L.a[j]);sum[j]+=vals[j];}for(int j=0;j<L.n;++j){double d=vals[j]-vals[ri];dsq[j]+=d*d;}}
 int best=ri;double bestadv=0;
 for(int j=0;j<L.n;++j){double d=(sum[j]-sum[ri])/samples;double se=std::sqrt(std::max(0.,dsq[j]/samples-d*d)/std::max(1,samples-1));double adjusted=d-.5-.5*se;if(adjusted>bestadv){bestadv=adjusted;best=j;}}
 out[0]=samples;out[1]=L.n;out[2]=reference;out[3]=sum[ri]/samples;out[4]=sum[best]/samples;out[5]=sampler.accepted;out[6]=sampler.proposed;out[7]=L.a[best]!=reference;
 return L.a[best];
}
