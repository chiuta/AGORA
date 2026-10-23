// Teste r10 pentru AGORA 1.2.7: import în jurnalul călătorului cu chei moștenite din Object (constructor, __proto__).
// Rulare: node tests/r10-audit.test.mjs   (Playwright din /opt/node-tools; rețea externă blocată)
import {createRequire} from 'module';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {fileURLToPath} from 'url';
const require = createRequire('/opt/node-tools/package.json');
const {chromium} = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const FILE = 'file://' + path.resolve(here, '..', 'index.html');
let ok = 0, bad = 0;
function t(name, cond, extra) { if (cond) { ok++; console.log('  ok  ' + name); } else { bad++; console.log('  FAIL ' + name + (extra ? ' :: ' + JSON.stringify(extra) : '')); } }
const b = await chromium.launch({executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox']});
const ctx = await b.newContext({viewport: {width: 390, height: 800}});
await ctx.route(/^https?:/, (r) => r.abort());
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
await p.goto(FILE); await p.waitForTimeout(1500);
const firstId = await p.evaluate(() => document.querySelector('#jTara option').value);
const f = path.join(os.tmpdir(), 'agora-r10.json');
fs.writeFileSync(f, JSON.stringify({entries: [
  {tara: 'constructor', data: '2024-01-01', nota: 'a'}, {tara: '__proto__', nota: 'b'}, {tara: 'hasOwnProperty', nota: 'c'},
  {tara: firstId, data: '2024-02-03', nota: '<img src=x onerror=window.__x=1>'}
]}));
await p.setInputFiles('#jImportFile', f); await p.waitForTimeout(400);
const r = await p.evaluate(() => ({list: document.getElementById('jList').innerText, count: document.getElementById('jCount').textContent, img: document.querySelectorAll('#jList img').length}));
t('doar intrarea cu țară reală este importată', r.count === '1', r);
t('niciun nume de funcție nativă în listă', !/native code|\[object/.test(r.list), r.list);
t('nota ostilă rămâne text, nu element', r.img === 0);
t('fără pageerror', errs.length === 0, errs);
await b.close();
console.log('\n' + ok + ' reușite, ' + bad + ' eșuate'); process.exit(bad ? 1 : 0);
