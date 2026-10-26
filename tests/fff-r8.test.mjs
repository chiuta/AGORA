// Teste funcții noi (runda 8, 14 octombrie 2026) — Playwright, Chromium headless, rețea blocată.
// Rulare: node tests/fff-r8.test.mjs   (cere /opt/node-tools cu playwright și /opt/pw-browsers/chromium; axe-core opțional prin AXE_PATH)
// [fff-portable] axe-core: FFF_AXE / AXE_PATH, apoi pachetul `axe-core` (npm i -D axe-core). Dacă lipsește: undefined (testele cu axe pică cu mesaj clar).
import {createRequire as __fffCR} from 'node:module';
const __fffAxe = () => process.env.FFF_AXE || process.env.AXE_PATH || (() => { try { return __fffCR(import.meta.url).resolve('axe-core/axe.min.js'); } catch { return undefined; } })();
import {createRequire} from 'module';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const require = createRequire(process.env.PW_ROOT || import.meta.url);
const {chromium} = require('playwright');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX = path.join(HERE, '..', 'index.html');
const URL_APP = 'file://' + INDEX;
const AXE = process.env.AXE_PATH || __fffAxe();
const sleep = ms => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
const ok = (cond, name, info) => { if (cond) { pass++; console.log('  ok   ' + name); } else { fail++; console.log('  FAIL ' + name + (info === undefined ? '' : ' ' + JSON.stringify(info).slice(0, 500))); } };
const FLAGS = ['--no-sandbox', '--allow-loopback-in-peer-connection', '--disable-features=WebRtcHideLocalIpsWithMdns'];
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: FLAGS});
const net = [], errs = [];
async function mk(o = {}) {
  const ctx = await browser.newContext({viewport: {width: o.w || 1280, height: o.h || 800}, acceptDownloads: true, colorScheme: o.scheme || 'dark', reducedMotion: o.reduced ? 'reduce' : 'no-preference', locale: o.locale || 'ro-RO', bypassCSP: !!o.bypassCSP});
  await ctx.route(/^https?:/, r => { net.push(r.request().url()); r.abort(); });
  if (o.init) await ctx.addInitScript(o.init);
  const page = await ctx.newPage();
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { const t = m.text(); if (m.type() === 'error' || /Content Security Policy|Refused to/i.test(t)) errs.push('console: ' + t); });
  if (o.goto !== false) await page.goto(o.url || URL_APP);
  return {ctx, page};
}
async function axeRun(page, sel) {
  if (!(await page.evaluate(() => !!window.axe))) await page.evaluate(fs.readFileSync(AXE, 'utf8') + '\n;0');
  return page.evaluate(async s => { const r = await window.axe.run(s ? document.querySelector(s) : document, {resultTypes: ['violations']}); return r.violations.map(v => v.id + ':' + v.nodes.map(n => n.target.join(' ')).slice(0, 3).join(' | ')); }, sel || null);
}
const noHScroll = page => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
// sintetizator vocal fals: înregistrează textele „citite”
const TTS_MOCK = () => {
  window.__spoken = [];
  class U { constructor(t) { this.text = t; this.voice = null; this.lang = ''; this.rate = 1; } }
  const V = [{name: 'Test RO', lang: 'ro-RO', voiceURI: 'ro', localService: true, default: true}, {name: 'Test EN', lang: 'en-US', voiceURI: 'en', localService: true, default: false}];
  const synth = {getVoices: () => V, speaking: false, addEventListener() {}, removeEventListener() {}, pause() {}, resume() {},
    cancel() { synth.speaking = false; }, speak(u) { synth.speaking = true; setTimeout(() => { window.__spoken.push({text: u.text, lang: u.lang}); synth.speaking = false; if (u.onstart) u.onstart({}); if (u.onend) u.onend({}); }, 5); }};
  Object.defineProperty(window, 'SpeechSynthesisUtterance', {value: U, configurable: true}); Object.defineProperty(window, 'speechSynthesis', {value: synth, configurable: true});
};
console.log('AGORA — teste funcții noi (căutare în tot atlasul, citirea secțiunii cu voce, kit)');
for (const [w, h] of [[1280, 800], [360, 740]]) {
  const {ctx, page} = await mk({w, h, init: TTS_MOCK});
  await page.waitForTimeout(3600);
  ok(await page.evaluate(() => !!(window.FFF && FFF.search && FFF.tts && FFF.bundle && FFF.label)), `kit încărcat (${w}x${h})`);
  ok(await noHScroll(page), `fără depășire orizontală ${w}x${h}`);
  const ax = await axeRun(page); ok(ax.length === 0, `axe 0 violări (start) ${w}x${h}`, ax);
  if (w < 700) await page.locator('#menuToggle').click();
  await page.locator('#fsBtn').click(); await page.locator('#r8s-q').fill('convergenta'); await page.waitForTimeout(500);
  ok(await page.locator('.r8-res li').count() >= 3, `căutare: „convergenta” (fără diacritice) dă rezultate ${w}x${h}`, await page.locator('.r8-res li').count());
  const ax2 = await axeRun(page); ok(ax2.length === 0, `axe 0 violări cu dialogul de căutare deschis ${w}x${h}`, ax2);
  ok(await noHScroll(page), `dialog: fără depășire orizontală ${w}x${h}`);
  await ctx.close();
}
ok(errs.length === 0, 'fără pageerror/CSP la pornire', errs); ok(net.length === 0, '0 cereri de rețea', net);
{
  const {ctx, page} = await mk({init: TTS_MOCK});
  const q = async t => { await page.locator('#fsBtn').click(); await page.locator('#r8s-q').fill(t); await page.waitForTimeout(450); return page.locator('.r8-res li').evaluateAll(l => l.map(x => x.querySelector('b').textContent)); };
  let r = await q('criteriile de convergenta');
  ok(r.length > 0 && r.some(x => /Criteriile de convergență/i.test(x)), 'interogarea „criteriile de convergenta” aduce secțiunea despre criterii', r.slice(0, 5));
  await page.locator('.r8-res li button').first().click();
  const act = await page.evaluate(() => document.querySelector('.section.active').id);
  ok(r.length && (await page.locator('.section.active h2').first().innerText()).trim().length > 0 && act !== 'home', 'clic pe rezultat deschide secțiunea (' + act + ')');
  ok(!(await page.locator('#r8s-q').isVisible()), 'dialogul se închide după alegere');
  r = await q('Maastrich');
  ok(r.some(x => /Maastricht/.test(x)), 'greșeală de scriere „Maastrich” găsește Tratatul de la Maastricht', r.slice(0, 5));
  await page.keyboard.press('Escape');
  r = await q('xkqzvw');
  ok(r.length === 0 && /Niciun/.test(await page.locator('#r8s-q').evaluate(i => i.closest('dialog').querySelector('[role=status]').textContent)), 'fără potrivire: mesaj „Niciun rezultat”');
  await page.keyboard.press('Escape');
  // search din bara laterală: valoarea din câmp se preia
  await page.locator('#navSearch').fill('euro digital'); await page.locator('#fsBtn').click();
  ok((await page.locator('#r8s-q').inputValue()) === 'euro digital' && await page.locator('.r8-res li').count() > 0, 'dialogul preia textul din câmpul de căutare al meniului');
  await page.keyboard.press('Escape');
  // citire cu voce
  await page.locator('#navSearch').fill('');
  await page.locator('.navitem[data-section="org-bce"]').click();
  await page.locator('#ttsBtn').click(); await page.waitForTimeout(500);
  const sp = await page.evaluate(() => window.__spoken);
  const title = await page.locator('#org-bce h2').first().innerText();
  ok(sp.length > 3 && sp.some(x => x.text.includes(title.trim().split(' ')[0])), 'secțiunea activă este citită (titlu + text)', sp.slice(0, 2));
  ok(sp.every(x => x.lang === 'ro-RO'), 'voce ro-RO');
  ok(!sp.some(x => /Exportă|Închide ✕/.test(x.text)), 'butoanele și controalele nu sunt citite');
  await ctx.close();
  const c2 = await mk({init: () => { Object.defineProperty(window, 'speechSynthesis', {value: undefined, configurable: true}); }});
  await c2.page.locator('#ttsBtn').click(); await c2.page.waitForTimeout(300);
  ok((await c2.page.locator('.r8msg').innerText()).length > 3, 'fără sintetizator: mesaj grațios');
  await c2.ctx.close();
}
// ---------- regresii: navigarea, harta, chestionarul, jurnalul ----------
{
  const {ctx, page} = await mk({});
  await page.locator('.navitem[data-section="harta"]').click();
  ok(await page.locator('#harta.active').count() === 1, 'navigarea între secțiuni merge');
  await page.locator('#navSearch').fill('maastricht');
  ok(await page.locator('.navitem:visible').count() === 1, 'căutarea veche din meniu filtrează în continuare');
  await page.locator('#navSearch').fill('');
  const bundle = await page.evaluate(() => FFF.bundle.build());
  ok(bundle && bundle.app === 'agora' && Object.keys(bundle.data).length === 0, 'AGORA nu stochează nimic local: exportul .fff.json este gol, ca în proiectare', bundle && Object.keys(bundle.data));
  await ctx.close();
}
ok(errs.length === 0, 'fără pageerror/CSP în tot setul', errs.slice(0, 5)); ok(net.length === 0, '0 cereri de rețea în tot setul', net.slice(0, 3));
await browser.close(); console.log(`\n${pass} ok, ${fail} eșuate`); process.exit(fail ? 1 : 0);
