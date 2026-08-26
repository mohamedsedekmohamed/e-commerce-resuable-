import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface Category {
  id: number | string;
  name: string;
  description?: string;
  image?: string;
}

interface CategoryCardProps {
  category: Category;
  locale: string;
  variant?: 'primary' | 'sub';
  isSelected?: boolean;
  onClick?: () => void;
}

export default function CategoryCard({ category, locale, variant = 'primary', isSelected = false, onClick }: CategoryCardProps) {
  const isRtl = locale === 'ar';
  const href = `/${locale}/companies/${category.id}?name=${encodeURIComponent(category.name)}${category.description ? `&desc=${encodeURIComponent(category.description)}` : ''}${category.image ? `&img=${encodeURIComponent(category.image)}` : ''}`;

  const cardContent = (
    <div className={`group relative flex flex-col overflow-hidden border transition-all duration-300 rounded-xl ${
      isSelected
        ? 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_15px_rgba(250,204,21,0.15)]'
        : 'border-border bg-card hover:border-yellow-400/50 hover:bg-yellow-400/5'
    }`}>
      {/* Image */}
      <div className={`relative w-full overflow-hidden bg-background ${variant === 'sub' ? 'aspect-4/3' : 'aspect-square'}`}>
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-400 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-yellow-400/20">{category.name.charAt(0)}</span>
          </div>
        )}
        {/* Bottom line */}
        <span className={`absolute bottom-0 inset-x-0 h-0.5 bg-yellow-400 transition-transform duration-200 origin-left ${isSelected ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
      </div>

      {/* Info */}
      <div className="px-3 py-2.5 flex items-center justify-between gap-2">
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <span className={`text-sm font-semibold line-clamp-1 transition-colors duration-150 ${isSelected ? 'text-yellow-600 dark:text-yellow-500' : 'text-foreground group-hover:text-yellow-500'}`}>
            {category.name}
          </span>
          {category.description && (
            <span className="text-[11px] text-foreground/40 line-clamp-1">{category.description}</span>
          )}
        </div>
        {isRtl
          ? <ArrowLeft className={`w-4 h-4 shrink-0 transition-colors duration-150 ${isSelected ? 'text-yellow-500' : 'text-foreground/20 group-hover:text-yellow-500'}`} />
          : <ArrowRight className={`w-4 h-4 shrink-0 transition-colors duration-150 ${isSelected ? 'text-yellow-500' : 'text-foreground/20 group-hover:text-yellow-500'}`} />}
      </div>
    </div>
  );

  if (onClick) return <button onClick={onClick} className="w-full text-start outline-none">{cardContent}</button>;
  return <Link href={href}>{cardContent}</Link>;
}
