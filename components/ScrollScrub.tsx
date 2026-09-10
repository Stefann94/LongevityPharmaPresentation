'use client';

import { useEffect } from 'react';

/**
 * Motorul de derulare al site-ului. Ruleaza in TOATE browserele.
 *
 * ── CE REZOLVA ────────────────────────────────────────────────────────────
 * Varianta veche calcula progresul separat pentru fiecare element, din
 * pozitia lui proprie. Efectul: un element asezat jos in sectiune (badge-ul
 * cu anul, randul de cifre) isi termina intrarea abia dupa ce cititorul
 * trecuse deja de restul continutului. Se ajungea la finalul blocului fara
 * sa se fi vazut blocul intreg.
 *
 * Acum progresul apartine BLOCULUI, nu elementului. Un bloc este orice
 * element cu `data-reveal`. Toate piesele din interiorul lui citesc acelasi
 * progres si isi iau doar felia proprie din el. Consecinta directa: cand
 * marginea de jos a blocului ajunge la marginea de jos a ferestrei — adica
 * exact cand blocul incape intreg pe ecran — progresul e deja 1 si tot ce
 * are blocul pe el s-a asezat.
 *
 * ── CELE DOUA VARIABILE ───────────────────────────────────────────────────
 * `--p`  0 -> 1, intrarea. Porneste cand blocul incepe sa urce in fereastra
 *        si se termina cand blocul e vizibil in intregime (vezi mai jos).
 *        Din ea se compun toate aparitiile.
 *
 * `--q`  0 -> 1, traversarea completa: de cand blocul intra pe jos pana cand
 *        iese pe sus. Pentru paralaxa si plutire, care trebuie sa se miste
 *        cat timp blocul e pe ecran, nu doar la intrare.
 *
 * ── CUM SE FOLOSESC IN CSS ────────────────────────────────────────────────
 * Plumbing-ul e in app/globals.css, pe `[data-in]`. Fiecare element isi
 * declara felia prin `--s` (start) si `--e` (final), valori intre 0 si 1 pe
 * scala blocului, si numele animatiei in modulul CSS al sectiunii.
 *
 * Animatia nu ruleaza niciodata: sta oprita (`animation-play-state: paused`)
 * si e fixata in loc de o intarziere negativa. O animatie oprita nu
 * avanseaza, dar ramane afisata exact la momentul cerut. Derulezi inapoi, se
 * deruleaza inapoi.
 *
 * Fara JavaScript sau cu animatii reduse din sistem, `--p` ramane 1 si totul
 * se vede in starea finala. Asta e si motivul pentru care starea implicita a
 * fiecarui element din CSS trebuie sa fie cea FINALA.
 */

/* Reperele intrarii, ca fractiuni din inaltimea ferestrei.
   PORNIRE: unde e marginea de sus a blocului cand progresul e 0. 1 inseamna
            fix la marginea de jos a ferestrei — intrarea incepe in clipa in
            care blocul se arata, ca sa avem la dispozitie tot drumul lui.
   MARJA:   cat loc mai ramane sub bloc in clipa in care intrarea s-a incheiat.
            Tinut la 0 dinadins, si asta e piesa care face garantia sa
            functioneze: cu PORNIRE 1 si MARJA 0, drumul intrarii e exact
            inaltimea blocului, deci progresul 1 cade fix in clipa in care
            marginea lui de jos atinge marginea de jos a ferestrei. De aici
            urmeaza regula simpla din CSS-uri: orice fereastra `--e` sub 1 e
            gata inainte ca blocul sa fie vazut intreg, la ORICE inaltime de
            bloc si de ecran. O marja peste zero ar fi rupt regula la blocurile
            scunde, unde cateva zeci de pixeli inseamna o felie mare din drum.
   PLAFON:  cat de sus poate urca marginea de sus a unui bloc mai inalt decat
            fereastra inainte sa fie socotit dezvaluit. Fara el, un bloc care
            nu incape pe ecran nu si-ar termina niciodata intrarea.
   MINIM:   drumul cel mai scurt admis, pentru blocuri neobisnuit de scunde.
            Sub pragul asta garantia de mai sus nu mai tine, asa ca o scena ar
            trebui sa aiba cel putin vreo 200px inaltime. */
const PORNIRE = 1.0;
const MARJA = 0.0;
const PLAFON = 0.15;
const MINIM = 0.15;

export default function ScrollScrub() {
  useEffect(() => {
    const faraMiscare = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (faraMiscare.matches) return;

    const blocuri = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]')
    );
    if (blocuri.length === 0) return;

    let programat = false;

    const actualizeaza = () => {
      programat = false;
      const inaltime = window.innerHeight;

      for (const bloc of blocuri) {
        const cadru = bloc.getBoundingClientRect();

        // Cat a urcat marginea de sus peste linia de pornire.
        const urcat = inaltime * PORNIRE - cadru.top;

        // Drumul pana la dezvaluirea completa, in pixeli. Cel mai scurt
        // dintre "blocul incape intreg pe ecran" si plafonul pentru blocuri
        // inalte, dar niciodata sub minim.
        //
        // panaJos: marginea de jos a blocului ajunge la inaltime*(1 - MARJA),
        // deci marginea de sus e la inaltime*(1 - MARJA) - inaltimeBloc.
        const panaJos =
          cadru.height - inaltime * (1 - MARJA - PORNIRE);
        const panaSus = inaltime * (PORNIRE - PLAFON);
        const drum = Math.max(inaltime * MINIM, Math.min(panaJos, panaSus));

        const p = urcat / drum;
        const q = (inaltime - cadru.top) / Math.max(1, inaltime + cadru.height);

        bloc.style.setProperty('--p', String(Math.min(1, Math.max(0, p))));
        bloc.style.setProperty('--q', String(Math.min(1, Math.max(0, q))));
      }
    };

    // Un singur calcul per cadru, oricat de des ar veni evenimentele.
    const cere = () => {
      if (programat) return;
      programat = true;
      requestAnimationFrame(actualizeaza);
    };

    actualizeaza();
    window.addEventListener('scroll', cere, { passive: true });
    window.addEventListener('resize', cere);

    // Imaginile care se incarca mai tarziu schimba inaltimile din pagina.
    const observator = new ResizeObserver(cere);
    observator.observe(document.body);

    return () => {
      window.removeEventListener('scroll', cere);
      window.removeEventListener('resize', cere);
      observator.disconnect();
    };
  }, []);

  return null;
}
