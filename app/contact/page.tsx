import React from 'react';
import authStyles from '../auth/Auth.module.css';
import ContactForm from './ContactForm';

export const metadata = {
  title: 'Contact | Longevity Pharma',
  description: 'Ai întrebări despre suplimentele noastre sau despre comanda ta? Contactează echipa Longevity Pharma.',
};

// Aceleași date ca în subsolul site-ului. Ținute într-un singur loc aici, ca la
// o eventuală schimbare de telefon sau adresă să nu rămână o pagină în urmă.
const eticheta: React.CSSProperties = {
  display: 'block',
  color: '#333',
  marginBottom: '5px',
};

const legatura: React.CSSProperties = {
  color: '#2e8b57',
  textDecoration: 'none',
};

export default function ContactPage() {
  return (
    <main className={authStyles.pageWrapper}>
      <h1 className={authStyles.pageTitle}>Contact</h1>

      <div className={authStyles.formColumns}>

        {/* INFO PANEL */}
        <div>
          <div className={authStyles.formSection}>
            <h2>Informații de Contact</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.95rem', color: '#555' }}>
              <div>
                <strong style={eticheta}>Email</strong>
                <a href="mailto:contact@longevitypharma.ro" style={legatura}>contact@longevitypharma.ro</a>
              </div>
              <div>
                <strong style={eticheta}>Telefon</strong>
                {/* tel: fără spații — așa formează corect de pe telefon */}
                <a href="tel:+40721233544" style={legatura}>+40 721 233 544</a>
              </div>
              <div>
                <strong style={eticheta}>Adresă Sediu</strong>
                Str. Nordului 8A, Piatra Neamț, jud. Neamț
              </div>
              <div>
                <strong style={eticheta}>Program</strong>
                Luni - Vineri: 09:00 - 17:00
              </div>
            </div>
          </div>
        </div>

        {/* FORM PANEL */}
        <div>
          <ContactForm />
        </div>

      </div>
    </main>
  );
}
