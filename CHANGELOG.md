# Jurnal de modificări — AGORA

## 2.1.5 — 2026-11-03

Etapa 7: textul „Date și surse” (z7, 8 limbi) și README spun acum clar că populațiile de bază sunt Eurostat tps00001 (1 ian. 2025), în parte înlocuite cu cifre naționale; diferența Franței (~69,1 vs ~68,6 mil.) vine din data și aria de referință (INSEE, 1 ian. 2026, cu Mayotte), nu dintr-o eroare.

## 2.1.4 — 2026-11-03

Etapa 4: cifrele din comparator marcate verificat / nepotrivit / neverificat după reproducerile primite (plic claim/repro)

## 2.1.1 — 2026-11-02 (reîmprospătare kit)

- Nou (kit): **Sincronizare între dispozitive** (`FFF.sync`) — în dialogul «Transparență» (clic pe versiune → Copie de siguranță): conectezi două dispozitive direct (WebRTC, cod/QR, fără server și fără cont) și își schimbă datele aplicației; cea mai recentă valoare câștigă, secretele (chei API, parole) nu se trimit, ștergerile nu se propagă. Aplicarea trece prin importul kitului (confirmare, chei permise, rollback).
- Nou (kit): **Istoric local — «mașina timpului»** (`FFF.history`) — instantanee automate ale datelor (IndexedDB, fără secrete), diferență față de starea curentă și restaurare reversibilă; «Șterge datele aplicației» șterge și istoricul.
- Module adăugate: `qr`, `p2p`, `sync`, `history` (+~140 KB). Versiunea aplicației nu se schimbă.

## 2.1.1 — 2026-11-02

Actualizare surse (2026-11-02).

- Euro digital: nota din secțiunea „Euro digital” (8 limbi) spunea că votul ECON din 23 iunie 2026 „nu e încă un vot în plen". Actualizat: pe 9 iulie 2026 plenul Parlamentului European a confirmat mandatul de negociere (416 pentru, 169 împotrivă, 22 abțineri), iar negocierile cu statele membre au început (Brussels Signal, Sofia Globe; obiectiv declarat: acord până la finele lui 2026, pilot BCE în 2027, disponibilitate în 2029).
- Populații (2 noiembrie 2026): DE ~83,5 (Destatis), EE ~1,36 (Statistics Estonia), ES ~49,6 (INE), FI ~5,7 (Statistics Finland), FR ~69,1 (INSEE), LV ~1,85 (CSB), MT ~588 mii (NSO, sfârșit 2025) actualizate la cifre oficiale pentru 1 ianuarie 2026; PT ~11,4 mil. confirmat de INE (11.424.031 la 31.12.2025); AT, BG, IT neschimbate la rotunjire; BE, CY, HR, GR, IE, LT, LU, NL, SK, SI rămân la 1 ianuarie 2025 (cifre 2026 neconfirmate din sursă oficială). Nota „Date și surse” actualizată în 8 limbi.
- Populații, a doua rundă (2 noiembrie 2026): NL ~18,1 mil. (CBS, StatLine 85384NED: 18.130.208 la 1.1.2026; înainte ~18,0) și LU ~691 mii (STATEC: 690.959 la 1.1.2026; înainte ~682 mii) actualizate; BE confirmat de Statbel (11.867.634 la 1.1.2026), neschimbat la rotunjire (~11,9 mil.). CY, HR, GR, IE, LT, SK, SI rămân la 1 ianuarie 2025 (cifre 2026 neconfirmate direct de la institutul național; Eurostat indică pentru CY ~997 mii și LU ~691 mii la 1.1.2026, conform presei). Nota „Date și surse” actualizată în 8 limbi.
- Verificate fără modificări: calendarul noii serii de bancnote (sondaj 23 iulie – 21 septembrie 2026, decizia Consiliului guvernatorilor în jurul finelui lui 2026; ecb.europa.eu).
- Neverificate (rămân „de verificat"): populațiile (situația la 1 ianuarie 2025; Eurostat a publicat date la 1 ianuarie 2026 pe 10 iulie 2026, dar tabelul complet pe țări nu a putut fi consultat), suprafețe, TVA, linkurile către operatorii feroviari.

## 2.1.0 — 2026-10-27

Anterior: v2.0.1. Recenzie 2 (2026-10-27).

- Date: populația Franței corectată de la ~68,9 la ~68,6 mil. (Eurostat 68.635.900 și INSEE 68.606.000, 1 ianuarie 2025).
- Portugalia (~11,4 mil.) NU a fost modificată: Eurostat (iulie 2025) ~10,75 mil. vs. INE revizuit ~11,4 mil. Conflict de surse, rămâne „de verificat”.
- Nota „Date și surse” (`z7`) actualizată în 8 limbi; limbile în afară de RO/EN sunt marcate „traducere automată”.
- Test nou `tests/date-surse.test.mjs`.
- Neverificabile (rămân „de verificat”): suprafețe, rate TVA.

## 2.0.1 — 2026-10-27

Anterior: v2.0.0. Recenzie 2026-10-27 (doar texte; logica aplicației nu s-a schimbat).

- Descriere extinsă (meta description, og:description, `fff-info`, `app.json`): ce conține atlasul (21 de state, cu Bulgaria), sursele (BCE, Comisia Europeană, Eurostat) și datele de verificare (8 octombrie 2026; Bulgaria reverificată la 27 octombrie 2026).
- Bloc nou „Date și surse” în subsolul aplicației, în cele 8 limbi (chei `z5`–`z8`): Bulgaria cu sursa (comunicatul BCE din 1 ianuarie 2026), sursa populațiilor (Eurostat `tps00001`, 1 ianuarie 2025), ce nu a fost reverificat și limitele comparatorului.
- Verificare: Bulgaria (zona euro din 1 ianuarie 2026, al 21-lea stat, 1 EUR = 1,95583 leva) confirmată în comunicatul BCE din 1 ianuarie 2026. Bulgaria era deja inclusă în aplicație.
- README (EN/RO): „Stare: stabil”, „Offline: complet”, secțiunea „Date și surse”.
- Hash-ul CSP al scriptului principal recalculat (dicționarul i18n s-a extins); versiunea aliniată în `app.json`, `fff-info`, `sw.js`, subsol.

Nu s-a modificat nicio dată de țară fără sursă. Neverificat acum (marcat „de verificat” în aplicație și README): populațiile (Eurostat `tps00001`), suprafețele, ratele TVA — verificate de autor la 8 octombrie 2026, nereverificate la 27 octombrie 2026 (API-ul Eurostat nu a fost accesibil din mediul de lucru).
