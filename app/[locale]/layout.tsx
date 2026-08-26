import type { Metadata } from "next";
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "react-hot-toast";
import FloatingWhatsApp from "@/components/shared/FloatingWhatsApp";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  let title = "Store";
  let logo1 = "/favicon.ico";

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ecommerce.mazoom.online/api';
    const res = await fetch(`${baseUrl}/user/footer?local=${locale}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    const d = data?.data || data;
    if (d) {
      let bName = d.brand_name;
      if (typeof bName === 'object' && bName !== null) {
        bName = bName[locale] || bName['ar'] || bName['en'] || null;
      }
      if (typeof bName === 'string' && bName.trim()) {
        title = bName;
      }
      const rawLogo = d.logo_url || d.logo;
      if (rawLogo) {
        logo1 = rawLogo.startsWith('http') ? rawLogo : `https://ecommerce.mazoom.online/storage/${rawLogo.replace(/\\/g, '/')}`;
      }
    }
  } catch {
    // The storefront can still render with the default metadata when the API is unavailable.
  }

  const description = locale === 'ar' 
    ? 'صيدليتك الإلكترونية الموثوقة. اكتشف أفضل الأدوية الأصيلة، الفيتامينات، المكملات الغذائية، ومستحضرات العناية الشخصية والأجهزة الطبية بأسعار شفافة وتوصيل سريع.'
    : 'Your trusted online pharmacy. Discover authentic medicines, vitamins, health supplements, skincare, personal care products, and medical supplies with transparent pricing and fast delivery.';

  const ogImages: { url: string; alt: string }[] = [];
  if (logo1 !== "/favicon.ico") ogImages.push({ url: logo1, alt: title });
  if (ogImages.length === 0) ogImages.push({ url: "/favicon.ico", alt: title });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description, 
    keywords: [
      "Online Pharmacy", "Medicines", "Vitamins", "Supplements", "Skincare", 
      "Personal Care", "Medical Supplies", "Pharmacy Store",
      "صيدلية أونلاين", "أدوية", "فيتامينات", "مكملات غذائية", "عناية بالبشرة", 
      "عناية بالشعر", "أجهزة طبية", "مستلزمات طبية"
    ],
    authors: [{ name: title }],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      siteName: title,
      images: ogImages,
      locale: locale === 'ar' ? 'ar_AR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map(img => img.url),
    },
    icons: {
      icon: logo1,
      shortcut: logo1,
      apple: logo1,
    }
  };
}
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Toaster position="top-center" />
          {children}
          <FloatingWhatsApp />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
