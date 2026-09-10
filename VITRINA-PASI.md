# Ascunderea produselor — jurnal de lucru

Scop: site-ul rămâne întreg (cont, coș, abonamente, jurnal, calitate, contact),
dar nu mai afișează niciun produs. Când primim produsele reale, se dă
întrerupătorul înapoi și magazinul revine exact cum era.

**Nimic nu s-a șters** — nici cod, nici date. Produsele sunt intacte în Supabase.
Nu s-a rulat niciun SQL.

---

## Întrerupătorul

`lib/vitrina.ts` — fișier nou.

```ts
export const PRODUSE_ASCUNSE = true;

export function produseVizibile<T>(lista: T[] | null | undefined): T[] {
  return PRODUSE_ASCUNSE ? [] : (lista ?? []);
}
```

### Cum se dă înapoi

1. `PRODUSE_ASCUNSE = false`
2. redenumește `app/produs/[slug]/_page.tsx` înapoi în `page.tsx`
   (EN: `app/product/[slug]/`)
3. **`rm -rf .next`** — obligatoriu. Next.js păstrează în cache răspunsurile
   Supabase de la build-ul anterior. Fără pasul ăsta iese un site pe jumătate:
   produse în unele pagini, lipsă în altele. Am pățit-o deja la traducerea în
   engleză, unde primul build de după SQL a scos 504 texte românești din cache.
4. rebuild

Pașii 1 și 2 sunt legați: dacă faci doar unul, build-ul cade cu
`Page "/produs/[slug]" is missing "generateStaticParams()"`. E intenționat —
mai bine o eroare zgomotoasă decât un site pe jumătate.

---

## Modificări, fișier cu fișier

Coloana din dreapta e calea din proiectul englezesc — rutele au fost redenumite
acolo, restul e identic.

| # | RO | EN | Ce s-a schimbat |
|---|---|---|---|
| 1 | `lib/vitrina.ts` | idem | fișier nou (vezi mai sus) |
| 2 | `app/produs/[slug]/page.tsx` | `app/product/[slug]/` | redenumit în `_page.tsx` + gardă în `generateStaticParams` |
| 3 | `app/categorie/[slug]/page.tsx` | `app/category/[slug]/` | `products={produseVizibile(products)}` |
| 4 | `app/page.tsx` | idem | 4 secțiuni prin `produseVizibile` |
| 5 | `components/Header.tsx` | idem | `featuredProducts={produseVizibile(...)}` |
| 6 | `components/HeaderClient.tsx` | idem | căutare live oprită + coloana „Produse de Top" ascunsă |
| 7 | `app/produse/SearchResultsClient.tsx` | `app/products/` | căutare oprită |
| 8 | `app/bestsellers/page.tsx` | idem | `produseVizibile` |
| 9 | `app/pachete/page.tsx` | `app/bundles/` | `produseVizibile` |
| 10 | `app/jurnal/[slug]/page.tsx` | `app/journal/[slug]/` | blocul de recomandări dispare de tot |
| 11 | `app/cart/page.tsx` | idem | caruselul public de recomandări golit |
| 12 | `app/account/favorite/FavoritesClient.tsx` | `app/account/favorites/` | favoritele vechi nu mai afișează produse |
| 13 | `app/sitemap.ts` | idem | harta nu mai anunță pagini de produs |
| 14 | `components/Header.tsx` | idem | promoția din meniu nu mai duce spre o pagină de produs |

### Detalii care contează

**2 — paginile de produs. Aici a fost singura surpriză.**

Planul inițial era ca `generateStaticParams` să întoarcă `[]`. **Nu merge.**
Next.js 16 cu `output: export` respinge o rută dinamică fără niciun parametru:

```
Error: Page "/produs/[slug]" is missing "generateStaticParams()"
       so it cannot be used with "output: export" config.
```

Condiția e în `node_modules/next/dist/build/index.js` (~linia 1362): zero rute
pre-generate înseamnă, pentru Next, că funcția lipsește. O listă goală nu e o
opțiune.

Soluția: fișierul de rută se numește acum `_page.tsx`. Next.js recunoaște doar
`page.tsx`, deci ruta pur și simplu nu mai există — zero pagini generate, zero
fișiere-fantomă în `out/`.

**Nu redenumi tot folderul** în `_produs`: `AddToCartButton` și `FavoriteButton`
importă `ProductPage.module.css` din el și s-ar rupe. Doar fișierul de rută.

Garda `if (PRODUSE_ASCUNSE) return []` rămâne în fișier ca declanșator: dacă
cineva redenumește înapoi fără să comute constanta, build-ul cade cu eroarea de
mai sus în loc să scoată un site incoerent.

Restul fișierului (metadata, corpul paginii, produse similare) e neatins.

**4 — pagina principală.** Nu am atins componentele. `ProductSection` și
`ProductCarousel` aveau deja `if (!products || products.length === 0) return null`,
deci secțiunile dispar singure când primesc listă goală. Rămân: hero, categoriile
rapide, bannerul promo, cardurile „Descoperă după obiectiv", bannerul de contact.

**6 și 7 — căutarea.** Aici era capcana. `search_products` este o funcție RPC
apelată **din browser**, nu la build. Fără gardă, produsele ascunse din pagini ar
fi fost în continuare găsite scriind în bara de căutare. Ambele locuri (sugestiile
din antet și pagina de rezultate) sunt oprite înainte de apelul către bază.

**11 — coșul.** `/cart` e public, fără autentificare, și afișa un carusel cu 8
produse. Era singurul loc din site rămas cu produse vizibile pentru un vizitator
oarecare.

**13 — harta site-ului.** Categoriile rămân în hartă (paginile lor există în
continuare); doar produsele ies. Altfel Google ar fi primit 110 adrese moarte.

**14 — promoția din meniu.** Găsită abia la verificare, nu era în plan. Rândul
activ din tabelul `promos` are `link_url = /produs/protocol-anti-aging`, iar
blocul apărea în meniul mare din antet, pe fiecare pagină. Cu ruta parcată,
acela era un link mort în tot site-ul. Acum, cât timp vitrina e oprită și
adresa începe cu `/produs/`, `link_url` se scoate și promoția rămâne un bloc
simplu, neclicabil — comportament pe care HeaderClient îl avea deja pentru
promoțiile fără link. **Baza de date nu s-a atins.**

---

## Ce a rămas intenționat neatins

- **Paginile de categorie** se generează în continuare, cu grilă goală. Au deja
  stare de gol proprie. Aici intră conținutul de prezentare, la pasul următor.
- **Comenzile din cont** (`app/account/comenzi`) — e istoricul propriu al
  clientului, nu vitrină. Nu are sens să dispară.
- **`app/cart/actions.ts`, `app/checkout/actions.ts`, `app/favorites/actions.ts`** —
  scriu în bază, nu citesc pentru afișare. Fără produse afișate nu are cine să le
  apeleze.
- **`components/ProductSection.tsx`, `ProductCarousel.tsx`, `AddToCartButton`,
  `FavoriteButton`** — neatinse, ca revenirea să fie doar o comutare.
- **Regulile CSS** rămase fără folosință — inofensive, și necesare la revenire.

## Ce NU face întrerupătorul

Produsele rămân în Supabase. Cine are cheia publică le poate interoga direct.
Pentru un site de prezentare e acceptabil, dar nu sunt șterse — doar nu mai apar
în paginile publicate.

---

## Verificare (de repetat identic pe engleză)

Rezultatele obținute pe română, după `rm -rf .next out && npx next build`:

| Verificare | Rezultat |
|---|---|
| pagini generate | **41** (erau ~154) |
| `out/produs/` există? | nu |
| apariții `/produs/` în HTML | **0** |
| apariții `Adaugă în coș` | **0** |
| adrese `/produs/` în `sitemap.xml` | **0** (22 adrese rămase) |
| linkuri + imagini verificate | **1626** |
| adrese rupte | **0** |

Pe engleză se caută `/product/`, `Add to cart`, `out/product/`.

`RON` apare în continuare în pagini — dar numai în pragul de transport gratuit
(„peste 200 RON"), nu în prețuri de produs. Pe engleză, echivalentul e `€`.

Verificatorul de linkuri e în scratchpad-ul sesiunii (`verifica-linkuri.mjs`):
parcurge tot `out/`, extrage fiecare `href` și `src` intern și confirmă că există
fișierul corespunzător, ținând cont de regulile `.htaccess` (`/x` → `x.html` sau
`x/index.html`).

### Starea vizuală, după ascundere

- **Pagina principală** păstrează: hero, categoriile rapide, bannerul promo,
  „Descoperă după obiectiv", bannerul de contact. Titlurile rămase: *Extracte
  Naturale, Puritate Maximă* · *Performanță Mentală Absolută* · *Descoperă după
  obiectiv* · *Energie & Focus* · *Anti-Aging* · *Imunitate & Detox* · *Ai nevoie
  de îndrumare?*
- **Categorii** — „🔬 Momentan nu avem produse disponibile în această categorie."
- **Bestsellers** — „Momentan nu avem produse bestseller disponibile."
- **Pachete** — „Momentan nu avem pachete promoționale disponibile."

Sunt stările de gol care existau deja în cod. Acolo intră conținutul de
prezentare la etapa următoare.

---

## Conținutul de prezentare

Se lucrează întâi pe română, apoi se traduce pe engleză.

### Secțiunea 1 — „Standardul nostru" (gata)

Fișiere noi: `components/BrandStandard.tsx` + `components/BrandStandard.module.css`.
Inserată în `app/page.tsx` imediat după `<HeroCarousel />`.

**Numele fișierului e în engleză intenționat.** La CSS Modules numele fișierului
intră în clasa generată (`BrandStandard-module__xyz__pilon`) și ajunge în HTML-ul
livrat. Un nume românesc ar fi însemnat română ascunsă în site-ul englezesc — exact
ce am curățat la traducere. Aceeași regulă pentru toate secțiunile următoare.

**Zero JavaScript.** Componentă de server, fără `'use client'`. Toate efectele de
derulare sunt CSS pur, pe `animation-timeline: view()`. La build ies fișiere `.css`
obișnuite — verificat: regulile sunt în `_next/static/chunks/*.css`, iar textul
secțiunii nu apare în niciun chunk `.js`.

**Regula de siguranță din CSS**, de respectat la fiecare secțiune nouă: starea
implicită a fiecărui element este cea *finală* (vizibil, la locul lui). Animațiile
se adaugă doar în interiorul lui `@supports (animation-timeline: view())`, imbricat
în `@media (prefers-reduced-motion: no-preference)`. Un browser fără suport
afișează secțiunea întreagă, nu una goală — greșeala clasică la efectele „apare la
scroll". Iar cine are animațiile reduse din sistem primește versiunea statică.

**Efecte folosite** (a nu se repeta la secțiunile următoare): paralaxă pe pata de
lumină din fundal; urcare eșalonată a antetului; subliniere aurie trasă de la
stânga; stâlpi care intră unul după altul, decalajul venind din `--pas` pus pe
fiecare card în markup și citit în `animation-range` prin `calc()`; bandă de cifre
descoperită cu `clip-path`; numărătoare de la zero.

**Numărătoarea**, singura parte cu adevărat delicată: `@property --numarator` cu
`syntax: '<integer>'` și `inherits: true`, animată pe `.cifraValoare`, citită în
`::after` prin `counter-reset: numar var(--numarator)` + `content: counter(numar)`.
O variabilă CSS neînregistrată nu poate fi animată — ar sări direct la final.
Cifra reală e scrisă și în HTML, într-un `<span>` ascuns doar în interiorul lui
`@supports`; așa, fără suport, se vede numărul, nu un gol.

**La traducere** se schimbă doar textele din cele două liste din `.tsx`
(`PILONI`, `CIFRE`) plus eticheta, titlul și paragraful de introducere. CSS-ul se
copiază neatins.
