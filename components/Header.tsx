import { createStaticClient } from '@/lib/supabase/static';
import HeaderClient from './HeaderClient';
import { produseVizibile, PRODUSE_ASCUNSE } from '@/lib/vitrina';

/**
 * Antetul cere doar date publice: categorii, produse promovate și promoția
 * activă. Toate trei sunt aceleași pentru orice vizitator, deci se pot citi
 * o singură dată, la build, și incluse direct în HTML.
 *
 * Sesiunea utilizatorului nu se mai citește aici. Se rezolvă în HeaderClient,
 * din browser: altfel `auth.getUser()` ar citi cookie-uri, iar Next.js ar fi
 * obligat să randeze fiecare pagină la cerere, pe un server Node.
 */
export default async function Header() {
  const supabase = createStaticClient();

  const [
    { data: categories },
    { data: featuredProducts },
    { data: promos }
  ] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order'),
    supabase.from('products').select('*').eq('is_featured', true).limit(4),
    supabase.from('promos').select('*').eq('is_active', true).limit(1)
  ]);

  // Promoția din meniu are în baza de date `link_url` spre o pagină de produs.
  // Cu vitrina oprită acea pagină nu mai există, deci scoatem legătura și
  // rămâne un bloc simplu, neclicabil — comportamentul pe care HeaderClient îl
  // are deja pentru promoțiile fără `link_url`. Vezi lib/vitrina.ts.
  const promo = promos?.[0] || null;
  const promoAfisat =
    promo && PRODUSE_ASCUNSE && typeof promo.link_url === 'string' && promo.link_url.startsWith('/produs/')
      ? { ...promo, link_url: undefined }
      : promo;

  return (
    <HeaderClient
      categories={categories || []}
      featuredProducts={produseVizibile(featuredProducts)}
      activePromo={promoAfisat}
    />
  );
}
