import type { Metadata } from "next";
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "react-hot-toast";
import FloatingWhatsApp from "@/components/shared/FloatingWhatsApp";

const FOOTER_METADATA_REVALIDATE_SECONDS = 3600;
// Keep this comfortably below Vercel's function limit. The page can use the
// fallback metadata when the separate backend is slow or temporarily down.
const FOOTER_METADATA_TIMEOUT_MS = 4_000;

async function getStoreMetadata(locale: string) {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ecommerce.mazoom.online/api';
  const baseUrl = configuredBaseUrl.replace(/\/+$/, '');

  try {
    const res = await fetch(`${baseUrl}/user/footer?local=${encodeURIComponent(locale)}`, {
      next: { revalidate: FOOTER_METADATA_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FOOTER_METADATA_TIMEOUT_MS),
    });

    if (!res.ok) return null;

    return await res.json();
  } catch {
    // Metadata must never make the storefront unavailable. The caller uses
    // default values if the backend cannot respond within the small budget.
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  let title = "Store";
  let logo1 = "/favicon.ico";

  const data = await getStoreMetadata(locale);

  if (data) {
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
