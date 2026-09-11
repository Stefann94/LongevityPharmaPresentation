"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { FocusEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HeroCarousel.module.css';

export type Slide = {
  id: string | number;
  image: string;
  label: string;
  title: string;
  description: string;
};

interface HeroCarouselProps {
  slides: Slide[];
}

/** Cat sta un slide pe ecran. E si durata umplerii barei: aceeasi valoare
 *  conduce si ceasul, si desenul — vezi bucla de mai jos. */
const DURATA_SLIDE = 6000;

/*
 * TRECEREA DINTRE SLIDE-URI
 *
 * Slide-urile stau pe o banda imaginara, una langa alta, fiecare cat o latime
 * de ecran. `pozitie` spune unde e banda acum (1.5 = la jumatea drumului dintre
 * al doilea si al treilea), `tinta` unde trebuie sa ajunga. O sageata muta
 * tinta cu o pagina; banda o urmeaza. Textul si imaginea unui slide stau in
 * acelasi loc pe banda, deci pleaca si vin impreuna.
 *
 * De ce JavaScript si nu animatii CSS: o animatie CSS pornita nu poate fi
 * grabita si nu poate prelua din mers o miscare inceputa. La clicuri repezi,
 * slide-ul de la jumatea drumului sarea inapoi la start. Aici, un clic dat in
 * timpul unei treceri doar muta tinta mai departe (sau inapoi): banda nu se
 * opreste, ci accelereaza spre noua tinta, ori se intoarce lin din mers.
 */

/** Cat tine o trecere de un slide, pornita din repaus. */
const DURATA_TRECERE = 950;

/** O trecere ceruta cat timp banda e deja in miscare tine doar atat din durata
 *  obisnuita. Asa, clicurile repezi grabesc banda in loc sa o incetineasca. */
const GRABIRE = 0.55;

/** Cu cate pagini poate fi tinta inaintea benzii. Peste atat, clicurile se
 *  ignora, ca o rafala de apasari sa nu lase in urma un drum lung de recuperat.
 *  Doua, nu trei: la trei slide-uri, trei pagini sunt o tura intreaga, iar
 *  rafala s-ar fi oprit exact pe slide-ul de la care a plecat. */
const AVANS_MAXIM = 2;

const TRECERE_MINIMA = 250;

type Trecere = {
  p0: number;      // de unde pleaca banda
  p1: number;      // unde trebuie sa ajunga
  v0: number;      // viteza pe care o avea deja, in pagini pe secunda
  durata: number;  // ms
  start: number;   // momentul pornirii, dupa performance.now()
};

/*
 * Pozitia si viteza benzii intr-un moment dat al unei treceri.
 *
 * Drumul e un polinom de gradul cinci (Hermite) care porneste cu viteza
 * existenta si se opreste lin la tinta. Din repaus e curba clasica "porneste
 * lin, se aseaza lin"; din mers, continua exact cu viteza pe care o avea banda,
 * deci nu se vede nicio smucitura cand intervine un clic nou. Daca sensul s-a
 * schimbat, banda mai merge putin din elan si apoi se intoarce, ca un obiect
 * real.
 */
function stareTrecere(t: Trecere, acum: number) {
  const T = t.durata / 1000;
  const u = Math.min(1, Math.max(0, (acum - t.start) / t.durata));
  const u2 = u * u, u3 = u2 * u, u4 = u3 * u, u5 = u4 * u;
  const V = t.v0 * T;
  const d = t.p1 - t.p0;

  return {
    pozitie: t.p0 + V * (u - 6 * u3 + 8 * u4 - 3 * u5) + d * (10 * u3 - 15 * u4 + 6 * u5),
    viteza: (V * (1 - 18 * u2 + 32 * u3 - 15 * u4) + d * 30 * u2 * (1 - u) * (1 - u)) / T,
    gata: u >= 1,
  };
}

/*
 * Cat tine o trecere. Un drum mai lung tine putin mai mult, dar nu
 * proportional — trei pagini nu dureaza de trei ori cat una, deci banda merge
 * mai repede cu cat are mai mult de recuperat. Din mers, durata se scurteaza
 * cu GRABIRE.
 *
 * Plafonul de la sfarsit: daca banda merge deja spre tinta, o trecere prea
 * lunga ar face-o sa treaca de tinta si sa se intoarca. La polinomul de mai
 * sus, asta se intampla cand viteza initiala × durata depaseste dublul
 * distantei.
 */
function durataTrecerii(distanta: number, viteza: number): number {
  const dist = Math.abs(distanta);
  let durata = DURATA_TRECERE * (0.7 + 0.3 * dist);

  if (Math.abs(viteza) > 0.01) {
    durata = Math.max(TRECERE_MINIMA, durata * GRABIRE);
    if (Math.sign(viteza) === Math.sign(distanta)) {
      durata = Math.min(durata, ((2 * dist) / Math.abs(viteza)) * 1000);
    }
  }
  return durata;
}

const modulo = (a: number, n: number) => ((a % n) + n) % n;

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /* Devine `true` la prima schimbare de slide. Pana atunci se joaca intrarea
     de la incarcarea paginii; dupa, randurile textului nu mai au animatii
     proprii, fiindca se misca impreuna cu banda. */
  const [aMiscat, setAMiscat] = useState(false);

  /* Banda. Totul sta in referinte, nu in `state`: se schimba la fiecare cadru,
     iar o redesenare React la 60 de cadre pe secunda nu ar avea niciun rost. */
  const texte = useRef<(HTMLDivElement | null)[]>([]);
  const imagini = useRef<(HTMLDivElement | null)[]>([]);
  const tintaRef = useRef(0);
  const pozitieRef = useRef(0);
  const trecereRef = useRef<Trecere | null>(null);
  const cadruTrecereRef = useRef(0);

  useEffect(() => () => cancelAnimationFrame(cadruTrecereRef.current), []);

  /* Barele de progres: cate o referinta catre umplerea fiecareia, ca sa li se
     poata scrie latimea direct, fara sa fie redesenata pagina. */
  const umpleri = useRef<(HTMLSpanElement | null)[]>([]);

  /* Pauza, citita din bucla de animatie. Sta intr-o referinta, nu in `state`:
     bucla ar fi trebuit repornita la fiecare schimbare, si si-ar fi pierdut
     socoteala timpului scurs. */
  const pauzaRef = useRef(false);
  useEffect(() => {
    pauzaRef.current = isPaused;
  }, [isPaused]);

  // Ref for actions container to match width for indicators
  const actionsRef = useRef<HTMLDivElement>(null);
  const [actionsWidth, setActionsWidth] = useState(420); // Fallback

  useEffect(() => {
    if (!actionsRef.current) return;

    // Use ResizeObserver for perfect tracking even after web fonts load
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setActionsWidth(entry.contentRect.width);
      }
    });

    observer.observe(actionsRef.current);
    return () => observer.disconnect();
  }, []);

  /*
   * Aseaza fiecare slide pe banda, pentru pozitia data. `null` sterge tot ce
   * s-a scris din JavaScript si lasa CSS-ul sa decida din nou (slide-ul activ
   * vizibil, restul ascunse) — asa arata hero-ul cat timp banda sta.
   *
   * Fiecare slide se repeta pe banda la fiecare `n` pagini (dupa ultimul vine
   * iar primul), deci se alege copia lui cea mai apropiata de pozitia benzii.
   * Tot ce e la o pagina sau mai departe e in afara ecranului si se ascunde.
   */
  const aseaza = useCallback((pozitie: number | null) => {
    const n = slides.length;

    for (let s = 0; s < n; s++) {
      const elemente = [texte.current[s], imagini.current[s]];

      if (pozitie === null) {
        elemente.forEach((el) => {
          if (!el) return;
          el.style.transform = '';
          el.style.visibility = '';
          el.style.opacity = '';
        });
        continue;
      }

      const decalaj = s + n * Math.round((pozitie - s) / n) - pozitie;
      const vizibil = Math.abs(decalaj) < 1;

      elemente.forEach((el) => {
        if (!el) return;
        el.style.transform = vizibil ? `translate3d(${decalaj * 100}vw, 0, 0)` : '';
        el.style.visibility = vizibil ? 'visible' : 'hidden';
        el.style.opacity = vizibil ? '1' : '0';
      });
    }
  }, [slides.length]);

  /*
   * Muta tinta benzii cu `pas` pagini: 1 inainte, -1 inapoi.
   *
   * Daca banda e deja in miscare, noua trecere porneste din punctul si cu
   * viteza pe care le are banda chiar acum. De aici fluiditatea la clicuri
   * repezi: nimic nu se reia de la zero.
   */
  const muta = useCallback((pas: number) => {
    const n = slides.length;
    if (n < 2 || pas === 0) return;

    const acum = performance.now();
    const curenta = trecereRef.current
      ? stareTrecere(trecereRef.current, acum)
      : { pozitie: pozitieRef.current, viteza: 0 };

    const tinta = tintaRef.current + pas;
    if (Math.abs(tinta - curenta.pozitie) > AVANS_MAXIM) return;

    tintaRef.current = tinta;
    setCurrentSlide(modulo(tinta, n));
    setAMiscat(true);

    // Un clic e o alegere limpede: timpul porneste, orice pauza ar fi fost.
    setIsPaused(false);

    // Cine are animatiile reduse din sistem nu primeste nicio deplasare:
    // slide-ul se schimba pe loc, prin transparenta (vezi CSS-ul).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cancelAnimationFrame(cadruTrecereRef.current);
      cadruTrecereRef.current = 0;
      trecereRef.current = null;
      tintaRef.current = pozitieRef.current = modulo(tinta, n);
      aseaza(null);
      return;
    }

    const distanta = tinta - curenta.pozitie;
    trecereRef.current = {
      p0: curenta.pozitie,
      p1: tinta,
      v0: curenta.viteza,
      durata: durataTrecerii(distanta, curenta.viteza),
      start: acum,
    };

    // O singura bucla, oricate clicuri ar veni: daca merge deja, citeste
    // singura trecerea noua la cadrul urmator.
    if (cadruTrecereRef.current) return;

    const cadru = (timp: number) => {
      const trecere = trecereRef.current;
      if (!trecere) {
        cadruTrecereRef.current = 0;
        return;
      }

      const { pozitie, gata } = stareTrecere(trecere, timp);

      if (gata) {
        // Banda a ajuns. Pozitia se aduce inapoi intre 0 si n-1, ca sa nu
        // creasca la nesfarsit dupa multe ture, iar hero-ul revine la CSS.
        tintaRef.current = pozitieRef.current = modulo(trecere.p1, n);
        trecereRef.current = null;
        cadruTrecereRef.current = 0;
        aseaza(null);
        return;
      }

      pozitieRef.current = pozitie;
      aseaza(pozitie);
      cadruTrecereRef.current = requestAnimationFrame(cadru);
    };

    cadruTrecereRef.current = requestAnimationFrame(cadru);
  }, [slides.length, aseaza]);

  /* Clic pe bara: banda merge pana la slide-ul ales, trecand prin cele dintre
     ele. O bara din dreapta inseamna inainte. */
  const goToSlide = useCallback((index: number) => {
    muta(index - modulo(tintaRef.current, slides.length));
  }, [muta, slides.length]);

  /*
   * Pauza.
   *
   * Nu se mai opreste la trecerea cu mouse-ul peste hero. Hero-ul tine cat
   * ecranul, asa ca aproape orice pozitie obisnuita a cursorului cadea peste
   * el: carusela statea, barele nu se miscau, si nimic nu arata de ce. Din
   * afara semana leit cu o defectiune.
   *
   * Ramane oprirea la navigarea cu tastatura — cine ajunge pe sageti sau pe
   * bare cu Tab citeste, nu se uita la ceas — plus sagetile si barele insesi,
   * care sunt oricand la indemana. `:focus-visible` deosebeste tastatura de
   * mouse: un clic lasa si el focalizarea pe buton, iar fara deosebirea asta
   * clicul ar fi pus pe pauza exact bara pe care tocmai ai ales-o.
   */
  const laFocalizare = useCallback((e: FocusEvent<HTMLElement>) => {
    if (e.target.matches?.(':focus-visible')) setIsPaused(true);
  }, []);

  const laPierdereaFocalizarii = useCallback(() => setIsPaused(false), []);

  // Sagetile si derularea automata trec si peste capat: de la ultimul slide la
  // primul tot "inainte" e, deci banda merge mai departe in acelasi sens.
  const nextSlide = useCallback(() => muta(1), [muta]);
  const prevSlide = useCallback(() => muta(-1), [muta]);

  /*
   * Cine tine timpul si cine umple barele. Acelasi lucru, o singura bucata.
   *
   * Aici nu exista nicio animatie CSS. Bucla de mai jos aduna timpul scurs,
   * cadru cu cadru, si scrie ea insasi latimea umplerii. Cand ajunge la capat,
   * trece la slide-ul urmator.
   *
   * Varianta dinainte lasa o animatie CSS sa faca amandoua, iar de acolo
   * veneau toate necazurile: o animatie nu poate fi repornita fara sa i se
   * schimbe numele, asa ca trebuiau doua animatii identice rotite intre ele,
   * plus stari care sa inghete bara parasita, plus o regula separata pentru
   * sistemele cu animatii reduse. Fiecare din ele s-a stricat pe rand.
   *
   * Asa, repornirea inseamna "timpul scurs = 0". Nu are ce sa nu mearga.
   *
   * Bucla se reia de la zero la fiecare schimbare de slide, fiindca depinde de
   * `currentSlide`. Pauza NU o opreste: bucla merge mai departe, doar ca nu
   * mai aduna timp — altfel ar fi trebuit repornita, si ar fi uitat unde
   * ramasese.
   */
  useEffect(() => {
    let cerere = 0;
    let ultimulCadru = performance.now();
    let scurs = 0;

    const cadru = (acum: number) => {
      const trecut = acum - ultimulCadru;
      ultimulCadru = acum;
      if (!pauzaRef.current) scurs += trecut;

      const progres = Math.min(1, scurs / DURATA_SLIDE);

      umpleri.current.forEach((el, i) => {
        if (el) el.style.transform = `scaleX(${i === currentSlide ? progres : 0})`;
      });

      if (progres >= 1) {
        nextSlide();
        return;
      }
      cerere = requestAnimationFrame(cadru);
    };

    cerere = requestAnimationFrame(cadru);
    return () => cancelAnimationFrame(cerere);
  }, [currentSlide, nextSlide]);

  const slide = slides[currentSlide] || slides[0];

  if (!slide) return null;

  return (
    <section
      className={`${styles.heroWrapper} ${aMiscat ? styles.inMiscare : ''}`}
      onFocus={laFocalizare}
      onBlur={laPierdereaFocalizarii}
    >
      {/* Navigation Arrows (Positioned relative to the full viewport width) */}
      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prevSlide} aria-label="Slide anterior">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={nextSlide} aria-label="Următorul slide">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>

      <div className={styles.hero}>
        <div className={styles.heroContainer}>
        {/* Text Content */}
        <div className={styles.textBlock}>
          <div className={styles.textBlockInner}>
            {/* Textele TUTUROR slide-urilor stau in aceeasi celula de grila,
                unul peste altul. Asa inaltimea blocului e mereu a celui mai
                inalt, si nu se mai schimba cand trece la alt slide.

                Inainte se afisa doar slide-ul curent, iar hero-ul crestea si
                scadea cu el: descrierea unui slide incape pe doua randuri,
                a altuia pe trei, deci pagina sarea cu 25px la fiecare
                schimbare. Nu tinea de font — fontul doar muta punctul in care
                se rupe randul; inaltimea depindea de continut prin
                constructie.

                Slide-urile ascunse primesc `visibility: hidden` din CSS, deci
                ies si din citirea cu voce tare, nu doar din vedere. */}
            <div className={styles.texteSlide}>
              {slides.map((s, index) => {
                const activ = index === currentSlide;

                // Titlu adevarat doar la slide-ul activ. Toate trei sunt in
                // pagina, ca sa tina inaltimea, dar daca toate ar fi `h1`,
                // pagina ar avea trei titluri principale in loc de unul.
                const Titlu = activ ? 'h1' : 'p';

                return (
                  <div
                    key={s.id}
                    ref={(el) => { texte.current[index] = el; }}
                    className={`${styles.textSlide} ${activ ? styles.textSlideActiv : ''}`}
                    aria-hidden={!activ}
                  >
                    <span className={styles.label}>{s.label}</span>
                    <Titlu className={styles.title}>{s.title}</Titlu>
                    <p className={styles.description}>{s.description}</p>
                  </div>
                );
              })}
            </div>

            <div className={styles.actions} ref={actionsRef}>
              <Link href="/bestsellers" className={styles.ctaPrimary}>
                Descoperă Produsele
              </Link>
              <Link href="/calitate" className={styles.ctaOutline}>Calitate & Ingrediente</Link>
            </div>
          </div>

          {/* INDICATORII — bare de aceeasi lungime, nu puncte. Se umple doar
              bara slide-ului curent; celelalte stau goale. Indicatorul spune
              unde suntem ACUM, nu cat s-a parcurs.

              Nu exista nicio animatie CSS aici: latimea umplerii o scrie
              bucla de mai sus, cadru cu cadru. De aceea markupul e atat de
              simplu — nu mai are stari, nici benzi, nici nume de animatii.

              Umplerea sta INTR-O pista cu colturi rotunde si taiere la margine.
              Asa, cand e scalata pe orizontala, rotunjimea nu se turteste odata
              cu ea: forma vine de la pista, care nu se scaleaza. */}
          <div className={styles.indicatorsWrapper} style={{ width: `${actionsWidth}px` }}>
            <div className={styles.indicators}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={styles.dot}
                  onClick={() => goToSlide(index)}
                  aria-label={`Slide ${index + 1} din ${slides.length}`}
                  aria-current={index === currentSlide ? 'true' : undefined}
                >
                  <span className={styles.pista}>
                    <span
                      className={styles.umplere}
                      ref={(el) => { umpleri.current[index] = el; }}
                    />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Image */}
        <div className={styles.imageBlock}>
          <div className={styles.imageContainer}>
            <div className={styles.imageInner}>
              {slides.map((s, index) => (
                <div
                  key={s.id}
                  ref={(el) => { imagini.current[index] = el; }}
                  className={`${styles.imageWrapper} ${index === currentSlide ? styles.imageActive : ''}`}
                >
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className={styles.image}
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            {/* Trust badges floating over the image */}
            <div className={styles.floatingBadges}>
              <div className={styles.badge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Formule curate
              </div>
              <div className={styles.badge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Fără alergeni
              </div>
              <div className={styles.badge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Validat științific
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
