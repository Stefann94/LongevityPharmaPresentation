import React from 'react';
import styles from './Footer.module.css';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerTop}>
          <div className={styles.footerGrid}>
            
            {/* Coloana 1: Brand */}
            <div className={styles.footerCol}>
              <a href="#" className={styles.logo}>
                <svg className={styles.logoIcon} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 1 8.3C19.24 16.46 13.84 20 11 20Z"/>
                  <path d="M11 20c2-5 0-11-2-11"/>
                </svg>
                <div className={styles.logoTextWrapper}>
                  <div className={styles.logoText}>
                    Longevity<span className={styles.logoTextLight}>Pharma</span>
                  </div>
                </div>
              </a>
              <p className={styles.brandDesc}>
                Investește astăzi în ziua de mâine. Suplimente premium bazate pe știință pentru vitalitate, focus și longevitate.
              </p>
            </div>

            {/* Coloana 2: Informații Utile */}
            <div className={styles.footerCol}>
              <h4 className={styles.colTitle}>Informații Utile</h4>
              <ul className={styles.linkList}>
                <li><a href="#">Despre Noi</a></li>
                <li><a href="#">Termeni și Condiții</a></li>
                <li><a href="#">Politica de Confidențialitate</a></li>
                <li><a href="#">Politica de Cookie-uri</a></li>
                <li><a href="#">Politica de Retur</a></li>
              </ul>
            </div>

            {/* Coloana 3: Asistență */}
            <div className={styles.footerCol}>
              <h4 className={styles.colTitle}>Asistență Clienți</h4>
              <ul className={styles.linkList}>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Întrebări Frecvente (FAQ)</a></li>
                <li><a href="#">Cum Cumpăr?</a></li>
                <li><a href="#">Livrare și Plată</a></li>
                <li><a href="#">Urmărire Comandă</a></li>
              </ul>
            </div>

            {/* Coloana 4: Contact & Newsletter */}
            <div className={styles.footerCol}>
              <h4 className={styles.colTitle}>Contact</h4>
              <ul className={styles.contactInfo}>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  {/* tel: fara spatii sau puncte — asa formeaza corect de pe telefon */}
                  <a href="tel:+40721233544">+40 721 233 544</a>
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <a href="mailto:contact@longevitypharma.ro">contact@longevitypharma.ro</a>
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span>Str. Nordului 8A, Piatra Neamț, Neamț</span>
                </li>
              </ul>
              
              <div className={styles.newsletter}>
                <h4>Abonează-te la Newsletter</h4>
                <NewsletterForm />
              </div>
            </div>

          </div>
        </div>

        {/* Partea de Jos - ANPC & Copyright */}
        <div className={styles.footerBottom}>
          <div className={styles.romaniaCompliance}>
            <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer" className={styles.anpcBadge}>
              <div className={styles.anpcText}>
                <strong>ANPC - SAL</strong>
                <span>Soluționarea Alternativă a Litigiilor</span>
              </div>
            </a>
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className={styles.anpcBadge}>
              <div className={styles.anpcText}>
                <strong>ANPC - SOL</strong>
                <span>Soluționarea Online a Litigiilor</span>
              </div>
            </a>
          </div>
          
          <div className={styles.copyright}>
            <p>&copy; {new Date().getFullYear()} Longevity Pharma. Toate drepturile rezervate.</p>
            <div className={styles.paymentMethods}>
              {/* Dummy icons for payment */}
              <div className={styles.payIcon}>VISA</div>
              <div className={styles.payIcon}>MasterCard</div>
              <div className={styles.payIcon}>Apple Pay</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
