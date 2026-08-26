'use client';

import AddPage from '@/components/shared/AddPage';
import { Field, FormValues } from '@/components/shared/form/FormTypes';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { settingsAdmin } from '@/services/settings';
import { StoreSettings } from '@/types/settings.interface';
import { useLocale, useTranslations } from 'next-intl';

const absoluteLogoUrl = (settings: StoreSettings) => {
  if (settings.logo_url) return settings.logo_url;
  if (!settings.logo || settings.logo.startsWith('http')) return settings.logo;
  return `https://ecommerce.mazoom.online/storage/${settings.logo.replace(/\\/g, '/')}`;
};

// التعديل هنا: دالة جديدة للتعامل مع رابط الصورة الثانية
const absoluteLogo2Url = (settings: StoreSettings) => {
  // افترضنا أن الخاصية في الـ type اسمها logo2_url و logo2
  if (settings.logo2_url) return settings.logo2_url;
  if (!settings.logo2 || settings.logo2.startsWith('http')) return settings.logo2;
  return `https://ecommerce.mazoom.online/storage/${settings.logo2.replace(/\\/g, '/')}`;
};

const valueOf = (values: FormValues, name: string) => {
  const value = values[name];
  return value === null || value === undefined ? '' : String(value);
};

export default function SettingsPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const tForm = useTranslations('admin.form');
  const { data: settings, isLoading: isFetching } = useApiGet(settingsAdmin.getSettings, locale);
  const { execute: updateSettings, isLoading: isUpdating } = useApiAction(settingsAdmin.updateSettings, {
    showSuccessToast: true,
    successMsg: tForm('successEdit'),
  });

  const fields: Field[] = [
    { name: 'brand_name_en', label: `${t('pages.settings.sections.name')} (EN)`, type: 'text', section: t('pages.settings.sections.branding'), sectionOrder: 1, sidebar: false },
    { name: 'brand_name_ar', label: `${t('pages.settings.sections.name')} (AR)`, type: 'text', section: t('pages.settings.sections.branding'), sectionOrder: 1, sidebar: false },
    { name: 'logo', label: t('pages.settings.logo'), type: 'file', section: t('pages.settings.sections.branding'), sectionOrder: 1, sidebar: false },
    // التعديل هنا: إضافة حقل الصورة الثانية
    // تأكد من إضافة ترجمة 'pages.settings.logo2' في ملفات الترجمة أو استبدلها بنص مباشر
    { name: 'logo2', label: t('pages.settings.logo2'), type: 'file', section: t('pages.settings.sections.branding'), sectionOrder: 1, sidebar: false }, 
    
    { name: 'currency', label: t('pages.settings.currency'), type: 'text', section: t('pages.settings.sections.currency'), sectionOrder: 2, sidebar: false },
    { name: 'min_order', label: t('pages.settings.minOrder'), type: 'number', section: t('pages.settings.sections.currency'), sectionOrder: 2, sidebar: false },
    { name: 'phone', label: t('pages.settings.phone'), type: 'text', section: t('pages.settings.sections.contact'), sectionOrder: 3, sidebar: false },
    { name: 'wattsapp', label: t('pages.settings.whatsapp'), type: 'text', section: t('pages.settings.sections.contact'), sectionOrder: 3, sidebar: false },
    { name: 'email', label: t('pages.settings.email'), type: 'email', section: t('pages.settings.sections.contact'), sectionOrder: 3, sidebar: false },
    { name: 'address', label: t('pages.settings.address'), type: 'textarea', section: t('pages.settings.sections.contact'), sectionOrder: 3, sidebar: false },
    { name: 'lat', label: 'Latitude', type: 'text', section: t('pages.settings.sections.location'), sectionOrder: 4, sidebar: false },
    { name: 'lng', label: 'Longitude', type: 'text', section: t('pages.settings.sections.location'), sectionOrder: 4, sidebar: false },
    { name: 'facebook', label: t('pages.settings.facebook'), type: 'text', section: t('pages.settings.sections.social'), sectionOrder: 5, sidebar: false },
    { name: 'insta', label: t('pages.settings.insta'), type: 'text', section: t('pages.settings.sections.social'), sectionOrder: 5, sidebar: false },
    { name: 'tiktok', label: t('pages.settings.tiktok'), type: 'text', section: t('pages.settings.sections.social'), sectionOrder: 5, sidebar: false },
    { name: 'ios_app', label: t('pages.settings.ios'), type: 'text', section: t('pages.settings.sections.apps'), sectionOrder: 6, sidebar: false },
    { name: 'android_app', label: t('pages.settings.android'), type: 'text', section: t('pages.settings.sections.apps'), sectionOrder: 6, sidebar: false },
    { name: 'sign_up_code', label: t('pages.settings.signUpCode'), type: 'switch', defaultValue: 0, section: t('pages.settings.sections.apps'), sectionOrder: 6, sidebar: false },
  ];

  const handleSave = async (data: FormValues) => {
    const formData = new FormData();
    formData.append('brand_name[en]', valueOf(data, 'brand_name_en'));
    formData.append('brand_name[ar]', valueOf(data, 'brand_name_ar'));

    [
      'phone', 'wattsapp', 'email', 'address', 'lat', 'lng', 'facebook', 'insta',
      'tiktok', 'ios_app', 'android_app', 'min_order', 'currency',
    ].forEach((field) => formData.append(field, valueOf(data, field)));

    const signUpCode = data.sign_up_code === true || data.sign_up_code === 1 || data.sign_up_code === '1';
    formData.append('sign_up_code', signUpCode ? '1' : '0');

    if (data.logo instanceof File) formData.append('logo', data.logo);
    // التعديل هنا: رفع الصورة الثانية في حال تم اختيارها
    if (data.logo2 instanceof File) formData.append('logo2', data.logo2);

    await updateSettings(locale, formData);
  };

  const initialData = settings ? {
    brand_name_en: settings.brand_name?.en ?? '',
    brand_name_ar: settings.brand_name?.ar ?? '',
    logo: absoluteLogoUrl(settings),
    // التعديل هنا: تمرير الرابط المبدئي للصورة الثانية
    logo2: absoluteLogo2Url(settings),
    phone: settings.phone ?? '',
    wattsapp: settings.wattsapp ?? '',
    email: settings.email ?? '',
    address: settings.address ?? '',
    lat: settings.lat ?? '',
    lng: settings.lng ?? '',
    facebook: settings.facebook ?? '',
    insta: settings.insta ?? '',
    tiktok: settings.tiktok ?? '',
    ios_app: settings.ios_app ?? '',
    android_app: settings.android_app ?? '',
    min_order: settings.min_order ?? '',
    sign_up_code: settings.sign_up_code ? 1 : 0,
    currency: settings.currency ?? '',
  } : undefined;

  return (
    <AddPage
      title={t('pages.settings.title')}
      fields={fields}
      onSave={handleSave}
      isSaving={isFetching || isUpdating}
      initialData={initialData}
    />
  );
}