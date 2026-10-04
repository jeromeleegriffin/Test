GRIFFIN HOUSE PLAYER v7 — LOCK + DOWNLOAD EXACT BUILD

Normal path:
1. Grok stages one unique candidate from protected Test root R712.
2. Grok creates an exact ZIP artifact for that candidate and SHA-256.
3. latest.json points to candidate + ZIP + SHA only after both are verified.
4. Jerome loads and physically tests candidate.
5. LOCK THIS BUILD re-checks latest.json and artifact reachability.
6. Only then DOWNLOAD LOCKED ZIP and APPROVE LOCKED BUILD appear.
7. Download re-checks ID + SHA before starting.

The Player does not write GitHub or production. It does not create the archive itself.
Locked archive artifacts live under /Test/artifacts/ and should correspond exactly to the staged candidate tree.
