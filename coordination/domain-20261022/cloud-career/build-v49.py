from pathlib import Path
import json
root=Path('cloud-career')
s=(root/'main-v48.mjs').read_text()
start=s.index("const CAREER_URL=")
end=s.index('const CLOUD_CAREER_CLIENT=',start)
s=s[:start]+(root/'api.mjs').read_text()+'\n'+s[end:]
start=s.index('const CLOUD_CAREER_CLIENT=')
end=s.index('\nconst CLOUD_CAREER_CORE=',start)
s=s[:start]+'const CLOUD_CAREER_CLIENT='+json.dumps((root/'client.js').read_text())+';'+s[end:]
(root/'main-v49.mjs').write_text(s)
# Prove gameplay/DO and progression core remain byte-identical to v48.
old=(root/'main-v48.mjs').read_text()
assert old[:old.index('const CAREER_URL=')]==s[:s.index('const CAREER_URL=')]
assert old[old.index('const CLOUD_CAREER_CORE='):]==s[s.index('const CLOUD_CAREER_CORE='):]
print('PASS v49 only changes cloud account API/client; game, DO, career core and accrual unchanged')
