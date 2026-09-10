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

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  const goToSlide = useCallback((index: number) => {
    if (index === currentSlide) return;

    setCurrentSlide(index);

    // Un clic e o alegere limpede: timpul porneste, orice pauza ar fi fost.
    setIsPaused(false);
  }, [currentSlide]);

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

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide, slides.length]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, goToSlide, slides.length]);

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
      className={styles.heroWrapper}
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
