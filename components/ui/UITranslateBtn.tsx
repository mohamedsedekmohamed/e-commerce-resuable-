'use client';

import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface UITranslateBtnProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export default function UITranslateBtn({ variant = 'dark', className = '' }: UITranslateBtnProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const changeLanguage = (value: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(en|ar)(\/|$)/, '/');
    const newPath = `/${value}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    startTransition(() => { router.replace(newPath); });
  };

  const baseStyles = variant === 'dark' 
    ? 'text-white/90 hover:text-secondary border-white/25 hover:border-secondary bg-white/5 hover:bg-white/10'
    : 'text-foreground/80 hover:text-secondary border-black/15 hover:border-secondary bg-black/5 hover:bg-black/10';

  return (
    <button
      onClick={() => changeLanguage(locale === 'en' ? 'ar' : 'en')}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide border px-3 py-1.5 rounded-md transition-all duration-150 ${baseStyles} ${className}`}
      aria-label="Change language"
    >
      <Globe className="w-3.5 h-3.5 shrink-0" />
      <span>{locale === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}

