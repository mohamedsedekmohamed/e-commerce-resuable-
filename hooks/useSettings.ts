'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useApiGet } from './useApi';
import { userHome } from '@/services/userHome';

const normalizeLogoUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `https://ecommerce.mazoom.online/storage/${url.replace(/\\/g, '/')}`;
};

export function useSettings() {
  const locale = useLocale();
  const { data: response, isLoading } = useApiGet(userHome.getFooter, locale);

  const rawData = response as any;
  const d = rawData?.data || rawData;

  let brandName: string | null = null;
  if (d?.brand_name) {
    if (typeof d.brand_name === 'string') {
      brandName = d.brand_name;
    } else if (typeof d.brand_name === 'object') {
      brandName = d.brand_name[locale] || d.brand_name['en'] || d.brand_name['ar'] || null;
    }
  }

  const logoUrl = normalizeLogoUrl(d?.logo_url || d?.logo);
  const logoUrl2 = normalizeLogoUrl(d?.logo2_url || d?.logo2);

  useEffect(() => {
    if (brandName && typeof window !== 'undefined') {
      if (!document.title || document.title === 'pharmacy' || document.title.includes('pharmacy')) {
        document.title = brandName;
      }
    }
  }, [brandName]);

  return {
    settings: d || null,
    brandName,
    logoUrl,
    logoUrl2,
    isLoading,
  };
}

export default useSettings;
