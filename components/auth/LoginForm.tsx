'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import UIBtn from '@/components/ui/UIBtn';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
  forgotPasswordHref?: string;
}

const INPUT = "w-full bg-white border border-border hover:border-primary/40 focus:border-primary/60 outline-none py-3 text-foreground text-sm placeholder-foreground/30 transition-colors duration-150";

export default function LoginForm({ onSubmit, isLoading, error, forgotPasswordHref }: LoginFormProps) {
  const t = useTranslations('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{email?: string, password?: string}>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    let hasError = false;
    const errors: {email?: string, password?: string} = {};

    if (!email) {
      errors.email = t('email_required', { fallback: 'Email is required' });
      hasError = true;
    }
    
    if (!password) {
      errors.password = t('password_required', { fallback: 'Password is required' });
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(errors);
      return;
    }

    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Error */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Email */}
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
          />
        </div>
        {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold tracking-wide uppercase text-foreground/50">
          {t('password')}
        </label>
        <div className="relative">
          <Lock className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={t('passwordPlaceholder')}
            className={`${INPUT} ps-10 pe-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute inset-e-3.5 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-primary transition-colors"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
      </div>

      {forgotPasswordHref && (
        <div className="flex justify-end -mt-2">
          <Link 
            href={forgotPasswordHref} 
            className="text-xs font-semibold text-primary hover:text-primary-600 transition-colors"
          >
            {t('forgotPassword')}
          </Link>
        </div>
      )}

      {/* Submit */}
      <UIBtn
        variant="primary"
        size="lg"
        type="submit"
        fullWidth
        isLoading={isLoading}
        text={isLoading ? t('loading') : t('submit')}
        btnStyle="mt-1"
      />
    </form>
  );
}
