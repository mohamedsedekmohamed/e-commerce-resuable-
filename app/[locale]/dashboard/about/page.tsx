'use client';

import AddPage from '@/components/shared/AddPage';
import { Field } from '@/components/shared/form/FormTypes';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { aboutAdmin } from '@/services/about';
import { useTranslations } from 'next-intl';
import { DashboardFormValues } from '../dashboard-utils';

export default function AboutPage() {
  const t = useTranslations('admin');
  const tForm = useTranslations('admin.form');

  const { data: about, isLoading: fetching } = useApiGet(aboutAdmin.getAbout);

  const { execute: updateAbout } = useApiAction(aboutAdmin.updateOAbout, {
    showSuccessToast: true,
    successMsg: tForm('successEdit'),
  });

  const fields: Field[] = [
    {
      name: 'title_en',
      label: t('form.titleEn'),
      type: 'text',
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.about.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'title_ar',
      label: t('form.titleAr'),
      type: 'text',
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.about.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'description_en',
      label: t('form.descEn'),
      type: 'textarea',
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.about.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'description_ar',
      label: t('form.descAr'),
      type: 'textarea',
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.about.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'image',
      label: t('form.image'),
      type: 'file',
      required: false,
      section: t('pages.about.tabs.media'),
      sectionOrder: 2,
      sidebar: false,
    }
  ];

  const handleSave = async (data: DashboardFormValues) => {
    const formData = new FormData();
    formData.append('title[en]', String(data.title_en ?? ''));
    formData.append('title[ar]', String(data.title_ar ?? ''));
    formData.append('content[en]', String(data.description_en ?? ''));
    formData.append('content[ar]', String(data.description_ar ?? ''));
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    await updateAbout(formData);
  };

  const aData = about;

  const initialData = aData ? {
    title_en: typeof aData.title === 'object' ? (aData.title?.en || '') : aData.title,
    title_ar: typeof aData.title === 'object' ? (aData.title?.ar || '') : aData.title,
    description_en: typeof aData.description === 'object' ? (aData.description?.en || '') : aData.description,
    description_ar: typeof aData.description === 'object' ? (aData.description?.ar || '') : aData.description,
    image: aData.image && !aData.image.startsWith('http') ? `https://ecommerce.mazoom.online/storage/${aData.image}` : aData.image,
  } : undefined;

  return (
    <AddPage
      title={t('pages.about.title')}
      fields={fields}
      onSave={handleSave}
      isSaving={fetching}
      initialData={initialData}
    />
  );
}
