import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  label?: string;
  actionLabel?: string;
  actionHref?: string;
  locale?: string;
}

export default function SectionHeader({ title, subtitle, label, actionLabel, actionHref, locale = 'en' }: SectionHeaderProps) {
  const isRtl = locale === 'ar';

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div className="flex items-start gap-3">
        {/* Vertical accent bar */}
        <span className="block w-1.5 h-full min-h-[2.5rem] bg-secondary shrink-0 mt-1" />
        <div className="flex flex-col gap-1">
          {label && (
            <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/70">
              {label}
            </span>
          )}
          <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-sm text-foreground/45 max-w-lg mt-1 leading-relaxed">{subtitle}</p>
          )}
        </div>
      </div>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-400 border-b border-primary/25 hover:border-primary pb-0.5 transition-colors duration-150 shrink-0"
        >
          {actionLabel}
          {isRtl
            ? <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-150" />
            : <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />}
        </Link>
      )}
    </div>
  );
}
