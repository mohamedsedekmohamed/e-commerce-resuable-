import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AllProductsClient from '@/components/products/AllProductsClient';
import PageHero from '@/components/ui/PageHero';
import { getTranslations } from 'next-intl/server';

export const metadata = {
  title: 'Products',
  description: 'Browse all our products.',
};

export default async function ProductsPage() {
  const t = await getTranslations('common');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <PageHero
        title={t('all_products')}
        subtitle={t('browse_our_latest_and_best_car')}
        label={t('products')}
      />

      <div className="grow">
        <AllProductsClient />
      </div>

      <Footer />
    </div>
  );
}
