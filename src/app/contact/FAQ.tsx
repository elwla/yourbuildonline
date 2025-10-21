'use client';

import { useState } from 'react';
import { FAQItem } from './types';
import styles from './contact.module.css';

const faqItems: FAQItem[] = [
  {
    question: '¿Cómo funciona la visualización online?',
    answer: 'A través de un login simple y una url asignada podrás ingresar a la visualización de los avances de tu construcción.'
  },
  {
    question: '¿Es gratuito el servicio?',
    answer: 'Sí, la visualización de los avances es gratuito y esta contemplado en el contrato realizado al momento de iniciar un proyecto con nosotros'
  },
  {
    question: '¿Cómo manejan la privacidad de los datos?',
    answer: 'Tomamos la privacidad muy en serio. La url es encriptada además de necesitar de un login en nuestro sitio web. Solo tu verás el proceso de avance.'
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Preguntas Frecuentes</h2>
        
        <div className={styles.faqContainer}>
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className={`${styles.faqItem} ${activeIndex === index ? styles.active : ''}`}
            >
              <button 
                className={styles.faqQuestion}
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span>{item.question}</span>
                <span className={styles.faqToggle}>
                  {activeIndex === index ? '▲' : '▼'}
                </span>
              </button>
              <div 
                id={`faq-answer-${index}`}
                className={styles.faqAnswer}
                role="region"
                aria-hidden={activeIndex !== index}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}