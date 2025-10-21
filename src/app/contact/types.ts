export interface ContactMethod {
  icon: string;
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';