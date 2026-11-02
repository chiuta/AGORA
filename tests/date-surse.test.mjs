// AGORA 2.1.1 — populații actualizate la 1.1.2026 (DE, EE, ES, FI, FR, LV, MT, NL, LU) și nota „Date și surse” actualizată. Rulare: node tests/date-surse.test.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const s = fs.readFileSync(path.join(HERE, '..', 'index.html'), 'utf8');
let fail = 0;
const ok = (c, n) => { console.log((c ? '  ok   ' : '  FAIL ') + n); if (!c) fail++; };
ok(/id:'FR'[^}]*pop:'~69,1 mil\.'/.test(s), 'Franța: populația ~69,1 mil. (INSEE, 1.1.2026)');
ok(!/id:'FR'[^}]*pop:'~68,[69] mil\.'/.test(s), 'Franța: vechile valori 68,6/68,9 eliminate');
const P = {DE:'~83,5 mil.', EE:'~1,36 mil.', ES:'~49,6 mil.', FI:'~5,7 mil.', LV:'~1,85 mil.', MT:'~588 mii', PT:'~11,4 mil.', NL:'~18,1 mil.', LU:'~691 mii', BE:'~11,9 mil.'};
for (const [id, v] of Object.entries(P)) ok(new RegExp("id:'" + id + "'[^}]*pop:'" + v.replace(/[.~]/g, '\\$&') + "'").test(s), id + ': ' + v);
const z7 = [...s.matchAll(/"z7":"((?:[^"\\]|\\.)*)"/g)].map(m => m[1]);
ok(z7.length === 8, 'z7 în 8 limbi');
ok(z7.every(t => /68,6|68\.6/.test(t) && /10[,.]75/.test(t)), 'z7 menționează Franța 68,6 și conflictul Portugaliei în toate limbile');
ok(z7.every(t => /69[ .,]082[ .,]000/.test(t) && /11[ .,]424[ .,]031/.test(t) && /588[ .,]254/.test(t)), 'z7: actualizarea din 2 nov. 2026 (FR, PT, MT) în toate cele 8 limbi');
ok(z7.every(t => /18[ .,]130[ .,]208/.test(t) && /690[ .,]959/.test(t) && /11[ .,]867[ .,]634/.test(t)), 'z7: NL, LU, BE (1 ian. 2026) în toate cele 8 limbi');
ok(z7.slice(2).every(t => /automati|automát|automatic|gépi/i.test(t)), 'limbile non-RO/EN marcate „traducere automată”');
console.log(fail ? 'FAIL' : 'OK'); process.exit(fail ? 1 : 0);
