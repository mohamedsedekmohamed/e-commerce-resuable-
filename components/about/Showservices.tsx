'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useApiGet } from '@/hooks/useApi';
import { aboutUser } from '@/services/userAbout';
import { StorePaginatedResponse, StoreService } from '@/types/store.interface';
import { motion } from 'framer-motion';

// استيراد 10 أيقونات احترافية تناسب خدمات المتاجر
import { 
  Truck, 
  Headset, 
  RefreshCcw, 
  Tag, 
  ShieldCheck, 
  CreditCard, 
  Gift, 
  Star, 
  ThumbsUp, 
  Clock 
} from 'lucide-react';

const serviceIcons = [
  Truck,
  Headset,
  RefreshCcw,
  Tag,
  ShieldCheck,
  CreditCard,
  Gift,
  Star,
  ThumbsUp,
  Clock
];

export default function Showservices() {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const { data: res, isLoading } = useApiGet(aboutUser.getServices, locale);
  const response = res as StorePaginatedResponse<StoreService> | StoreService[] | null;
  const services = Array.isArray(response) ? response : response?.data ?? [];

  // إعدادات حركة Framer Motion للظهور
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
    },
  };

  // ─── حالة التحميل (Skeleton) متناسقة مع الحجم الجديد ───
  if (isLoading) return (
    <div className="py-20 bg-background/50">
      <div className="container">
        <div className="flex flex-col items-center gap-3 mb-16 text-center">
          <div className="w-24 h-4 rounded bg-foreground/5 animate-pulse" />
          <div className="w-48 h-8 rounded bg-foreground/10 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="relative p-[2px] rounded-[2rem] bg-foreground/5 animate-pulse h-64 overflow-hidden">
               <div className="absolute inset-[2px] bg-card rounded-[calc(2rem-2px)] p-8 flex flex-col gap-6">
                 <div className="w-20 h-20 rounded-3xl bg-foreground/5" />
                 <div className="space-y-3 mt-auto">
                   <div className="h-6 w-3/4 rounded bg-foreground/10" />
                   <div className="h-4 w-full rounded bg-foreground/5" />
                   <div className="h-4 w-5/6 rounded bg-foreground/5" />
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!services.length) return null;

  return (
    <section className="relative overflow-hidden border-t border-border/50 bg-background py-20 md:py-28" dir={t('ltr')}>
      
      {/* خلفية زينة خفيفة للقسم كامل */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-yellow-400/5 blur-[120px] rounded-full" />

      <div className="container relative z-10">
        
        {/* ── العنوان بالمنتصف ── */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center justify-center px-4 py-1.5 mb-4 text-xs font-bold tracking-[0.2em] uppercase rounded-full bg-yellow-400/15 text-yellow-600 dark:text-yellow-500 border border-yellow-400/20 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            {t('why_choose_us')}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
            {t('why_shop_with_us')}
          </h2>
        </div>

        {/* ── شبكة الخدمات ── */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {services.map((service, idx) => {
            const IconComponent = serviceIcons[idx % serviceIcons.length];

            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                // الغلاف الخارجي للكارت (مسئول عن رسم الإطار)
                className="group relative flex flex-col p-[2px] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(234,179,8,0.2)] transition-shadow duration-500"
              >
                {/* ── تأثير الإطار المتحرك (Animated Gradient Border) ── */}
                {/* إضاءة خفيفة دايماً بتلف */}
                <div className="absolute inset-[-100%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(234,179,8,0.1)_50%,rgba(234,179,8,0.8)_100%)] opacity-40 transition-opacity duration-500 group-hover:opacity-0" />
                
                {/* إضاءة قوية وسريعة بتظهر لما تقف بالماوس */}
                <div className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(234,179,8,0.3)_50%,rgba(234,179,8,1)_100%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* ── جسم الكارت الداخلي ── */}
                <div className="relative z-10 flex flex-col h-full gap-6 p-8 bg-card rounded-[calc(2rem-2px)] overflow-hidden">
                  
                  {/* تدرج داخلي خفيف بيظهر مع الـ Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/[0.08] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

                  {/* ── الأيقونة (مكبرة مع حركة ناعمة) ── */}
                  <div className="flex items-center justify-center w-20 h-20 shrink-0 rounded-3xl bg-yellow-400/15 text-yellow-500 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-yellow-400/25 shadow-inner border border-yellow-400/20">
                    <IconComponent className="w-10 h-10 drop-shadow-sm transition-transform duration-500 group-hover:scale-110" />
                  </div>

                  {/* ── النصوص ── */}
                  <div className="flex flex-col gap-3 mt-auto">
                    <h3 className="text-xl font-black text-foreground transition-colors duration-300 group-hover:text-yellow-600 dark:group-hover:text-yellow-500">
                      {service.name}
                    </h3>
                    <p className="text-base text-foreground/60 leading-relaxed font-medium">
                      {service.description}
                    </p>
                  </div>
                  
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}