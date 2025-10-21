'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { ContactFormData, SubmitStatus } from './types';
import styles from './contact.module.css';

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const isSubmitting = submitStatus === 'submitting';

  return (
    <div className={styles.contactForm}>
      <h2 className={styles.contactFormTitle}>Envíanos un Mensaje</h2>
      
      {submitStatus === 'success' && (
        <div className={styles.successMessage}>
          ¡Gracias por tu mensaje! Te contactaremos pronto.
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className={styles.errorMessage}>
          Ha ocurrido un error. Por favor, intenta nuevamente.
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Nombre Completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.formControl}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.formControl}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="subject" className={styles.label}>
            Asunto
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={styles.formControl}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={`${styles.formControl} ${styles.textarea}`}
            rows={5}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <button 
          type="submit" 
          className={styles.submitBtn}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
        </button>
      </form>
    </div>
  );
}