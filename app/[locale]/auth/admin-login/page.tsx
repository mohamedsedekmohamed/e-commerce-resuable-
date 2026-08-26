'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { authService } from '@/services/auth';
import { useApiAction } from '@/hooks/useApi';
import ROUTES from '@/core/manager/route.manager';
import LoginForm from '@/components/auth/LoginForm';
import UITranslateBtn from '@/components/ui/UITranslateBtn';

export default function AdminLoginPage() {
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { execute, isLoading } = useApiAction(authService.login, {
    showSuccessToast: true,
    showErrorToast: false,
  });

  const handleSubmit = async (email: string, password: string) => {
    setErrorMessage(null);
    const result = await execute({ email, password });
    if (result.success && result.data?.token) {
      const { token, user } = result.data;
      
      if (user?.role !== 'admin' && user?.role !== 'super_admin' && user?.role !== 'vendor') {
        setErrorMessage(isRtl ? 'غير مصرح لك بالدخول كمسؤول' : 'Unauthorized. Admin access required.');
        return;
      }
      
      authService.saveSession(token, user?.role || 'admin', user ?? undefined);
      router.push(`/${locale}${ROUTES.dashboard.overview}`);
      
    } else {
      let msg = result.message;
      if (!msg || msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('credentials')) {
        msg = tCommon('incorrect_email_or_password_pl');
      }
      setErrorMessage(msg);
    }
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
            {isRtl ? 'تسجيل دخول لوحة التحكم' : 'Admin Login'}
          </h1>
          <p className="text-sm text-foreground/60">
            {isRtl ? 'يرجى تسجيل الدخول للوصول إلى لوحة التحكم' : 'Please sign in to access the dashboard'}
          </p>
        </div>

        {/* Form */}
        <motion.div
          key="admin-login-form"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <LoginForm 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
            error={errorMessage} 
            forgotPasswordHref={`/${locale}/auth/admin-forgot-password`}
          />
        </motion.div>
        
      </div>

    </div>
  );
}
