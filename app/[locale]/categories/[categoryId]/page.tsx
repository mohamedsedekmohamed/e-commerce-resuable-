import React from 'react';
import CategoryDetailsClient from '@/components/categories/CategoryDetailsClient';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = { title: 'Category Details' };

export default async function CategoryPage(props: {
  params: Promise<{ locale: string; categoryId: string }>;
}) {
  const { categoryId } = await props.params;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="grow">
        <CategoryDetailsClient categoryId={Number(categoryId)} />
      </div>
      <Footer />
    </div>
  );
}
