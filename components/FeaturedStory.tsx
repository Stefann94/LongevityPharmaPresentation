import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FeaturedStory.module.css';
import type { JournalArticle } from '@/app/jurnal/actions';

/**
 * Articolul de deschidere — prima secțiune de sub hero.
 *
 * Cât timp catalogul nu e public, conținutul site-ului sunt articolele. Aici
 * apare unul singur, cu spațiu generos, ca o copertă de revistă: un text pus
 * în valoare spune mai mult decât patru înghesuite.
 *
 * Componentă de server, fără JavaScript în browser. Efectele de derulare sunt
 * CSS pur, pe `animation-timeline: view()` — vezi comentariul din
 * BrandStandard.module.css pentru regula de siguranță.
 *
 * Numele fișierului e în engleză intenționat: la CSS Modules ajunge în clasa
 * generată, deci și în HTML-ul site-ului englezesc.
 */

// Estimare la 200 de cuvinte pe minut. Nu e o știință exactă, dar dă
// vizitatorului o idee corectă despre cât are de citit.
function minuteDeCitit(text: string | null | undefined): number {
  if (!text) return 3;
  const cuvinte = text.trim().split(/\s+/).length;
  return Math.max(2, Math.round(cuvinte / 200));
}

function formateazaData(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function FeaturedStory({ articol }: { articol: JournalArticle | null }) {
  // Fără articole în bază, secțiunea dispare complet, în loc să lase un gol.
  if (!articol) return null;

  const minute = minuteDeCitit(articol.content);
  const data = formateazaData(articol.published_at);
  const rubrica = articol.tags?.[0] ?? 'Jurnal';

  return (
    <section className={styles.sectiune}>
      <div className="container">
        <div className={styles.antet}>
          <span className={styles.eticheta}>Din jurnalul științific</span>
          <span className={styles.linieAntet} aria-hidden="true" />
        </div>

        <div className={styles.continut}>
          {/* IMAGINE */}
          <div className={styles.coloanaImagine}>
            <Link href={`/jurnal/${articol.slug}`} className={styles.rama}>
              <Image
                src={articol.image_url}
                alt={articol.title}
                fill
                sizes="(max-width: 900px) 100vw, 52vw"
                className={styles.imagine}
                priority={false}
              />
            </Link>

            {/* Badge-ul plutitor: intră lateral, după imagine. */}
            <div className={styles.insigna}>
              <span className={styles.insignaRubrica}>{rubrica}</span>
              <span className={styles.insignaMinute}>{minute} min de citit</span>
            </div>
          </div>

          {/* TEXT */}
          <div className={styles.coloanaText}>
            {articol.tags && articol.tags.length > 0 && (
              <div className={styles.pastile}>
                {articol.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className={styles.pastila}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h2 className={styles.titlu}>
              <Link href={`/jurnal/${articol.slug}`} className={styles.titluLink}>
                {articol.title}
              </Link>
            </h2>

            <p className={styles.rezumat}>{articol.summary}</p>

            <div className={styles.meta}>
              <span className={styles.autor}>{articol.author}</span>
              {data && (
                <>
                  <span className={styles.separator} aria-hidden="true">
                    ·
                  </span>
                  <time dateTime={articol.published_at}>{data}</time>
                </>
              )}
            </div>

            <div className={styles.actiuni}>
              <Link href={`/jurnal/${articol.slug}`} className={styles.butonPrincipal}>
                Citește articolul
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
              <Link href="/jurnal" className={styles.butonSecundar}>
                Toate articolele
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
