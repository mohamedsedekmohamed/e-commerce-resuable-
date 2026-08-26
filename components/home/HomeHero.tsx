'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowUpLeft } from 'lucide-react';
import RevealBox from '@/components/shared/RevealBox';
import { StoreCategory } from '@/types/store.interface';

function getCategoryImageSrc(image?: string): string | null {
  if (!image) return null;
  if (image.startsWith('http')) return image;

  const path = image.replace(/^\/+/, '');
  return `https://ecommerce.mazoom.online/${path.startsWith('storage/') ? path : `storage/${path}`}`;
}

export default function HomeHero({ categories = [] }: { categories?: StoreCategory[] }) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const subtitle = isRtl ? 'شركات الأدوية البيطرية الرائدة' : 'LEADING VETERINARY COMPANIES';
  const titlePart1 = isRtl ? 'من الخبرة البيطرية إلى صحة الحيوان —' : 'From Vet Expertise to Animal Health —';
  const titlePart2 = isRtl ? 'تميز في كل جرعة.' : 'Excellence in Every Dose.';
  const contactText = isRtl ? 'اتصل بنا' : 'CONTACT US';



  // We don't slice because it's a moving marquee, we can show all valid categories!
  const validCats = categories.filter(
    (category) => typeof category.name === 'string' && category.name.trim().length > 0
  );
  const boxes = validCats.map((category) => ({
    id: category.id,
    name: category.name,
    imageSrc: getCategoryImageSrc(category.image),
  }));

  // Never use a loop that depends on API data: during the initial server
  // prerender the list is empty, and repeating an empty list would never end.
  const finalBoxes = boxes.length === 0
    ? []
    : Array.from(
        { length: Math.max(8, boxes.length) },
        (_, index) => boxes[index % boxes.length]
      );

  return (
    <div className="relative w-full flex flex-col mb-16 lg:mb-24">
      {/* ═══ CSS ANIMATIONS ═══ */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee-ltr {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-marquee {
          animation: marquee-ltr 30s linear infinite;
        }
        .animate-marquee-rtl {
          animation: marquee-rtl 30s linear infinite;
        }
        .pause-on-hover:hover .animate-marquee,
        .pause-on-hover:hover .animate-marquee-rtl {
          animation-play-state: paused;
        }
      `}} />

      {/* Dark Section */}
      <section dir={isRtl ? 'rtl' : 'ltr'} className="relative w-full bg-[#181914] overflow-hidden pt-32 pb-48 lg:pt-40 lg:pb-64">
        
        {/* Glow Overlay */}
        <div className={`absolute top-1/2 w-[150vw] h-[150vw] md:w-[100vw] md:h-[100vw] bg-[radial-gradient(circle_at_center,_rgba(128,122,48,0.25)_0%,_transparent_50%)] -translate-y-1/2 z-0 pointer-events-none ${isRtl ? 'left-0 -translate-x-1/4' : 'right-0 translate-x-1/4'}`} />
        
        <div className="container relative mx-auto px-6 lg:px-12 z-10 max-w-6xl">
          <RevealBox animation="fade-up" className="flex flex-col items-start max-w-4xl">
            <h3 className="text-[#a3a3a3] text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase mb-6">
              {subtitle}
            </h3>
            
            <h1 className="text-white font-bold leading-[1.05] tracking-tight mb-12" style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}>
              {titlePart1}
              <br />
              {titlePart2}
            </h1>
            
            <Link 
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-[#f5b800] hover:bg-[#dca500] text-black font-bold text-[13px] tracking-wide uppercase px-7 py-4 transition-colors"
            >
              {contactText}
              {isRtl ? <ArrowUpLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
            </Link>
          </RevealBox>
        </div>
      </section>

      {/* Overlapping Moving Boxes (Marquee) */}
      <div className="w-full relative z-20  mx-auto px-6 lg:px-12 -mt-24 lg:-mt-32 ">
        <RevealBox animation="fade-up" delay={200}>
          <div className="bg-white shadow-[0_30px_60px_rgba(0,0,0,0.15)] rounded-sm overflow-hidden flex pause-on-hover">
            
            {/* First Set */}
            <div className={`flex flex-shrink-0 w-max ${isRtl ? 'animate-marquee-rtl' : 'animate-marquee'}`}>
              {finalBoxes.map((box, idx) => (
                <Link 
                  href={`/${locale}/catalog?category=${box.id}`}
                  key={`set1-${idx}`} 
                  className={`w-[260px] lg:w-[300px] flex-shrink-0 p-6 lg:p-8 flex items-center justify-between gap-4 ${isRtl ? 'border-l' : 'border-r'} border-gray-100 hover:bg-gray-50 transition-colors group`}
                  draggable={false}
                >
                  <div className="flex flex-col items-start">
                    <div className="w-5 h-[2px] bg-gray-300 mb-4 group-hover:bg-[#f5b800] transition-colors" />
                    <h4 className="text-gray-900 font-semibold text-[13px] lg:text-[14px] leading-[1.3] uppercase tracking-wider">
                      {box.name}
                    </h4>
                  </div>
                  
                  {box.imageSrc && (
                    <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
                      <Image src={box.imageSrc} alt={box.name} fill className="object-cover group-hover:scale-110 transition-transform duration-300" draggable={false} />
                    </div>
                  )}
                </Link>
              ))}
            </div>

            {/* Second Set (Duplicate for seamless loop) */}
            <div className={`flex flex-shrink-0 w-max ${isRtl ? 'animate-marquee-rtl' : 'animate-marquee'}`} aria-hidden="true">
              {finalBoxes.map((box, idx) => (
                <Link 
                  href={`/${locale}/catalog?category=${box.id}`}
                  key={`set2-${idx}`} 
                  className={`w-[260px] lg:w-[300px] flex-shrink-0 p-6 lg:p-8 flex items-center justify-between gap-4 ${isRtl ? 'border-l' : 'border-r'} border-gray-100 hover:bg-gray-50 transition-colors group`}
                  draggable={false}
                  tabIndex={-1}
                >
                  <div className="flex flex-col items-start">
                    <div className="w-5 h-[2px] bg-gray-300 mb-4 group-hover:bg-[#f5b800] transition-colors" />
                    <h4 className="text-gray-900 font-semibold text-[13px] lg:text-[14px] leading-[1.3] uppercase tracking-wider">
                      {box.name}
                    </h4>
                  </div>
                  
                  {box.imageSrc && (
                    <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
                      <Image src={box.imageSrc} alt={box.name} fill className="object-cover group-hover:scale-110 transition-transform duration-300" draggable={false} />
                    </div>
                  )}
                </Link>
              ))}
            </div>

          </div>
        </RevealBox>
      </div>
    </div>
  );
}
