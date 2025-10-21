import ContactForm from './contactForm';
import ContactInfo from './contactInfo';
import FAQ from './FAQ';
import styles from './contact.module.css';

export default function ContactPage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Contáctanos</h1>
          <p className={styles.heroDescription}>
            ¿Tienes preguntas sobre Nuestra constructora y sus procesos? Estamos aquí para ayudarte. 
            Ponte en contacto con nuestro equipo y te responderemos lo antes posible.
          </p>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.contactContainer}>
          <ContactInfo />
          <ContactForm />
          <FAQ />
        </div>
      </section>      
    </div>
  );
}