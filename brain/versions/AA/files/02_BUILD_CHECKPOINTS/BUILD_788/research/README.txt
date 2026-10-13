GRIFFIN HOUSE OF ROOKS — X1 EPA 10,000-HAND VALIDATION
2026-10-11 | RESEARCH ONLY | NO GAME MODIFICATIONS

5,000 fresh shuffled deals, 1,250 per partner proxy (Sol7, Extreme, Meridian, Corvus), each played twice: frozen X1 and experimental X1 with knowledge of its teammate's remaining cards. 10,000 complete hands, 5,000 matched comparisons. Seed base 202803170000 is an arbitrary seed identifier, not the date. The deal schedule is distinct from the prior 800- and 2,000-hand experiments.

RESULT: EPA improved team scoring margin on 1,767 matched comparisons, worsened it on 1,054, and tied on 2,179. Mean paired margin advantage +7.44 points per hand. Bootstrap 95% interval approximately +5.53 to +9.36. This is NOT a head-to-head game win rate. The comparison is not 10,000 independent samples.

BY PARTNER: Sol7 +9.700, Extreme +9.408, Meridian +6.200, Corvus +4.452 points per hand.

LIMITATIONS: Simulated bot proxies, not human teammates. Extra partner-hand knowledge is privileged information. Opponent policies are based on Sol7. No Android integration or human satisfaction test. Mean advantage does not imply every decision improves. Do not deploy based on this research alone.

REPRODUCTION: Requires original SOL7.zip research source extracted to directory 'original' next to these scripts. The supplied original symlink in the working environment is not part of this archive. Compile rollout_shared.cpp with: g++ -O3 -std=c++17 -fPIC -shared rollout_shared.cpp -o rollout_shared.so. Then python run_shared.py and python analyze.py. The test runner verifies the frozen source checksum before running.

FILES: run_shared.py (simulation), run_partner.py (proxy definitions), rollout_shared.cpp (EPA sampler), rollout_shared.so (Linux binary), fresh_results.json (per-deal), fresh_summary.json, analysis.json (bootstrap analysis), run.log.
