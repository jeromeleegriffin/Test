"""Load exact frozen class while avoiding the archived script's automatic test run."""
import pathlib, sys, types, hashlib
ROOT = pathlib.Path(__file__).resolve().parents[1]
VENDOR = ROOT / 'vendor'
EXPECTED = '04404bdb843800125582560cec2f209fc8c7bcd4191bc7da37a931e7236aaf4b'
source = (VENDOR / 'Sol7_FROZEN.py').read_bytes()
assert hashlib.sha256(source).hexdigest() == EXPECTED
assert hashlib.sha256((VENDOR/'run_rook_ai_tournament.py').read_bytes()).hexdigest() == '99057e87b4b16f648e6b93aa2ebe06800dcf50cf8eaf5be86b0a14628879ae6e'
ns = {'__file__': str(VENDOR/'Sol7_FROZEN.py')}
exec(compile(source.decode().split('TARGET_HANDS=2000', 1)[0], str(VENDOR/'Sol7_FROZEN.py'), 'exec'), ns)
Sol7, lab = ns['Sol7'], ns['lab']
