// AGORA 2.0.0 — Comparator de state (indicatori din aplicație + indicatori proprii cu sursă și dată, grafic suprapus, scenarii, CSV).
// Rulare: node tests/comparator.test.mjs   (Playwright, Chromium headless, rețea blocată; axe-core prin AXE_PATH/FFF_AXE)
import {createRequire as __fffCR} from 'node:module';
const __fffAxe = () => process.env.FFF_AXE || process.env.AXE_PATH || (() => { try { return __fffCR(import.meta.url).resolve('axe-core/axe.min.js'); } catch { return undefined; } })();
import {createRequire} from 'module';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const require = createRequire(process.env.PW_ROOT || import.meta.url);
const {chromium} = require('playwright');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const URL_APP = 'file://' + path.join(HERE, '..', 'index.html');
const AXE = process.env.AXE_PATH || __fffAxe();
let pass = 0, fail = 0;
const ok = (c, n, i) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (i === undefined ? '' : ' ' + JSON.stringify(i).slice(0, 500))); } };
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox']});
const net = [], errs = [];
async function mk(o = {}) {
  const ctx = await browser.newContext({viewport: {width: o.w || 1280, height: o.h || 800}, acceptDownloads: true, locale: 'ro-RO'});
  await ctx.route(/^https?:/, r => { net.push(r.request().url()); r.abort(); });
  const page = await ctx.newPage();
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { const t = m.text(); if (m.type() === 'error' || /Content Security Policy|Refused to/i.test(t)) errs.push('console: ' + t); });
  await page.goto(o.url || URL_APP); await page.waitForTimeout(1500);
  return {ctx, page};
}
async function axeRun(page, sel) {
  // așteaptă sfârșitul animațiilor/tranzițiilor finite (fadein): altfel axe măsoară opacitate parțială sub încărcare
  await page.waitForFunction(() => document.getAnimations().every(a => a.playState !== 'running' || a.effect.getComputedTiming().iterations === Infinity), null, {timeout: 20000});
  if (!(await page.evaluate(() => !!window.axe))) await page.evaluate(fs.readFileSync(AXE, 'utf8') + '\n;0');
  return page.evaluate(async s => { const r = await window.axe.run(document.querySelector(s), {resultTypes: ['violations']}); return r.violations.map(v => v.id + ':' + v.nodes.map(n => n.target.join(' ')).slice(0, 3).join(' | ')); }, sel);
}
const open = async page => { if (await page.locator('#menuToggle').isVisible()) await page.locator('#menuToggle').click(); await page.locator('.navitem[data-section="comparator"]').click(); await page.waitForSelector('#comparator.active'); };
const rowIds = page => page.$$eval('#cmpRows .cmp-row', a => a.map(x => x.dataset.id));
const noH = page => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);

console.log('1. Date încorporate: analiza populației și suprafeței');
{
  const {ctx, page} = await mk();
  const d = await page.evaluate(() => { const o = {}; countries.forEach(c => o[c.id] = [AG_CMP.parsePop(c.pop), AG_CMP.parseArea(c.area)]); return o; });
  ok(Object.keys(d).length === 21 && Object.values(d).every(v => v[0] > 0 && v[1] > 0), '21 de state, populație și suprafață analizate fără rest', d);
  ok(d.AT[0] === 9.2 && d.AT[1] === 83879 && Math.abs(d.MT[0] - 0.574) < 1e-9 && d.MT[1] === 316 && Math.abs(d.LU[0] - 0.682) < 1e-9, 'valori de control (AT, MT, LU) identice cu profilurile');
  await open(page);
  ok((await rowIds(page)).length === 21, '21 de rânduri în grafic');
  ok((await rowIds(page))[0] === 'DE', 'implicit: populația, descrescător, Germania prima');
  await page.selectOption('#cmpA', 'dens');
  ok((await rowIds(page))[0] === 'MT', 'densitatea calculată: Malta prima');
  const dens = await page.evaluate(() => { const c = countries.find(x => x.id === 'MT'); return AG_CMP.parsePop(c.pop) * 1e6 / AG_CMP.parseArea(c.area); });
  ok(/1\.8\d\d/.test((await page.textContent('#cmpRows .cmp-row[data-id="MT"] .cmp-val')).replace(/\s/g, '')) || /1\s?8\d\d/.test(await page.textContent('#cmpRows .cmp-row[data-id="MT"] .cmp-val')), 'densitate Malta ≈ 1.8xx loc./km²', [dens, await page.textContent('#cmpRows .cmp-row[data-id="MT"] .cmp-val')]);
  ok(/aplicației|încorporate/.test(await page.textContent('#cmpSrc')) && /2026-/.test(await page.textContent('#cmpSrc')), 'sursa și data ultimei actualizări sunt afișate', await page.textContent('#cmpSrc'));
  ok(/nu se poate aduna/.test(await page.textContent('#cmpTot')), 'densitatea nu are total (nu se adună)');
  await page.selectOption('#cmpA', 'pop'); await page.selectOption('#cmpB', 'area');
  ok((await page.$$('#cmpRows .cmp-bar.b')).length === 21 && (await page.$$('#cmpLegend .cmp-sw')).length === 2, 'suprapunere: a doua serie desenată pentru toate statele + legendă cu 2 serii');
  ok((await page.$$('#cmpTable thead th')).length === 3, 'tabelul de date are 3 coloane');
  const tot = await page.textContent('#cmpTot'); ok(/100/.test(tot) && /cele 21/.test(tot), 'totalul tuturor statelor = 100 % din cele 21', tot);
  await page.click('#cmpNoneBtn'); ok(/cel puțin un stat/.test(await page.textContent('#cmpRows')), 'fără selecție: mesaj'); await page.click('#cmpAll');
  await page.locator('#cmpChips input[data-id="DE"]').uncheck(); await page.locator('#cmpChips input[data-id="FR"]').uncheck();
  const t2 = await page.textContent('#cmpTot'); ok((await rowIds(page)).length === 19 && !/100 %/.test(t2), 'excluderea a 2 state scade ponderea sub 100 %', t2);
  await page.click('#cmpAll');
  // scenariu
  await page.selectOption('#cmpB', ''); await page.selectOption('#wiC', 'LU'); await page.fill('#wiP', '1000');
  const exp = await page.evaluate(() => { const v = countries.map(c => [c.id, AG_CMP.parsePop(c.pop)]); const lu = v.find(x => x[0] === 'LU')[1]; const r0 = v.filter(x => x[1] > lu).length + 1, v1 = lu * 11, r1 = v.filter(x => x[0] !== 'LU' && x[1] > v1).length + 1; return {r0, r1, v1}; });
  const wi = await page.textContent('#wiOut');
  ok(wi.includes(`loc ${exp.r0} → ${exp.r1} din 21`) && /7,5/.test(wi) && /%/.test(wi), 'scenariu: Luxemburg +1000 % — locul și ponderea corecte', [wi, exp]);
  await page.fill('#wiP', '5000'); ok(/între −100 și 1000/.test(await page.textContent('#wiOut')), 'procent în afara intervalului: mesaj');
  await page.fill('#wiP', '-100'); ok(/→ 0 /.test(await page.textContent('#wiOut')) || /→ 0 mil/.test(await page.textContent('#wiOut')), '−100 % → valoarea 0', await page.textContent('#wiOut'));
  ok(errs.length === 0 && net.length === 0, 'fără erori și fără rețea', [errs, net]);
  await ctx.close();
}

console.log('2. Indicatori proprii (sursă și dată), persistență, ștergere, CSV');
{
  const {ctx, page} = await mk();
  await open(page);
  await page.click('#myAdd'); await page.fill('#myName', '=1+1'); await page.fill('#myUnit', 'mld €'); await page.fill('#mySrc', 'Sursa mea de test'); await page.fill('#myDate', '2026-13-45');
  await page.fill('#myv_DE', '10,5'); await page.fill('#myv_FR', '7'); await page.click('#mySave');
  ok(/AAAA-LL-ZZ/.test(await page.textContent('#myMsg')), 'dată invalidă respinsă', await page.textContent('#myMsg'));
  await page.fill('#myDate', '2026-09-30'); await page.fill('#myv_AT', 'abc'); await page.click('#mySave');
  ok(/Austria/.test(await page.textContent('#myMsg')), 'valoare numerică invalidă: mesaj cu țara', await page.textContent('#myMsg'));
  await page.fill('#myv_AT', ''); await page.click('#mySave');
  ok(/salvat/.test(await page.textContent('#myMsg')) && (await page.$('#myForm:not([hidden])')) === null, 'indicator salvat, formularul se închide');
  ok((await page.$$eval('#cmpA option', o => o.length)) === 6, 'indicatorul nou apare în listă');
  ok((await rowIds(page))[0] === 'DE', 'noul indicator e selectat; DE (10,5) primul');
  const row = await page.textContent('#cmpRows .cmp-row[data-id="DE"] .cmp-val'); ok(/10,5/.test(row), 'valoarea 10,5 afișată', row);
  const sr = await page.textContent('#cmpSrc'); ok(/Sursa mea de test/.test(sr) && /2026-09-30/.test(sr), 'sursa și data introduse sunt afișate', sr);
  ok(/mld €/.test(await page.textContent('#cmpTot')) && /17,5/.test(await page.textContent('#cmpTot')), 'total: 10,5 + 7 = 17,5 (aditiv, 100 % din valorile introduse)', await page.textContent('#cmpTot'));
  ok(/fără valoare/.test(await page.textContent('#cmpRows .cmp-row[data-id="AT"] .cmp-val')), 'state fără valoare marcate');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('agora.cmp')));
  ok(stored.inds.length === 1 && stored.inds[0].vals.DE === 10.5 && stored.inds[0].date === '2026-09-30', 'persistat în localStorage (agora.cmp)', stored);
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#cmpCsv')]);
  const csv = fs.readFileSync(await dl.path(), 'utf8');
  ok(csv.charCodeAt(0) === 0xfeff && /Sursa mea de test/.test(csv) && /"Germania",10.5/.test(csv) && csv.trim().split(/\r?\n/).length === 1 + 1 + 21, 'CSV: BOM, sursa în antet, 21 de rânduri', csv.split(/\r?\n/).slice(0, 3));
  ok(/^"'=1\+1"/m.test(csv.split(/\r?\n/)[1]) || /"'=1\+1"/.test(csv), 'CSV: celula care începe cu = este neutralizată', csv.split(/\r?\n/)[1]);
  await page.reload(); await page.waitForTimeout(1200); await open(page);
  ok((await page.$$eval('#cmpA option', o => o.length)) === 6, 'după reîncărcare indicatorul propriu există');
  await page.selectOption('#mySel', await page.$eval('#mySel option', o => o.value)); await page.click('#myDel');
  ok((await page.textContent('#myDel')).includes('Sigur') && (await page.$$eval('#cmpA option', o => o.length)) === 6, 'ștergerea cere o a doua apăsare (fără confirm nativ)');
  await page.click('#myDel');
  ok((await page.$$eval('#cmpA option', o => o.length)) === 5 && (await page.evaluate(() => JSON.parse(localStorage.getItem('agora.cmp')).inds.length)) === 0, 'indicator șters și din stocare');
  ok(errs.length === 0 && net.length === 0, 'fără erori și fără rețea', [errs, net]);
  await ctx.close();
}

console.log('3. 8 limbi, axe, mobil');
for (const [w, h] of [[1280, 800], [360, 740]]) {
  const {ctx, page} = await mk({w, h});
  await open(page);
  ok(await noH(page), `fără depășire orizontală ${w}x${h}`);
  const ax = await axeRun(page, '#comparator'); ok(ax.length === 0, `axe 0 (ro) ${w}x${h}`, ax);
  await page.click('#myAdd'); const ax1 = await axeRun(page, '#comparator'); ok(ax1.length === 0, `axe 0 cu formularul deschis ${w}x${h}`, ax1); await page.click('#myCancel');
  for (const l of ['en', 'fr', 'it', 'es', 'pt', 'de', 'hu']) {
    await page.selectOption('#langSel', l); await page.waitForTimeout(250);
    const txt = await page.$eval('#comparator', e => e.innerText);
    ok(!/\b(cmp|wi|my|ind|u)[A-Z][A-Za-z]+\b/.test(txt) && !/Comparator de state|Scenariu „ce-ar fi dacă”/.test(txt) && txt.length > 400, `${l}: text tradus, fără chei brute (${w}x${h})`, txt.slice(0, 160));
    if (w === 1280) { const a = await axeRun(page, '#comparator'); ok(a.length === 0, `axe 0 (${l})`, a); }
    else ok(await noH(page), `${l}: fără depășire orizontală`);
  }
  await ctx.close();
}
ok(errs.length === 0, 'fără pageerror/CSP', errs); ok(net.length === 0, '0 cereri de rețea', net);
await browser.close();
console.log(`\ncomparator: ${pass} reușite, ${fail} eșuate`); process.exit(fail ? 1 : 0);
