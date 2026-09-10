# Longevity Pharma — site de prezentare

Site de prezentare pentru Longevity Pharma. Produsele sunt **ascunse**: până
când primim catalogul real, site-ul afișează doar conținut editorial —
povestea, standardele de lucru, jurnalul științific.

Proiectul pornește din codul site-ului `longevitypharma.ro` și îi păstrează
istoricul. De aici încolo evoluează separat.

## Cum pornești

```bash
npm install
npm run dev
```

Are nevoie de `.env.local` cu cheile Supabase. Fișierul nu este în git.

## Cum se construiește

```bash
rm -rf .next out
npm run build
```

Rezultatul ajunge în `out/` — HTML, CSS și JavaScript statice, care se urcă pe
orice găzduire obișnuită. Nu are nevoie de Node pe server.

**`rm -rf .next` nu e opțional.** Next.js ține în cache răspunsurile Supabase
de la build-ul anterior; fără pasul ăsta poate ieși un site pe jumătate, cu date
vechi în unele pagini și noi în altele.

## Produsele ascunse

Întrerupătorul este în [`lib/vitrina.ts`](lib/vitrina.ts). Procedura completă de
ascundere și de revenire, fișier cu fișier, este în
[`VITRINA-PASI.md`](VITRINA-PASI.md).

Produsele **nu sunt șterse** din baza de date. Nu mai apar în paginile
publicate, atât.

## Secțiunile de prezentare

| Componentă | Rol |
|---|---|
| `components/OurStory.tsx` | „Povestea noastră" — prima secțiune de sub hero |
| `components/BrandStandard.tsx` | „Standardul nostru" — a doua secțiune |
| `components/FeaturedStory.tsx` | Articol de deschidere; **scrisă, dar nefolosită încă** |
| `components/ScrollScrub.tsx` | Conduce animațiile legate de derulare |

### Cum funcționează animațiile

Animațiile nu rulează: stau **oprite** (`animation-play-state: paused`) și sunt
fixate în loc de o întârziere negativă legată de cât s-a derulat. `ScrollScrub`
scrie variabila `--p` (0 → 1) pe fiecare element cu `data-scrub`, la fiecare
cadru. Mergi înapoi cu scroll-ul, animația se derulează înapoi.

Fără JavaScript, `--p` rămâne 1 și totul se vede în starea finală. Cine are
animațiile reduse din sistem nu primește niciuna.

`OurStory` folosește mecanismul ăsta. `BrandStandard` și `FeaturedStory` merg
încă pe `animation-timeline: view()` — CSS nativ, dar suportat doar de Chrome și
Edge. **De convertit.**

## De confirmat înainte de publicare

Cifrele din „Povestea noastră" — anul 2013, anul 2019, cei nouă furnizori, cele
două laboratoare — sunt **text de prezentare, nu date verificate**.
