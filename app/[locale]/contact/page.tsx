'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { Mail, Phone, MapPin, Send, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { useApiGet, useApiAction } from '@/hooks/useApi';
import { userHome } from '@/services/userHome';
import { contactuser } from '@/services/userContact';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/ui/PageHero';
import { useTranslations } from 'next-intl';

const FIELD = "w-full px-4 py-3 bg-white border border-border text-foreground text-sm placeholder-foreground/30 outline-none focus:border-primary/50 transition-colors duration-150 ph-search-input";

export default function ContactPage() {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const { execute: addContact, isLoading: isSubmitting } = useApiAction(contactuser.postcontact, { showSuccessToast: true });
  const { data: response, isLoading } = useApiGet(userHome.getFooter, locale);
  const contactData = response?.data;

  const [form, setForm] = useState({ f_name: '', l_name: '', phone: '', email: '', title: '', content: '' });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addContact(form);
    setForm({ f_name: '', l_name: '', phone: '', email: '', title: '', content: '' });
  };

  if (isLoading) return (
    <main className="bg-background min-h-screen flex flex-col">
      <Navbar />
      <div className="grow py-24 animate-pulse container flex flex-col gap-8">
        <div className="h-10 w-48 bg-foreground/5 rounded" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-foreground/5 rounded" />)}
        </div>
      </div>
      <Footer />
    </main>
  );

  return (
    <main className="bg-background text-foreground min-h-screen flex flex-col" dir={t('ltr')}>
      <Navbar />

      <PageHero
        title={t('contact_us')}
        subtitle={t('have_a_question_we_re_here_to_')}
        label={t('get_in_touch')}
      />

      <div className="grow pb-24">
        <div className="container py-16 flex flex-col gap-16">

          {/* ── 3 info tiles ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { icon: <Phone className="w-5 h-5" />, labelEn: 'Phone', labelAr: 'الهاتف', valueEl: contactData?.phone ? <a href={`tel:${contactData.phone}`} className="text-primary hover:underline" dir="ltr">{contactData.phone}</a> : <span className="text-foreground/35">—</span> },
              { icon: <Mail className="w-5 h-5" />, labelEn: 'Email', labelAr: 'البريد', valueEl: contactData?.email ? <a href={`mailto:${contactData.email}`} className="text-primary hover:underline break-all">{contactData.email}</a> : <span className="text-foreground/35">—</span> },
              { icon: <MapPin className="w-5 h-5" />, labelEn: 'Location', labelAr: 'العنوان', valueEl: contactData?.address ? (contactData?.map ? <a href={contactData.map} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline leading-relaxed">{contactData.address}</a> : <span className="text-foreground/55 leading-relaxed">{contactData.address}</span>) : <span className="text-foreground/35">—</span> },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border px-6 py-6 flex flex-col gap-3">
                <div className="w-9 h-9 flex items-center justify-center bg-primary-100 text-primary">
                  {item.icon}
                </div>
                <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-foreground/40">
                  {isRtl ? item.labelAr : item.labelEn}
                </span>
                <div className="text-sm font-medium">{item.valueEl}</div>
              </div>
            ))}
          </div>

          {/* ── Contact form ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left: heading */}
            <div className="flex flex-col gap-5 lg:sticky lg:top-24">
              <span className="text-[10px] font-semibold tracking-[0.24em] uppercase text-primary/70">
                {t('send_a_message')}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                {t('we_re_listening')}
              </h2>
              <span className="block w-8 h-0.5 bg-primary" />
              <p className="text-sm text-foreground/45 max-w-xs leading-relaxed">
                {t('we_ll_get_back_to_you_as_soon_')}
              </p>

              {/* Social links */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-border">
                {contactData?.wattsapp && (
                  <a href={`https://wa.me/${contactData.wattsapp.replace(/[^0-9]/g,'')}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-[11px] font-semibold tracking-wider uppercase border border-border text-foreground/50 hover:border-primary hover:text-primary transition-colors duration-150">
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                )}
                {contactData?.facebook && (
                  <a href={contactData.facebook} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-[11px] font-semibold tracking-wider uppercase border border-border text-foreground/50 hover:border-primary hover:text-primary transition-colors duration-150">
                    <Facebook className="w-3.5 h-3.5" /> Facebook
                  </a>
                )}
                {contactData?.insta && (
                  <a href={contactData.insta} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-[11px] font-semibold tracking-wider uppercase border border-border text-foreground/50 hover:border-primary hover:text-primary transition-colors duration-150">
                    <Instagram className="w-3.5 h-3.5" /> Instagram
                  </a>
                )}
                {contactData?.tiktok && (
                  <a href={contactData.tiktok} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-[11px] font-semibold tracking-wider uppercase border border-border text-foreground/50 hover:border-primary hover:text-primary transition-colors duration-150">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg> TikTok
                  </a>
                )}
              </div>
            </div>

            {/* Right: form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input name="f_name" value={form.f_name} onChange={handleChange} placeholder={t('first_name')} required className={FIELD} disabled={isSubmitting} />
                <input name="l_name" value={form.l_name} onChange={handleChange} placeholder={t('last_name')} required className={FIELD} disabled={isSubmitting} />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder={t('phone')} required className={FIELD} disabled={isSubmitting} />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className={FIELD} disabled={isSubmitting} />
              </div>
              <input name="title" value={form.title} onChange={handleChange} placeholder={t('subject')} required className={FIELD} disabled={isSubmitting} />
              <textarea name="content" value={form.content} onChange={handleChange} placeholder={t('your_message')} required
                className={`${FIELD} min-h-36 max-h-72 resize-y`} disabled={isSubmitting} />

              <button type="submit" disabled={isSubmitting}
                className="group mt-2 inline-flex items-center gap-3 px-8 py-3.5 bg-primary text-white font-semibold text-sm tracking-wide hover:bg-primary-400 transition-colors duration-150 self-start disabled:opacity-50 disabled:cursor-not-allowed">
                <span>{isSubmitting ? (t('sending')) : (t('send_message'))}</span>
                {!isSubmitting && <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
