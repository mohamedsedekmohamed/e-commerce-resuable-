'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import "@/styles/globals.css";

export default function NotFound() {
  return (
    <html lang="en" dir="ltr">
      <body className="antialiased">
        <main
          className="bg-background text-foreground min-h-screen flex flex-col"
        >
          <div className="grow flex items-center justify-center py-20 px-4">
            <div className="w-full max-w-xl text-center ph-fadein">

              {/* ── Big 404 number ── */}
              <div className="relative mb-8 select-none">
                <span
                  className="block font-bold text-primary/6 leading-none"
                  style={{ fontSize: 'clamp(7rem, 22vw, 14rem)' }}
                >
                  404
                </span>
                {/* Accent line under 404 */}
                <span className="absolute bottom-0 inset-x-0 flex justify-center">
                  <span className="block w-16 h-0.5 bg-secondary" />
                </span>
              </div>

              {/* ── Label ── */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="block w-6 h-px bg-secondary shrink-0" />
                <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-secondary">
                  Error / خطأ
                </span>
                <span className="block w-6 h-px bg-secondary shrink-0" />
              </div>

              {/* ── Title ── */}
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-4">
                Page Not Found / الصفحة غير موجودة
              </h1>

              {/* ── Subtitle ── */}
              <p className="text-sm text-foreground/50 leading-relaxed max-w-md mx-auto mb-10">
                Sorry, we couldn't find the page you're looking for. <br />
                عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.
              </p>

              {/* ── CTA ── */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-semibold hover:bg-primary-400 transition-colors duration-150 ph-btn-primary"
                >
                  <Home className="w-4 h-4 shrink-0" />
                  Back to Home / العودة للرئيسية
                </Link>

                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border text-sm font-medium text-foreground/60 hover:border-primary hover:text-primary transition-colors duration-150"
                >
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                  Go Back / رجوع
                </button>
              </div>

              {/* ── Decorative divider ── */}
              <div className="mt-14 pt-8 border-t border-border flex items-center justify-center gap-6">
                <Link href="/" className="text-xs font-medium text-foreground/40 hover:text-primary transition-colors duration-150">Home</Link>
              </div>

            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
