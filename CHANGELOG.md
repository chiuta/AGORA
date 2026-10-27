# Jurnal de modificări — AGORA

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
