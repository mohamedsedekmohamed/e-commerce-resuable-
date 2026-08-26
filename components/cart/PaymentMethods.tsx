'use client';

import React, { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { userOrder } from '@/services/userOrder';
import { ShieldCheck } from 'lucide-react';

interface PaymentMethod {
  name: string | null;
  description: string;
  icon: string | null;
}


export default function PaymentMethods() {
  const t = useTranslations('cart');
  const locale = useLocale();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const res = await userOrder.lists(locale);
        setMethods(res.data?.payment_methods || []);
      } catch (err) {
        console.error('Failed to load payment methods', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMethods();
  }, [locale]);

  if (isLoading || methods.length === 0) return null;

  return (
    <div className="w-full rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-primary/3">
        <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-primary/70">
          {t('accepted_payment_methods')}
        </span>
      </div>

      {/* Methods Grid */}
      <div className="p-4">
        <div className="flex flex-wrap gap-2.5">
          {methods.map((method, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center justify-center gap-1.5 rounded-xl border bg-background cursor-default transition-all duration-200"
              style={{
                borderColor: hoveredIndex === index ? 'rgb(var(--color-primary) / 0.35)' : 'var(--border)',
                boxShadow: hoveredIndex === index
                  ? '0 4px 16px rgb(var(--color-primary) / 0.08)'
                  : '0 1px 3px rgba(0,0,0,0.04)',
                padding: '10px 14px',
                minWidth: '80px',
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              title={method.description || method.name || ''}
            >
              {/* Icon */}
              <div
                className="relative transition-all duration-200"
                style={{
                  width: 40,
                  height: 28,
                  filter: hoveredIndex === index ? 'none' : 'grayscale(60%)',
                  opacity: hoveredIndex === index ? 1 : 0.72,
                }}
              >
                {method.icon ? (
                  <Image
                    src={method.icon}
                    alt={method.name || 'Payment method'}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[11px] font-bold text-foreground/40 leading-none">
                      {method.name?.substring(0, 3).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Name */}
              {method.name && (
                <span
                  className="text-[9.5px] font-semibold tracking-wide leading-none transition-colors duration-200 text-center whitespace-nowrap"
                  style={{
                    color: hoveredIndex === index
                      ? 'rgb(var(--color-primary))'
                      : 'rgb(var(--color-primary) / 0.45)',
                  }}
                >
                  {method.name}
                </span>
              )}

              {/* Active dot indicator */}
              <span
                className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full transition-all duration-200"
                style={{
                  background: hoveredIndex === index ? 'rgb(var(--color-secondary))' : 'transparent',
                }}
              />
            </div>
          ))}
        </div>

        {/* Security note */}
        <p className="mt-3.5 text-[10px] text-foreground/35 leading-relaxed">
          🔒{' '}
          {locale === 'ar'
            ? 'جميع المعاملات مشفرة وآمنة بالكامل'
            : 'All transactions are fully encrypted and secure'}
        </p>
      </div>
    </div>
  );
}
