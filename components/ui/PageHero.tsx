'use client';

import React from 'react';
import Image from 'next/image';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image?: string;
  label?: string;
}

export default function PageHero({ title, subtitle, image, label }: PageHeroProps) {
  return (
    <div className="relative flex flex-col justify-center overflow-hidden bg-[#0a0a0a] min-h-[220px] md:min-h-[260px] border-b border-white/[0.05]">
      
      {/* ── Background Elements ── */}
      {image ? (
        <>
          <div className="absolute inset-0 z-0">
            <Image src={image} alt={title} fill className="object-cover opacity-40" sizes="100vw" priority />
          </div>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        </>
      ) : (
        <>
          {/* Subtle Glow & Pattern */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px)',
          }} />
        </>
      )}

      {/* ── Content ── */}
      <div className="container relative z-10 py-12">
        <div className="max-w-3xl flex flex-col gap-4">
          
          {label && (
            <div className="flex items-center gap-3">
              <span className="block w-8 h-[2px] bg-primary shrink-0 rounded-full" />
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-primary shadow-sm">
                {label}
              </span>
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-xl mt-2 font-medium">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-70" />
    </div>
  );
}
