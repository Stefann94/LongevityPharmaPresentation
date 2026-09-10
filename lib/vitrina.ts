/**
 * Intrerupatorul vitrinei.
 *
 * Cat timp PRODUSE_ASCUNSE este `true`, site-ul nu afiseaza si nu genereaza
 * nicio pagina de produs. Datele raman neatinse in Supabase - se schimba doar
 * ce ajunge in paginile construite la build.
 *
 * Ca sa readuci magazinul, dupa ce primim produsele reale:
 *   1. treci constanta pe `false`
 *   2. sterge folderul .next  (Next.js pastreaza in cache raspunsurile
 *      Supabase de la build-ul anterior; fara pasul asta iese un site pe
 *      jumatate, cu produse vechi in unele pagini si fara in altele)
 *   3. reconstruieste
 *
 * Nu s-a sters nimic din cod. Sectiunile de produse dispar pentru ca
 * ProductSection si ProductCarousel returneaza deja `null` cand primesc o
 * lista goala, iar paginile de produs nu se mai genereaza pentru ca
 * generateStaticParams intoarce o lista goala.
 *
 * Atentie: produsele raman in baza de date. Nu sunt sterse, doar nu mai apar
 * in paginile publicate.
 */
export const PRODUSE_ASCUNSE = true;

/**
 * Trece o lista de produse prin intrerupator: goala cat timp vitrina e oprita,
 * neschimbata altfel.
 *
 * Toate locurile care citesc tabelul `products` folosesc functia asta, ca sa
 * existe un singur loc de unde se comuta si sa nu ramana vreo pagina uitata.
 */
export function produseVizibile<T>(lista: T[] | null | undefined): T[] {
  return PRODUSE_ASCUNSE ? [] : (lista ?? []);
}
