import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './OurStory.module.css';

/**
 * Secventa 1 — "Punctul de plecare". Primul bloc de sub hero.
 *
 * ── CE SPUNE SI CE NU SPUNE ───────────────────────────────────────────────
 * Textul explica de ce doza si absorbtia conteaza la un supliment. Nu contine
 * date, cifre de bilant sau realizari ale firmei: nu e o lauda de magazin, e
 * o pagina de prezentare. Tot ce se afirma aici e verificabil independent —
 * regimul legal al suplimentelor in UE, absorbtia curcuminei, ce contine un
 * buletin de analiza. Vezi CONTINUT-DE-CONFIRMAT.md.
 *
 * Daca cineva vrea sa adauge mai tarziu un an, un procent sau un numar de
 * loturi, sa treaca intai prin fisierul acela: fiecare cifra pusa aici devine
 * o afirmatie care poate fi contestata.
 *
 * ── COREGRAFIE ────────────────────────────────────────────────────────────
 * Trei scene `data-reveal`, plus sectiunea insasi ca a patra, doar pentru
 * fundal. O scena e cat cuprinde ochiul dintr-o privire; fiecare isi conduce
 * propria dezvaluire si o incheie cand a ajuns intreaga pe ecran.
 *
 * Fiecare piesa are doua miscari: INTRAREA, legata de `--p`, care se termina
 * la timp, si DERIVA, legata de `--q`, care continua incet cat timp scena e
 * pe ecran. Vezi blocul din app/globals.css.
 *
 * Numele fisierului e in engleza intentionat: la CSS Modules ajunge in clasa
 * generata, deci si in HTML-ul site-ului englezesc.
 */

// Titlul se dezvaluie cuvant cu cuvant, deci are nevoie de bucati separate.
const TITLU = [
  'Ce', 'scrie', 'pe', 'etichetă', 'și', 'ce', 'ajunge',
  'în', 'organism', 'sunt', 'două', 'lucruri', 'diferite.',
];
const CUVANT_ACCENTUAT = 'diferite.';

// Corpul articolului. `citat` iese din randul textului si se citeste ca o
// afirmatie de sine statatoare.
const CORP: { tip: 'p' | 'citat'; text: string }[] = [
  {
    tip: 'p',
    text: 'Diferența apare în două locuri. Primul e doza: multe formule conțin ingrediente cunoscute în cantități mult sub cele folosite în studiile care le susțin.',
  },
  {
    tip: 'citat',
    text: 'O etichetă poate fi perfect legală și, în același timp, irelevantă biologic.',
  },
  {
    tip: 'p',
    text: 'Al doilea e absorbția. Curcumina, fără un sistem de livrare — piperină, fosfolipide, formă lipozomală — trece prin organism aproape neatinsă. Cantitatea înghițită și cantitatea folosită nu coincid.',
  },
  {
    tip: 'p',
    text: 'Diferențele nu se opresc la ingredientul activ. Capsula, agenții de curgere și coloranții intră și ei în ce înghiți, deși nu apar niciodată în argumentul de vânzare.',
  },
  {
    tip: 'p',
    text: 'De aceea, înainte de orice formulă, se pun trei întrebări.',
  },
];

const INTREBARI = [
  {
    titlu: 'Ce concentrație are extractul?',
    text: 'Un extract standardizat declară procentul de substanță activă. O pulbere de plantă măcinată nu spune nimic despre cât conține.',
  },
  {
    titlu: 'Ce doză a fost testată?',
    text: 'Cantitatea per porție are sens doar raportată la cea folosită în studiile care susțin ingredientul. Sub ea, prezența pe etichetă rămâne decorativă.',
  },
  {
    titlu: 'Cine a măsurat lotul?',
    text: 'Un buletin de analiză confirmă identitatea, potența, metalele grele și încărcătura microbiologică pentru lotul respectiv, nu pentru formulă în general.',
  },
];

export default function OurStory() {
  return (
    // Sectiunea e ea insasi un bloc, dar numai pentru fundal: petele de lumina
    // se misca dupa traversarea ei intreaga, mult mai lent decat orice piesa
    // dinauntru. Scenele au propriile lor `data-reveal` si isi calculeaza
    // singure progresul, deci nu il mostenesc pe al sectiunii.
    <section className={styles.sectiune} data-reveal>
      <div className={styles.pataSus} aria-hidden="true" data-in="cover" />
      <div className={styles.pataJos} aria-hidden="true" data-in="cover" />

      <div className="container">

        {/* SCENA 1 — antetul */}
        <header className={styles.antet} data-reveal>
          <span
            className={styles.eticheta}
            data-in
            style={{ '--s': 0, '--e': 0.4 } as React.CSSProperties}
          >
            Punctul de plecare
          </span>

          <h2 className={styles.titlu}>
            {TITLU.map((cuvant, i) => (
              <span key={`${cuvant}-${i}`} className={styles.masca}>
                <span
                  className={cuvant === CUVANT_ACCENTUAT ? styles.cuvantAccent : styles.cuvant}
                  data-in
                  style={{
                    '--s': +(0.03 + i * 0.021).toFixed(3),
                    '--e': +(0.31 + i * 0.021).toFixed(3),
                  } as React.CSSProperties}
                >
                  {cuvant}
                </span>
              </span>
            ))}
          </h2>

          {/* Linia care inchide antetul: intai firul cenusiu pe toata
              latimea, apoi segmentul auriu peste el. Amandoua sunt decor, asa
              ca pot sa se termine si dupa ce antetul e intreg pe ecran. */}
          <div
            className={styles.linieAntet}
            aria-hidden="true"
            data-in
            data-in-after=""
            style={{ '--s': 0.42, '--e': 0.82 } as React.CSSProperties}
          />
        </header>

        <div className={styles.continut}>

          {/* SCENA 2a — imaginea */}
          <div className={styles.coloanaImagine} data-reveal>
            <div className={styles.aura} aria-hidden="true" data-in="cover" />

            <figure className={styles.figura}>
              {/* Coltarele stau in AFARA cadrului, pe fundal deschis: peste
                  fotografie, un fir auriu subtire se pierdea complet. */}
              <div className={styles.cadru}>
                <span
                  className={`${styles.coltar} ${styles.coltarSusStanga}`}
                  aria-hidden="true"
                  data-in
                  style={{ '--s': 0.3, '--e': 0.74 } as React.CSSProperties}
                />
                <span
                  className={`${styles.coltar} ${styles.coltarJosDreapta}`}
                  aria-hidden="true"
                  data-in
                  style={{ '--s': 0.36, '--e': 0.8 } as React.CSSProperties}
                />

                <div
                  className={styles.rama}
                  data-in
                  style={{ '--s': 0, '--e': 0.52 } as React.CSSProperties}
                >
                  {/* .webp, nu .png: la export static imaginile sunt servite
                      neoptimizate (vezi next.config.ts), iar originalul avea
                      994 KB. Convertit, are 207 KB. */}
                  <Image
                    src="/images/despre/about_hero.webp"
                    alt="Interiorul unui laborator, cu doi specialiști la masa de lucru"
                    fill
                    sizes="(max-width: 980px) 100vw, 50vw"
                    className={styles.imagine}
                    data-in="cover"
                    priority
                  />

                  {/* Lumina care trece o singura data peste imagine, in timpul
                      dezvaluirii. Pur decorativa. */}
                  <span
                    className={styles.lumina}
                    aria-hidden="true"
                    data-in
                    style={{ '--s': 0.06, '--e': 0.66 } as React.CSSProperties}
                  />
                </div>
              </div>

              <figcaption
                className={styles.legendaImagine}
                data-in
                data-in-before=""
                style={{ '--s': 0.44, '--e': 0.88 } as React.CSSProperties}
              >
                Concentrația unui extract se stabilește în laborator, nu pe ambalaj
              </figcaption>
            </figure>

            {/* Insigna trimite la cele trei intrebari de mai jos. Nu e o cifra
                de bilant si nu se refera la firma. */}
            <div
              className={styles.insigna}
              data-in
              style={{ '--s': 0.32, '--e': 0.78 } as React.CSSProperties}
            >
              <span className={styles.insignaNumar}>3</span>
              <span className={styles.insignaText}>
                Întrebări înainte
                <br />
                de orice formulă
              </span>
            </div>
          </div>

          {/* SCENA 2b — textul */}
          <div className={styles.coloanaText} data-reveal>
            <p
              className={styles.introducere}
              data-in
              data-in-before=""
              style={{ '--s': 0, '--e': 0.42 } as React.CSSProperties}
            >
              În Uniunea Europeană, un supliment alimentar se notifică, nu se
              autorizează. Nimeni nu-i cere producătorului dovada că doza de pe
              etichetă face ceva.
            </p>

            <div className={styles.corp}>
              {CORP.map((bucata, i) => {
                /* Pasul e ales astfel incat ultima bucata sa se aseze la 0.92
                   din progresul scenei — deci inainte ca scena sa fi ajuns
                   intreaga pe ecran. Daca se mai adauga un paragraf, pasul
                   trebuie strans, altfel ultimul intra prea tarziu. */
                const fereastra = {
                  '--s': +(0.06 + i * 0.1).toFixed(3),
                  '--e': +(0.52 + i * 0.1).toFixed(3),
                } as React.CSSProperties;

                return bucata.tip === 'citat' ? (
                  <blockquote
                    key={i}
                    className={styles.citat}
                    data-in
                    data-in-before=""
                    style={fereastra}
                  >
                    {bucata.text}
                  </blockquote>
                ) : (
                  <p key={i} data-in style={fereastra}>
                    {bucata.text}
                  </p>
                );
              })}
            </div>
          </div>

        </div>

        {/* SCENA 3 — cele trei intrebari */}
        <div className={styles.intrebari} data-reveal>
          <ol className={styles.carduri}>
            {INTREBARI.map((intrebare, i) => (
              <li
                key={intrebare.titlu}
                className={styles.card}
                data-in
                data-in-before=""
                /* --s / --e: fereastra cardului. --ps / --pe: fereastra firului
                   auriu de pe muchia lui de sus, care nu poate purta atribute
                   proprii. --deriva: amplitudinea plutirii lente, alternata
                   intre carduri ca sa se miste in adancimi diferite. */
                style={{
                  '--s': +(0.04 + i * 0.13).toFixed(3),
                  '--e': +(0.56 + i * 0.13).toFixed(3),
                  '--ps': +(0.26 + i * 0.13).toFixed(3),
                  '--pe': +(0.68 + i * 0.13).toFixed(3),
                  '--deriva': `calc(${i === 1 ? 20 : 9}px * var(--adancime))`,
                } as React.CSSProperties}
              >
                <span className={styles.cardIndice} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.cardTitlu}>{intrebare.titlu}</h3>
                <p className={styles.cardText}>{intrebare.text}</p>
              </li>
            ))}
          </ol>

          <Link
            href="/calitate"
            className={styles.legatura}
            data-in
            style={{ '--s': 0.5, '--e': 0.92 } as React.CSSProperties}
          >
            Despre calitate și ingrediente
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
