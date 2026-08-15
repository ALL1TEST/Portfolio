'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { SlideFillButton } from '@/components/ui/slide-fill-button';
import { ScrollReveal } from './scroll-reveal';
import { SectionHeading } from './section-heading';
import { useData, useContactSubmit } from '@/lib/data-provider';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactSection() {
  const { profile } = useData();
  const submitContact = useContactSubmit();
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await submitContact(formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Contact"
          labelStyle="skills"
          title="Let's Build Something Great Together."
          description="Have a project in mind or just want to connect? I'd love to hear from you."
        />

        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <form onSubmit={handleSubmit} className="space-y-5 p-6 lg:p-8 bg-surface/50 border border-stroke/30 rounded-2xl" noValidate>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-muted-text uppercase tracking-wider mb-2">Name</label>
                  <input
                    id="name" type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full px-4 py-3 bg-dark/50 border rounded-lg text-sm text-white placeholder-muted-text/50 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-all ${errors.name ? 'border-red-500' : 'border-stroke/50'}`}
                    placeholder="Your name" aria-invalid={!!errors.name}
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-muted-text uppercase tracking-wider mb-2">Email</label>
                  <input
                    id="email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full px-4 py-3 bg-dark/50 border rounded-lg text-sm text-white placeholder-muted-text/50 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-all ${errors.email ? 'border-red-500' : 'border-stroke/50'}`}
                    placeholder="your@email.com" aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-medium text-muted-text uppercase tracking-wider mb-2">Subject</label>
                <input
                  id="subject" type="text" value={formData.subject} onChange={(e) => handleChange('subject', e.target.value)}
                  className={`w-full px-4 py-3 bg-dark/50 border rounded-lg text-sm text-white placeholder-muted-text/50 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-all ${errors.subject ? 'border-red-500' : 'border-stroke/50'}`}
                  placeholder="Project inquiry" aria-invalid={!!errors.subject}
                />
                {errors.subject && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.subject}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-medium text-muted-text uppercase tracking-wider mb-2">Message</label>
                <textarea
                  id="message" rows={5} value={formData.message} onChange={(e) => handleChange('message', e.target.value)}
                  className={`w-full px-4 py-3 bg-dark/50 border rounded-lg text-sm text-white placeholder-muted-text/50 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-all resize-none ${errors.message ? 'border-red-500' : 'border-stroke/50'}`}
                  placeholder="Tell me about your project..." aria-invalid={!!errors.message}
                />
                {errors.message && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.message}</p>}
              </div>

              {status === 'success' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-400">
                  <CheckCircle className="w-4 h-4" />Message sent successfully! I'll get back to you soon.
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                  <AlertCircle className="w-4 h-4" />Something went wrong. Please try again.
                </motion.div>
              )}

              <SlideFillButton
                label={submitting ? 'Sending...' : status === 'success' ? 'Sent!' : 'Send Message'}
                variant="primary"
                disabled={submitting || status === 'success'}
                type="submit"
                className="w-full"
              />
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
