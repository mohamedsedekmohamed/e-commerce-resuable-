import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CategoryContent from '@/components/categories/CategoryContent';
import PageHero from '@/components/ui/PageHero';

export default async function CompanyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ name?: string; desc?: string; img?: string }>;
}) {
  const { id, locale } = await params;
  const { name, desc, img } = await searchParams;
  const categoryId = parseInt(id, 10);

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <PageHero
        title={name || (locale === 'ar' ? 'تفاصيل الشركة' : 'Company Details')}
        subtitle={desc || undefined}
        image={img || undefined}
        label={locale === 'ar' ? 'الشركة' : 'Company'}
      />

      <div className="grow container py-14 md:py-20 pb-24">
        <CategoryContent parentCategoryId={categoryId} />
      </div>

      <Footer />
    </main>
  );
}
