# AGORA — Atlas al Zonei Euro

Ghid offline, într-un singur fișier HTML, despre zona euro: istorie, instituții, cele 21 de state membre, România și euro, plus un ghid practic pentru călători. Proiect personal, informativ, neoficial.

**Live:** https://chiuta.github.io/AGORA/

![Captura de ecran](screenshot.png)

## Ce este

AGORA adună în 59 de secțiuni (meniul din stânga; ☰ pe mobil) explicații despre moneda unică: de la precursorii monetari și Tratatul de la Maastricht, la BCE, Eurogrup, MES, criteriile de convergență, România și euro, drepturi UE pentru călători și un ghid practic. Faptele-cheie au fost reverificate la **8 octombrie 2026** (vezi „Surse verificate"); restul textului este informativ și se poate schimba.

## Funcții

Verificate în cod:
- Hartă mozaic a statelor (zona euro, UE în afara zonei, microstate, folosire unilaterală) cu panou de detaliu la apăsare; listă filtrabilă de state pe valuri de aderare.
- Căutare în meniu (insensibilă la diacritice; Enter deschide profilul unei țări) și în glosar (33 de termeni).
- Chestionar de 28 de întrebări, în ordine amestecată (Fisher–Yates), cu explicații.
- Calculatoare locale: convertor leu–euro cu curs introdus manual, distanță în linie dreaptă între capitale (haversine), buget de călătorie, recomandator de destinație, generator de listă de bagaje.
- Jurnalul călătorului: se ține doar în memoria paginii; poate fi exportat/importat ca fișier JSON (la import se validează țările, datele și lungimea notițelor).
- Comutator regim zi/noapte.

## Manual de utilizare

1. Alege o secțiune din meniul din stânga (pe mobil, apasă ☰); poți căuta după titlu sau după țară.
2. În „Harta interactivă" apasă un pătrățel pentru profilul țării; „Închide ✕" îl ascunde.
3. În „Profiluri de țară" filtrează după valul de aderare și apasă o țară.
4. La „Convertor manual" introdu tu cursul zilei (de exemplu de pe bnr.ro) și suma; atlasul nu preia cursuri de pe internet.
5. În „Chestionar" răspunde la întrebări; „Ia-o de la capăt" repornește.
6. În „Jurnalul călătorului" adaugă vizite; ca să le păstrezi, folosește „Exportă (.json)" și, ulterior, „Importă (.json)".

## Confidențialitate și rețea

- **Stocare:** nu folosește `localStorage`, `sessionStorage`, IndexedDB sau cookie-uri. Jurnalul și rezultatele calculatoarelor dispar la reîncărcarea paginii, dacă nu exporți jurnalul.
- **Rețea:** nu face cereri de rețea (fără `fetch`, scripturi, fonturi sau imagini externe). Politica CSP din pagină blochează conexiunile externe.
- **Linkuri externe** (se deschid doar la apăsare, în filă nouă, cu `rel=noopener`; trimiterea referrer-ului este dezactivată): site-uri ale operatorilor feroviari (oebb.at, belgiantrain.be, bdz.bg, hzpp.hr, elron.ee, vr.fi, sncf-connect.com, bahn.de, hellenictrain.gr, irishrail.ie, trenitalia.com, vivi.lv, ltglink.lt, cfl.lu, ns.nl, cp.pt, zssk.sk, potniski.sz.si, renfe.com), interrail.com, thetrainline.com, omio.com, flixbus.com, mae.ro, econsulat.ro, cardeuropean.ro, chiuta.github.io și trom.tf. Mențiunile de servicii comerciale (feroviare, fintech) sunt informative, nu recomandări.
- **Permisiuni:** nu cere nicio permisiune a browserului.
- Nu există cont, telemetrie sau analiză de trafic.

## Surse verificate (8 octombrie 2026)

- Bulgaria — membră a zonei euro din 1 ianuarie 2026, al 21-lea stat, curs fix 1 EUR = 1,95583 BGN: Consiliul ECOFIN (iulie 2025), BCE, Banque de France, Parlamentul European (EPRS).
- Rapoartele de convergență din 24 iunie 2026 (Comisia Europeană și BCE): valori de referință 2,7% (inflație) și 5,1% (dobânzi pe termen lung); Cehia și Suedia îndeplinesc trei din patru criterii; România: inflație 8,4%, dobânzi 6,7%, deficit 7,9% din PIB în 2025, datorie 59,3% (proiecție 63,4% în 2027), în afara ERM II.
- Populații: Eurostat, `tps00001`, 1 ianuarie 2025 (zona euro, 21 de state: 358,7 mil.).
- Flash Eurobarometer 583 (17 aprilie – 4 mai 2026): sprijin pentru euro în România 65%, Ungaria 80%.
- BCE, comunicat din 23 iulie 2026: zece propuneri de design pentru bancnotele noi, sondaj public până la 21 septembrie 2026.
- Euro digital: votul comisiei ECON a Parlamentului European din 23 iunie 2026 (nu încă în plen).
- TAROM: primul Boeing 737 MAX preluat pe 12 septembrie 2026 (presa de aviație).
- Președinția Eurogrupului: Kyriakos Pierrakakis (ales în decembrie 2025).

## Limite și avertismente

- Ghid informativ, **neoficial**, fără valoare juridică; nu constituie consiliere financiară, juridică sau medicală și nu are legătură cu BCE, Comisia Europeană sau alte instituții.
- Datele se schimbă (cursuri, tarife, reguli de călătorie, programe). Pentru decizii, verifică sursele oficiale.
- Suprafețele statelor, cotele TVA, orarele și duratele de transport, numărul de state cu sisteme de garanție-returnare și informațiile din secțiunile practice nu au fost reverificate la o sursă oficială unică; tratează-le ca orientative.
- Distanțele sunt în linie dreaptă, nu rutiere.
- Calculatorul de buget folosește medii generale, nu prețuri reale.

## Rulare locală / offline

Descarcă `index.html` și deschide-l în browser; funcționează fără internet.

## Licență

Licența nu este încă declarată.

## Autor

Alexio — Alexandru-Ionuț Chiuță, contact: alexio@trom.tf

## English summary

AGORA is a single-file, offline Romanian-language atlas of the euro area (21 members since Bulgaria joined on 1 January 2026): history, institutions, country profiles, Romania and the euro, and a traveller's guide, with a tile map, quiz, glossary and small local calculators. No storage, no network requests, no permissions; the trip journal lives in memory and can be exported/imported as JSON. Key facts were re-checked on 8 October 2026 against ECB, European Commission and Eurostat sources; other content is informational. License not yet declared.
