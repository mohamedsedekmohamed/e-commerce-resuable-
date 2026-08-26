'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import ForgotPasswordFlow from '@/components/auth/ForgotPasswordFlow';
import UITranslateBtn from '@/components/ui/UITranslateBtn';
import { motion } from 'framer-motion';

export default function AdminForgotPasswordPage() {
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';

  const handleSuccess = () => {
    router.push(`/${locale}/auth/admin-login`);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center relative p-4" dir={tCommon('ltr')}>
      
      {/* Top controls */}
      <div className="absolute top-4 inset-x-4 md:inset-x-8 z-20 flex items-center justify-between">
        <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-secondary transition-colors font-medium">
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {tCommon('back_to_store')}
        </Link>
        <UITranslateBtn />
      </div>

      <div className="w-full max-w-md bg-card rounded-xl shadow-sm border border-border p-8 sm:p-10 flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {isRtl ? 'استعادة كلمة مرور الإدارة' : 'Admin Password Reset'}
          </h1>
          <p className="text-sm text-foreground/60">
            {isRtl ? 'اتبع الخطوات لاستعادة كلمة المرور' : 'Follow the steps to reset your password'}
          </p>
        </div>

        {/* Form */}
        <motion.div
          key="admin-forgot-password-form"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <ForgotPasswordFlow onSuccess={handleSuccess} userType="admin" />
        </motion.div>

        <div className="flex justify-center -mt-2">
          <Link href={`/${locale}/auth/admin-login`} className="text-sm font-semibold text-foreground/50 hover:text-foreground transition-colors">
            {isRtl ? 'العودة لتسجيل الدخول' : 'Back to Login'}
          </Link>
        </div>
        
      </div>

    </div>
  );
}
