// AGORA 2.1.0 — populația Franței corectată (68,6 mil.) și nota „Date și surse” actualizată. Rulare: node tests/date-surse.test.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const s = fs.readFileSync(path.join(HERE, '..', 'index.html'), 'utf8');
let fail = 0;
const ok = (c, n) => { console.log((c ? '  ok   ' : '  FAIL ') + n); if (!c) fail++; };
ok(/id:'FR'[^}]*pop:'~68,6 mil\.'/.test(s), 'Franța: populația ~68,6 mil.');
ok(!/id:'FR'[^}]*pop:'~68,9 mil\.'/.test(s), 'Franța: vechea valoare 68,9 eliminată');
const z7 = [...s.matchAll(/"z7":"((?:[^"\\]|\\.)*)"/g)].map(m => m[1]);
ok(z7.length === 8, 'z7 în 8 limbi');
ok(z7.every(t => /68,6|68\.6/.test(t) && /10[,.]75/.test(t)), 'z7 menționează Franța 68,6 și conflictul Portugaliei în toate limbile');
ok(z7.slice(2).every(t => /automati|automát|automatic|gépi/i.test(t)), 'limbile non-RO/EN marcate „traducere automată”');
console.log(fail ? 'FAIL' : 'OK'); process.exit(fail ? 1 : 0);
