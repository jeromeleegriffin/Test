import json,statistics,random,math,pathlib,collections
p=pathlib.Path(__file__).parent
rows=json.loads((p/'fresh_results.json').read_text()); d=[r['margin_delta'] for r in rows]
rng=random.Random(8675309)
boots=[statistics.mean(rng.choices(d,k=len(d))) for _ in range(5000)]
boots.sort()
positive=[x for x in d if x>0];negative=[x for x in d if x<0]
summary={'unique_deals':len(rows),'complete_hands':len(rows)*2,'mean_margin_delta':statistics.mean(d),'median_margin_delta':statistics.median(d),'sample_std_dev':statistics.stdev(d),'paired_bootstrap_95_CI_mean_margin':[boots[125],boots[4874]],'shared_better':len(positive),'frozen_better':len(negative),'tied':d.count(0),'non_tied_shared_fraction':len(positive)/(len(positive)+len(negative)),'partner_style_breakdown':json.loads((p/'fresh_summary.json').read_text()),'selected_100_outcome_differences':[{'style':r['style'],'seed':r['seed'],'seat':r['seat'],'dealer':r['dealer'],'baseline_margin':r['x1']['margin'],'shared_margin':r['shared']['margin'],'delta':r['margin_delta']} for r in sorted((x for x in rows if x['margin_delta']!=0),key=lambda x:abs(x['margin_delta']),reverse=True)[:100]]}
(p/'analysis.json').write_text(json.dumps(summary,indent=2));print(json.dumps({k:v for k,v in summary.items() if k!='selected_100_outcome_differences'},indent=2))
