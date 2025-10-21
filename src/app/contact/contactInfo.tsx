import { ContactMethod } from './types';
import styles from './contact.module.css';

const contactMethods: ContactMethod[] = [
  {
    icon: '📧',
    title: 'Correo Electrónico',
    description: 'contacto@tuconstrucciónenlinea.com'
  },
  {
    icon: '🌐',
    title: 'Sitio Web',
    description: 'En el formulario en esta misma página'
  },
  {
    icon: '💬',
    title: 'Chat por Whatsapp',
    description: 'Disponible de 09:00 a 18:00 horas de lunes a viernes'
  },
];

export default function ContactInfo() {
  return (
    <div className={styles.contactInfo}>
      <h2 className={styles.contactInfoTitle}>Información de Contacto</h2>
      <p className={styles.contactInfoDescription}>
        Puedes contactarnos a través de cualquiera de los siguientes métodos. 
        Nuestro equipo de soporte está disponible para ayudarte con cualquier consulta.
      </p>
      
      <div className={styles.contactMethods}>
        {contactMethods.map((method, index) => (
          <div key={index} className={styles.contactMethod}>
            <div className={styles.contactIcon}>{method.icon}</div>
            <div className={styles.contactDetails}>
              <h3 className={styles.contactMethodTitle}>{method.title}</h3>
              <p className={styles.contactMethodDescription}>{method.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}