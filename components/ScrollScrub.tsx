'use client';

import { useEffect } from 'react';

/**
 * Conduce animatiile legate de derulare. Ruleaza in TOATE browserele.
 *
 * De ce nu prin CSS:
 * `animation-timeline: view()` ar face acelasi lucru fara JavaScript, dar merge
 * doar pe Chrome si Edge. Pe restul, sectiunea ramanea complet statica. Un
 * singur mecanism, care merge peste tot, bate doua din care unul tace.
 *
 * Cum:
 * Fiecare element cu `data-scrub` primeste o variabila `--p`, de la 0 la 1,
 * calculata din cat a urcat elementul in fereastra. CSS-ul foloseste `--p` ca
 * intarziere negativa pe o animatie oprita — asa, animatia nu "ruleaza", ci
 * sta fixata exact in punctul cerut de derulare. Mergi inapoi, se deruleaza
 * inapoi.
 *
 * Valoarea din `data-scrub` este decalajul de pornire (0 = imediat,
 * 0.3 = incepe dupa ce derularea a parcurs 30% din drum). De aici vine
 * cascada dintre elemente, pentru ca altfel toate cele aflate pe acelasi rand
 * ar porni simultan.
 *
 * Fara JavaScript, `--p` ramane 1 si totul se vede in starea finala.
 */
export default function ScrollScrub() {
  useEffect(() => {
    // Cine si-a cerut animatii reduse din sistem nu primeste niciuna. CSS-ul
    // face aceeasi verificare, deci cele doua nu pot ajunge in dezacord.
    const faraMiscare = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (faraMiscare.matches) return;

    const elemente = Array.from(
      document.querySelectorAll<HTMLElement>('[data-scrub]')
    );
    if (elemente.length === 0) return;

    let programat = false;

    const actualizeaza = () => {
      programat = false;
      const inaltime = window.innerHeight;

      // Elementul incepe sa se dezvaluie cand marginea lui de sus este aproape
      // de baza ferestrei si termina cand a urcat peste jumatatea ei.
      const pornire = inaltime * 0.94;
      const sosire = inaltime * 0.44;
      const drum = Math.max(1, pornire - sosire);

      for (const el of elemente) {
        const cadru = el.getBoundingClientRect();
        let brut: number;

        if (el.dataset.scrubRange === 'cover') {
          // Traversare completa: de cand elementul intra pe jos pana cand iese
          // pe sus. Pentru paralaxa si plutire, care trebuie sa se miste cat
          // timp sectiunea e pe ecran, nu doar la intrare.
          brut = (inaltime - cadru.top) / Math.max(1, inaltime + cadru.height);
        } else {
          brut = (pornire - cadru.top) / drum;
        }

        const decalaj = parseFloat(el.dataset.scrub || '0') || 0;
        const ramas = Math.max(0.05, 1 - decalaj);
        const p = (brut - decalaj) / ramas;

        el.style.setProperty('--p', String(Math.min(1, Math.max(0, p))));
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

    return () => {
      window.removeEventListener('scroll', cere);
      window.removeEventListener('resize', cere);
    };
  }, []);

  return null;
}
