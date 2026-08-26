'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductsCarousel from '@/components/ui/ProductsCarousel';
import PageHero from '@/components/ui/PageHero';
import { useTranslations } from 'next-intl';

export default function CatalogPage() {
  const t = useTranslations('common');

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <PageHero
        title={t('browse_products')}
        subtitle={t('thousands_of_medicines_supplem')}
        label={t('catalog')}
      />

      <div className="grow pb-24">
        <div className="container py-14">
          <ProductsCarousel />
        </div>
      </div>

      <Footer />
    </main>
  );
}
