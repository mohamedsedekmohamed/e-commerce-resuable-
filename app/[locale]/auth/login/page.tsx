'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { authService } from '@/services/auth';
import { useApiAction } from '@/hooks/useApi';
import LoginForm from '@/components/auth/LoginForm';
import UITranslateBtn from '@/components/ui/UITranslateBtn';

export default function UserLoginPage() {
  const t = useTranslations('login');
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
      
      if (user?.role === 'admin' || user?.role === 'super_admin') {
        setErrorMessage(isRtl ? 'يرجى تسجيل الدخول من صفحة الإدارة' : 'Please use the Admin login page.');
        return;
      }

      authService.saveSession(token, user?.role || 'user', user ?? undefined);
      router.push(`/${locale}/account/orders`);
      
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
        
        {/* Tabs */}
        <div className="flex border-b border-border/60 -mt-2">
          <div className="flex-1 pb-3 text-center border-b-2 border-secondary text-secondary font-bold text-sm">
            {t('login_tab')}
          </div>
          <Link href={`/${locale}/auth/register`} className="flex-1 pb-3 text-center border-b-2 border-transparent text-foreground/50 hover:text-foreground text-sm font-medium transition-colors">
            {t('signup_tab')}
          </Link>
        </div>

        {/* Form */}
        <motion.div
          key="login-form"
          initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <LoginForm 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
            error={errorMessage} 
            forgotPasswordHref={`/${locale}/auth/forgot-password`}
          />
        </motion.div>
        

      </div>

    </div>
  );
}
