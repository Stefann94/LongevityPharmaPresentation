import React from 'react';
import styles from './BrandStandard.module.css';

/**
 * Prima secțiune de sub hero, cât timp vitrina este oprită (vezi lib/vitrina.ts).
 *
 * Componentă de server, fără nicio linie de JavaScript în browser: toate
 * efectele de derulare sunt CSS pur, pe `animation-timeline: view()`. Unde
 * browserul nu îl are, secțiunea apare pur și simplu întreagă, fără animație.
 *
 * Numele fișierului e în engleză intenționat: la CSS Modules numele fișierului
 * intră în clasa generată și ajunge în HTML, iar acest component se va copia
 * și pe site-ul englezesc.
 */

const PILONI = [
  {
    titlu: 'Extracte standardizate',
    text: 'Concentrație garantată de principii active, verificată la fiecare intrare în stoc. Nu pudră de plantă măcinată.',
    icon: (
      <>
        <path d="M9 3h6" />
        <path d="M10 3v6.5L4.6 18a2 2 0 0 0 1.7 3h11.4a2 2 0 0 0 1.7-3L14 9.5V3" />
        <path d="M7.5 15h9" />
      </>
    ),
  },
  {
    titlu: 'Testat în laborator terț',
    text: 'Fiecare lot pleacă la un laborator independent: metale grele, pesticide, încărcătură microbiană.',
    icon: (
      <>
        <path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    titlu: 'Doze din studii clinice',
    text: 'Cantitățile pentru care există dovezi publicate, nu urme puse pe etichetă ca să sune bine.',
    icon: (
      <>
        <path d="M3 3v16a2 2 0 0 0 2 2h16" />
        <path d="m7 15 3.5-4 3 2.5L20 7" />
      </>
    ),
  },
  {
    titlu: 'Trasabilitate completă',
    text: 'Știm de unde vine fiecare ingredient și prin ce a trecut până ajunge în flacon.',
    icon: (
      <>
        <circle cx="12" cy="10" r="3" />
        <path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11Z" />
      </>
    ),
  },
];

const CIFRE = [
  { tinta: 100, unitate: '%', text: 'din loturi, testate independent' },
  { tinta: 12, unitate: '', text: 'analize pentru fiecare lot' },
  { tinta: 0, unitate: '', text: 'coloranți și arome artificiale' },
];

export default function BrandStandard() {
  return (
    <section className={styles.sectiune}>
      {/* Pata de lumină care se mișcă lent la derulare. Pur decorativă. */}
      <div className={styles.fundal} aria-hidden="true" />

      <div className="container">
        <div className={styles.antet}>
          <span className={styles.eticheta}>Standardul nostru</span>
          <h2 className={styles.titlu}>
            Fiecare formulă începe într-un{' '}
            <span className={styles.accent}>laborator</span>, nu într-un catalog.
          </h2>
          <p className={styles.introducere}>
            Lucrăm cu extracte standardizate, doze susținute de studii și buletin
            de analiză pentru fiecare lot. Atât. Fără promisiuni decorative și
            fără ingrediente puse pe etichetă doar ca să lungească lista.
          </p>
        </div>

        <div className={styles.grila}>
          {PILONI.map((pilon, i) => (
            <article
              key={pilon.titlu}
              className={styles.pilon}
              // Decalajul face ca stâlpii să intre unul după altul, nu toți
              // deodată. Se citește din CSS, în animation-range.
              style={{ '--pas': i } as React.CSSProperties}
            >
              <span className={styles.index} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className={styles.iconita}>
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {pilon.icon}
                </svg>
              </div>

              <span className={styles.linie} aria-hidden="true" />

              <h3 className={styles.pilonTitlu}>{pilon.titlu}</h3>
              <p className={styles.pilonText}>{pilon.text}</p>
            </article>
          ))}
        </div>

        <div className={styles.cifre}>
          {CIFRE.map((cifra) => (
            <div
              key={cifra.text}
              className={styles.cifra}
              style={{ '--tinta': cifra.tinta } as React.CSSProperties}
            >
              <span className={styles.cifraRand}>
                <span className={styles.cifraValoare}>
                  {/* Valoarea scrisă în HTML este cea reală: rămâne vizibilă în
                      browserele fără animații de derulare, unde numărătoarea
                      din ::after nu pornește. Unitatea stă în afara ei, ca să
                      rămână după cifră în ambele cazuri. */}
                  <span className={styles.cifraStatica}>{cifra.tinta}</span>
                </span>
                {cifra.unitate && (
                  <span className={styles.cifraUnitate}>{cifra.unitate}</span>
                )}
              </span>
              <span className={styles.cifraText}>{cifra.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
