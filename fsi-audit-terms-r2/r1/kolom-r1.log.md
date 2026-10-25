# Kolom round 1 re-word log

Engine that typed every word: qlocal -p (prose mode, thinking off, default temperature, no system prompt), default engine qwen3.8-64k (dense 27B). Nothing was typed by hand.

Method: a driver script built each prompt (voice DNA file, de-ai writing file, the whole draft page for context, the register rules, the slot facts and must_achieve text, four candidate versions per slot), sent it to `qlocal -p` on stdin, and parsed the labelled output. Code (not hand-writing) then checked numbers, tokens, banned words, word caps, sentence counts and heading shape, and picked among the model's own candidates. Failed slots were re-asked with a correction note (the notes state facts and shape only, no wording). Prompt and output files for each call are in /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/91b29c8c-e798-4ab0-a466-b4c78e72db32/scratchpad/ (tag.prompt.txt, tag.out.txt).

Calls (each `qlocal -p < <tag>.prompt.txt`):

- `qlocal -p < /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/91b29c8c-e798-4ab0-a466-b4c78e72db32/scratchpad/b4-r1.prompt.txt` (engine qwen3.8-64k default, prose mode, thinking off) tag=b4-r1

- `qlocal -p < /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/91b29c8c-e798-4ab0-a466-b4c78e72db32/scratchpad/b4-r2.prompt.txt` (engine qwen3.8-64k default, prose mode, thinking off) tag=b4-r2

- `qlocal -p < /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/91b29c8c-e798-4ab0-a466-b4c78e72db32/scratchpad/b4-r3.prompt.txt` (engine qwen3.8-64k default, prose mode, thinking off) tag=b4-r3

- `qlocal -p < /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/91b29c8c-e798-4ab0-a466-b4c78e72db32/scratchpad/B14-H18-r4.prompt.txt` (engine qwen3.8-64k default, prose mode, thinking off) tag=B14-H18-r4

- `qlocal -p < /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/91b29c8c-e798-4ab0-a466-b4c78e72db32/scratchpad/b1-r1.prompt.txt` (engine qwen3.8-64k default, prose mode, thinking off) tag=b1-r1

- `qlocal -p < /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/91b29c8c-e798-4ab0-a466-b4c78e72db32/scratchpad/B1,B2,B3,B4,B5,B6-r2.prompt.txt` (engine qwen3.8-64k default, prose mode, thinking off) tag=B1,B2,B3,B4,B5,B6-r2

- `qlocal -p < /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/91b29c8c-e798-4ab0-a466-b4c78e72db32/scratchpad/B3,B5-r3.prompt.txt` (engine qwen3.8-64k default, prose mode, thinking off) tag=B3,B5-r3

- `qlocal -p < /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/91b29c8c-e798-4ab0-a466-b4c78e72db32/scratchpad/b2-r1.prompt.txt` (engine qwen3.8-64k default, prose mode, thinking off) tag=b2-r1

- `qlocal -p < /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/91b29c8c-e798-4ab0-a466-b4c78e72db32/scratchpad/B13-r1b.prompt.txt` (engine qwen3.8-64k default, prose mode, thinking off) tag=B13-r1b

- `qlocal -p < /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/91b29c8c-e798-4ab0-a466-b4c78e72db32/scratchpad/B8,B9-r2.prompt.txt` (engine qwen3.8-64k default, prose mode, thinking off) tag=B8,B9-r2

- `qlocal -p < /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/91b29c8c-e798-4ab0-a466-b4c78e72db32/scratchpad/B9-r3.prompt.txt` (engine qwen3.8-64k default, prose mode, thinking off) tag=B9-r3

- `qlocal -p < /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/91b29c8c-e798-4ab0-a466-b4c78e72db32/scratchpad/B8-r2.prompt.txt` (engine qwen3.8-64k default, prose mode, thinking off) tag=B8-r2

- `qlocal -p < /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/91b29c8c-e798-4ab0-a466-b4c78e72db32/scratchpad/b3-r1.prompt.txt` (engine qwen3.8-64k default, prose mode, thinking off) tag=b3-r1

- `qlocal -p < /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/91b29c8c-e798-4ab0-a466-b4c78e72db32/scratchpad/b3-r2.prompt.txt` (engine qwen3.8-64k default, prose mode, thinking off) tag=b3-r2

- `qlocal -p < /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/91b29c8c-e798-4ab0-a466-b4c78e72db32/scratchpad/b3-r3.prompt.txt` (engine qwen3.8-64k default, prose mode, thinking off) tag=b3-r3

- `qlocal -p < /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/91b29c8c-e798-4ab0-a466-b4c78e72db32/scratchpad/B14-15,B14-25,B14-30,B14-33,B14-37-r4.prompt.txt` (engine qwen3.8-64k default, prose mode, thinking off) tag=B14-15,B14-25,B14-30,B14-33,B14-37-r4

- `qlocal -p < /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/91b29c8c-e798-4ab0-a466-b4c78e72db32/scratchpad/B14-15,B14-25,B14-30,B14-33,B14-37-r5.prompt.txt` (engine qwen3.8-64k default, prose mode, thinking off) tag=B14-15,B14-25,B14-30,B14-33,B14-37-r5

- `qlocal -p < /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/91b29c8c-e798-4ab0-a466-b4c78e72db32/scratchpad/B14-30-r6.prompt.txt` (engine qwen3.8-64k default, prose mode, thinking off) tag=B14-30-r6

- `qlocal -p < /private/tmp/claude-501/-Users-asiffarid-Documents-apps-flowstateimpact-site-glowup/91b29c8c-e798-4ab0-a466-b4c78e72db32/scratchpad/B14-2-r7.prompt.txt` (engine qwen3.8-64k default, prose mode, thinking off) tag=B14-2-r7
