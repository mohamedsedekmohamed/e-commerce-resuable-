'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, KeyRound, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import UIBtn from '@/components/ui/UIBtn';
import { authService } from '@/services/auth';
import { useApiAction } from '@/hooks/useApi';
import { motion, AnimatePresence } from 'framer-motion';

const INPUT = "w-full bg-white border border-border hover:border-primary/40 focus:border-primary/60 outline-none py-3 text-foreground text-sm placeholder-foreground/30 transition-colors duration-150";

interface ForgotPasswordFlowProps {
  onSuccess: () => void;
  userType: 'user' | 'admin';
}

export default function ForgotPasswordFlow({ onSuccess, userType }: ForgotPasswordFlowProps) {
  const t = useTranslations('login'); // Reusing login translations or common if needed
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { execute: reqForgetPassword, isLoading: isRequesting } = useApiAction(authService.forgetPassword, {
    showSuccessToast: true,
    showErrorToast: false,
  });

  const { execute: reqCheckCode, isLoading: isChecking } = useApiAction(authService.checkCodeForgetPassword, {
    showSuccessToast: true,
    showErrorToast: false,
  });

  const { execute: reqNewPassword, isLoading: isSaving } = useApiAction(authService.newPasswordForgetPassword, {
    showSuccessToast: true,
    showErrorToast: false,
  });

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email) {
      setErrorMessage(t('email_required', { fallback: 'Email is required' }));
      return;
    }
    const res = await reqForgetPassword({ email });
    if (res.success) {
      setStep(2);
    } else {
      setErrorMessage(res.message || 'Failed to request password reset');
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!code) {
      setErrorMessage('Code is required');
      return;
    }
    const res = await reqCheckCode({ email, code });
    if (res.success) {
      setStep(3);
    } else {
      setErrorMessage(res.message || 'Invalid code');
    }
  };

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!newPassword) {
      setErrorMessage('New password is required');
      return;
    }
    const res = await reqNewPassword({ email, code, new_password: newPassword });
    if (res.success) {
      onSuccess();
    } else {
      setErrorMessage(res.message || 'Failed to reset password');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {errorMessage && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.form 
            key="step1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onSubmit={handleStep1} 
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-foreground/50">
                {t('email')}
              </label>
              <div className="relative">
                <Mail className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  className={`${INPUT} ps-10 pe-4`}
                  required
                />
              </div>
            </div>
            <UIBtn
              variant="primary"
              size="lg"
              type="submit"
              fullWidth
              isLoading={isRequesting}
              text="Send Reset Code"
            />
          </motion.form>
        )}

        {step === 2 && (
          <motion.form 
            key="step2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onSubmit={handleStep2} 
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-foreground/50">
                Reset Code
              </label>
              <div className="relative">
                <KeyRound className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 pointer-events-none" />
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="Enter the code sent to your email"
                  className={`${INPUT} ps-10 pe-4`}
                  required
                />
              </div>
              <p className="text-xs text-foreground/50 mt-1">
                Sent to: <span className="font-semibold text-foreground/70">{email}</span>
                <button type="button" onClick={() => setStep(1)} className="ms-2 text-primary hover:underline">Change</button>
              </p>
            </div>
            <UIBtn
              variant="primary"
              size="lg"
              type="submit"
              fullWidth
              isLoading={isChecking}
              text="Verify Code"
            />
          </motion.form>
        )}

        {step === 3 && (
          <motion.form 
            key="step3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onSubmit={handleStep3} 
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-foreground/50">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className={`${INPUT} ps-10 pe-11`}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-e-3.5 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <UIBtn
              variant="primary"
              size="lg"
              type="submit"
              fullWidth
              isLoading={isSaving}
              text="Reset Password"
            />
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
