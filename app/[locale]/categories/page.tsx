import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CategoriesClient from '@/components/categories/CategoriesClient';

export const metadata = {
  title: 'Categories',
  description: 'Browse all our categories and sections.',
};

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="grow">
        <CategoriesClient />
      </main>

      <Footer />
    </div>
  );
}
