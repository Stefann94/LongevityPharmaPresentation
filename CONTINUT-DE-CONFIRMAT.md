# Conținut de confirmat înainte de publicare

Site-ul e de prezentare, nu de vânzare. Regula de scriere, stabilită cu
clientul: **fără date, fără cifre de bilanț, fără realizări ale firmei.** Nu
lăudăm un magazin — explicăm cum se citește un supliment.

Asta scoate din discuție „primul produs în 2019", „nouă furnizori evaluați",
„100% din loturi" și tot ce seamănă cu ele. Nu pentru că ar fi neapărat false,
ci pentru că fiecare e o afirmație care poate fi cerută la control și nu poate
fi verificată de un cititor din afară.

Ce rămâne sunt **fapte de domeniu**: adevărate independent de firmă,
verificabile în legislație sau în literatura de specialitate. Nu au nevoie de
confirmare de la client, doar de o citire care să confirme că le-am formulat
corect.

---

## Secvența 1 — „Punctul de plecare" (`components/OurStory.tsx`)

### Ce se afirmă, cu sursa

1. **„În Uniunea Europeană, un supliment alimentar se notifică, nu se
   autorizează."**
   Suplimentele sunt reglementate ca *aliment*, prin Directiva 2002/46/CE, nu
   ca medicament. În România, punerea pe piață se face prin notificare. Spre
   deosebire de medicamente, nu există o evaluare prealabilă a eficacității.

2. **„Nimeni nu-i cere producătorului dovada că doza de pe etichetă face
   ceva."**
   Consecința directă a punctului 1. Mențiunile de sănătate sunt reglementate
   separat, prin Regulamentul (CE) 1924/2006, iar cele pentru plante sunt în
   mare parte încă „în așteptare" — dar acela reglementează *ce se poate
   scrie*, nu obligă la dovada dozei.

3. **„Multe formule conțin ingrediente cunoscute în cantități mult sub cele
   folosite în studiile care le susțin."**
   Afirmație generală despre piață, nu despre un produs anume. Formulată cu
   „multe", nu „toate" — intenționat.

4. **„Curcumina, fără un sistem de livrare, trece prin organism aproape
   neatinsă."**
   Biodisponibilitatea orală scăzută a curcuminei este bine documentată, la fel
   și creșterea absorbției prin piperină, complexare cu fosfolipide sau formă
   lipozomală.

5. **„Capsula, agenții de curgere și coloranții intră și ei în ce înghiți."**
   Descrie compoziția obișnuită a unei capsule. Nu afirmă nimic despre ce
   folosește sau nu folosește Longevity Pharma.

6. **Cele trei întrebări** (concentrația extractului, doza testată, cine a
   măsurat lotul) — sunt criterii de evaluare, formulate ca întrebări. Nu
   afirmă că firma le îndeplinește. Buletinul de analiză descris în a treia
   conține într-adevăr identitate, potență, metale grele și microbiologie.

### Singurul lucru de decis

**Fotografia** (`public/images/despre/about_hero.webp`) este o imagine generată,
nu o poză din laboratorul real. Legenda a fost scrisă neutru tocmai de aceea —
„Concentrația unui extract se stabilește în laborator, nu pe ambalaj" descrie o
idee, nu ce se vede în cadru. Dacă apare o fotografie reală, legenda poate
deveni descriptivă.

---

## Dacă cineva vrea totuși să adauge cifre

Trei condiții, toate trei:

1. să poată fi susținută cu un document, nu cu o estimare;
2. să fie trecută în tabelul de mai sus, cu sursa;
3. să stea într-o constantă la începutul componentei, nu îngropată în text.

Cel mai puternic lucru care s-ar putea adăuga vreodată acestui site nu e o
cifră, ci **buletinele de analiză publicate pe lot**. Ar transforma tot ce scrie
mai sus din afirmație în ceva verificabil de oricine.
