'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AllCategoriesGrid from '@/components/home/AllCategoriesGrid';
import PageHero from '@/components/ui/PageHero';
import { useTranslations } from 'next-intl';

export default function CompaniesPage() {
  const t = useTranslations('common');

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <PageHero
        title={t('our_companies')}
        subtitle={t('discover_our_leading_group_of_')}
        label={t('companies')}
      />

      <div className="grow pb-24">
        <div className="container py-14">
          <AllCategoriesGrid />
        </div>
      </div>

      <Footer />
    </main>
  );
}
