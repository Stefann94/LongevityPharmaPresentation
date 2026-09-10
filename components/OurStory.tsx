import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './OurStory.module.css';

/**
 * "Povestea noastră" — prima secțiune de sub hero.
 *
 * Aranjament: titlul ocupă lățimea întreagă, sus. Abia sub el vin imaginea și
 * textul, unul lângă altul. Așa imaginea nu mai concurează cu titlul pentru
 * lățime și poate fi mare — la fel de înaltă cât coloana de text.
 *
 * Mișcarea e legată de cât s-a derulat, nu de un prag: fiecare element are
 * `data-scrub` (decalajul de pornire) și, unde e cazul, `--i` (poziția în
 * cascadă). Vezi comentariul din OurStory.module.css pentru cele două moduri
 * în care sunt conduse.
 *
 * Numele fișierului e în engleză intenționat: la CSS Modules ajunge în clasa
 * generată, deci și în HTML-ul site-ului englezesc.
 *
 * ATENȚIE la conținut: anii, numărul de furnizori și cel de laboratoare sunt
 * text de prezentare, nu date verificate. De confirmat înainte de publicare.
 */

// Titlul se dezvăluie cuvânt cu cuvânt, deci are nevoie de bucăți separate.
const TITLU = [
  'Am', 'început', 'cu', 'o', 'listă', 'de',
  'întrebări', 'la', 'care', 'nimeni', 'nu', 'răspundea',
];
const CUVANT_ACCENTUAT = 'răspundea';

const PARAGRAFE = [
  'În 2013 am început să comparăm sistematic suplimentele de pe piața din România: ce ingredient conțin, în ce doză și cu ce dovezi în spate. Am parcurs sute de etichete, iar concluzia s-a repetat. Numele ingredientelor erau impresionante, cantitățile erau prea mici ca să conteze, iar studiile care ar fi trebuit să le susțină lipseau.',
  'Ne-au trebuit șase ani și nouă furnizori până să găsim doi care acceptau condiția noastră de bază: buletinul de analiză înainte de comandă, nu după. Prima formulă Longevity Pharma a ieșit din laborator în 2019.',
  'De atunci, fiecare produs urmează același traseu — extract standardizat cu concentrație verificată, doză stabilită după literatura clinică, lot testat într-un laborator independent. Preferăm un catalog mic, la care putem răspunde la orice întrebare, în locul unuia mare și convenabil.',
];

const CIFRE = [
  { valoare: '9', text: 'Furnizori evaluați' },
  { valoare: '6 ani', text: 'Până la prima formulă' },
];

export default function OurStory() {
  return (
    <section className={styles.sectiune}>
      <div className="container">

        {/* ANTET pe toată lățimea */}
        <header className={styles.antet}>
          <span className={styles.eticheta} data-scrub="0">
            Povestea noastră
          </span>

          <h2 className={styles.titlu}>
            {TITLU.map((cuvant, i) => (
              <span key={`${cuvant}-${i}`} className={styles.masca}>
                <span
                  className={
                    cuvant === CUVANT_ACCENTUAT ? styles.cuvantAccent : styles.cuvant
                  }
                  style={{ '--i': i } as React.CSSProperties}
                  data-scrub={(0.02 + i * 0.026).toFixed(3)}
                >
                  {cuvant}
                </span>
              </span>
            ))}
          </h2>
        </header>

        <div className={styles.continut}>

          {/* IMAGINE */}
          <div className={styles.coloanaImagine}>
            <div className={styles.aura} aria-hidden="true" data-scrub="0" data-scrub-range="cover" />

            <div className={styles.rama} data-scrub="0.04">
              {/* .webp, nu .png: la export static imaginile sunt servite
                  neoptimizate (vezi next.config.ts), iar originalul avea
                  994 KB. Convertit, are 207 KB. */}
              <Image
                src="/images/despre/about_hero.webp"
                alt="Doi specialiști analizează un extract standardizat într-un laborator"
                fill
                sizes="(max-width: 900px) 100vw, 56vw"
                className={styles.imagine}
                data-scrub="0"
                data-scrub-range="cover"
              />
            </div>

            {/* Badge-ul plutitor: intră lateral, după imagine. */}
            <div className={styles.insigna} data-scrub="0.34">
              <span className={styles.insignaNumar}>2019</span>
              <span className={styles.insignaText}>
                Anul primei
                <br />
                formule
              </span>
            </div>
          </div>

          {/* TEXT */}
          <div className={styles.coloanaText}>
            <p className={styles.introducere} data-scrub="0.08">
              Longevity Pharma s-a format în jurul unei echipe de farmaciști și
              specialiști în nutriție care se loveau, fiecare separat, de aceeași
              problemă.
            </p>

            <div className={styles.paragrafe}>
              {PARAGRAFE.map((text, i) => (
                <p
                  key={i}
                  style={{ '--i': i } as React.CSSProperties}
                  data-scrub={(0.14 + i * 0.07).toFixed(3)}
                >
                  {text}
                </p>
              ))}
            </div>

            <div className={styles.cifre}>
              {CIFRE.map((cifra, i) => (
                <div
                  key={cifra.text}
                  className={styles.cifra}
                  style={{ '--i': i } as React.CSSProperties}
                  data-scrub={(0.4 + i * 0.06).toFixed(3)}
                >
                  <span className={styles.cifraValoare}>{cifra.valoare}</span>
                  <span className={styles.cifraText}>{cifra.text}</span>
                </div>
              ))}
            </div>

            <Link href="/jurnal" className={styles.legatura} data-scrub="0.5">
              Citește din jurnalul nostru științific
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
      </div>
    </section>
  );
}
