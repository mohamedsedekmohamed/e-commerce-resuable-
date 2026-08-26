'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import RegisterForm, { RegisterPayload } from '@/components/auth/RegisterForm';
import UITranslateBtn from '@/components/ui/UITranslateBtn';
import { useTranslations } from 'next-intl';

import { useState } from 'react';
import { authService } from '@/services/auth';
import { useApiAction } from '@/hooks/useApi';
import ROUTES from '@/core/manager/route.manager';
import UIBtn from '@/components/ui/UIBtn';

export default function UserRegisterPage() {
  const t = useTranslations('login');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';

  const [requireOtp, setRequireOtp] = useState(false);
  const [tempEmail, setTempEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);

  const { execute: executeSignUp, isLoading: isSigningUp } = useApiAction(authService.signUp, {
    showSuccessToast: true,
    showErrorToast: true,
  });

  const { execute: executeCheckCode, isLoading: isCheckingCode } = useApiAction(authService.checkCode, {
    showSuccessToast: true,
    showErrorToast: false,
  });

  const handleSubmit = async (data: RegisterPayload) => {
    // TO DO: Connect this with actual user register API when available
    console.log('Registering user with:', data);
    // Fake success for now, redirect to login
    router.push(`/${locale}/auth/login`);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    try {
      const res = await executeCheckCode({ email: tempEmail, code: otpCode });
      if (res?.data) {
        router.push(`/${locale}/auth/login`);
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setOtpError(msg || 'Invalid verification code');
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

      <div className="w-full max-w-md bg-card rounded-xl shadow-sm border border-border p-8 sm:p-10 flex flex-col gap-8 my-10">
        
        {/* Tabs */}
        {!requireOtp && (
          <div className="flex border-b border-border/60 -mt-2">
            <Link href={`/${locale}/auth/login`} className="flex-1 pb-3 text-center border-b-2 border-transparent text-foreground/50 hover:text-foreground text-sm font-medium transition-colors">
              {t('login_tab')}
            </Link>
            <div className="flex-1 pb-3 text-center border-b-2 border-secondary text-secondary font-bold text-sm">
              {t('signup_tab')}
            </div>
          </div>
        )}

        {/* Form */}
        <motion.div
          key={requireOtp ? "otp-form" : "register-form"}
          initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {requireOtp ? (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5" dir={isRtl ? 'rtl' : 'ltr'}>
              <div className="text-center mb-2">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  {isRtl ? 'تحقق من بريدك الإلكتروني' : 'Verify your email'}
                </h2>
                <p className="text-sm text-foreground/60">
                  {isRtl ? 'أدخل الكود المرسل إلى' : 'Enter the code sent to'} <span className="font-medium text-foreground">{tempEmail}</span>
                </p>
              </div>

              {otpError && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-600">
                  {otpError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide uppercase text-foreground/50">
                  {isRtl ? 'رمز التحقق' : 'Verification Code'}
                </label>
                <input
                  type="text"
                  required
                  maxLength={7}
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  placeholder="1234567"
                  className="w-full bg-white border border-border hover:border-primary/40 focus:border-primary/60 outline-none px-4 py-3 text-foreground text-sm placeholder-foreground/30 transition-colors duration-150 text-center tracking-widest font-medium"
                />
              </div>

              <UIBtn
                variant="primary"
                size="lg"
                type="submit"
                fullWidth
                isLoading={isCheckingCode}
                text={isRtl ? 'تأكيد الرمز' : 'Verify Code'}
                btnStyle="mt-2"
              />
              
              <button 
                type="button" 
                onClick={() => setRequireOtp(false)}
                className="text-sm text-foreground/50 hover:text-foreground mt-2"
              >
                {isRtl ? 'العودة للتسجيل' : 'Back to register'}
              </button>
            </form>
          ) : (
            <RegisterForm onSubmit={handleSubmit} isLoading={isSigningUp} />
          )}
        </motion.div>
        
      </div>

    </div>
  );
}
