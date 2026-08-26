'use client';

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, User } from 'lucide-react';
import UIBtn from '@/components/ui/UIBtn';
import { useTranslations } from 'next-intl';

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

interface RegisterFormProps {
  onSubmit: (data: RegisterPayload) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

const INPUT = "w-full bg-white border border-border hover:border-primary/40 focus:border-primary/60 outline-none py-3 text-foreground text-sm placeholder-foreground/30 transition-colors duration-150";

export default function RegisterForm({ onSubmit, isLoading, error }: RegisterFormProps) {
  const t = useTranslations('common');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    let hasError = false;
    const errors: Record<string, string> = {};

    if (!name) { errors.name = t('name_required', { fallback: 'Name is required' }); hasError = true; }
    if (!phone) { errors.phone = t('phone_required', { fallback: 'Phone is required' }); hasError = true; }
    if (!email) { errors.email = t('email_required', { fallback: 'Email is required' }); hasError = true; }
    if (!password) { errors.password = t('password_required', { fallback: 'Password is required' }); hasError = true; }
    if (!passwordConfirm) { errors.passwordConfirm = t('password_confirm_required', { fallback: 'Confirm password is required' }); hasError = true; }

    if (!hasError && password.length < 6) {
      errors.password = t('password_must_be_at_least_6_ch', { fallback: 'Password must be at least 6 characters' });
      hasError = true;
    }

    if (!hasError && password !== passwordConfirm) {
      errors.passwordConfirm = t('passwords_do_not_match', { fallback: 'Passwords do not match' });
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(errors);
      return;
    }

    onSubmit({ name, email, phone, password, password_confirmation: passwordConfirm });
  };

  const displayError = error && typeof error === 'string' ? error : null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" dir={t('ltr')}>

      {/* Error */}
      {displayError && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{displayError}</p>
        </div>
      )}

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold tracking-wide uppercase text-foreground/50">
          {t('full_name')}
        </label>
        <div className="relative">
          <User className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 pointer-events-none" />
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t('enter_your_full_name')}
            className={`${INPUT} ps-10 pe-4`}
          />
        </div>
        {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold tracking-wide uppercase text-foreground/50">
          {t('phone', { fallback: 'Phone' })}
        </label>
        <div className="relative">
          <svg className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="01xxxxxxxxx"
            className={`${INPUT} ps-10 pe-4`}
          />
        </div>
        {fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold tracking-wide uppercase text-foreground/50">
          {t('email_address')}
        </label>
        <div className="relative">
          <Mail className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 pointer-events-none" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t('enter_your_email')}
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
            placeholder={t('text_944')}
            className={`${INPUT} ps-10 pe-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute inset-e-3.5 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-primary transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold tracking-wide uppercase text-foreground/50">
          {t('confirm_password')}
        </label>
        <div className="relative">
          <Lock className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 pointer-events-none" />
          <input
            type={showPasswordConfirm ? 'text' : 'password'}
            value={passwordConfirm}
            onChange={e => setPasswordConfirm(e.target.value)}
            placeholder={t('text_2157')}
            className={`${INPUT} ps-10 pe-11`}
          />
          <button
            type="button"
            onClick={() => setShowPasswordConfirm(v => !v)}
            className="absolute inset-e-3.5 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-primary transition-colors"
          >
            {showPasswordConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {fieldErrors.passwordConfirm && <p className="text-xs text-red-500 mt-1">{fieldErrors.passwordConfirm}</p>}
      </div>

      {/* Submit */}
      <UIBtn
        variant="primary"
        size="lg"
        type="submit"
        fullWidth
        isLoading={isLoading}
        text={isLoading ? t('creating_account') : t('create_account')}
        btnStyle="mt-2"
      />
    </form>
  );
}
