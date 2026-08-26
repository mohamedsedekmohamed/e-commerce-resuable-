'use client';

import AddPage from '@/components/shared/AddPage';
import { Field } from '@/components/shared/form/FormTypes';
import { useRouter, useParams } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { servicesAdmin } from '@/services/service';
import { useTranslations } from 'next-intl';
import { DashboardFormValues } from '../../../dashboard-utils';

export default function EditServicePage() {
  const router = useRouter();
  const t = useTranslations('admin');
  const tForm = useTranslations('admin.form');
  const params = useParams();
  const id = params.id as string;

  const { data: service, isLoading: fetching } = useApiGet(servicesAdmin.getService, id);

  const { execute: updateService } = useApiAction(servicesAdmin.updateService, {
    showSuccessToast: true,
    successMsg: tForm('successEdit'),
  });

  const fields: Field[] = [
    {
      name: 'name_en',
      label: t('form.nameEn'),
      type: 'text',
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.services.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'name_ar',
      label: t('form.nameAr'),
      type: 'text',
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.services.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'description_en',
      label: t('form.descEn'),
      type: 'textarea',
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.services.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'description_ar',
      label: t('form.descAr'),
      type: 'textarea',
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.services.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'icon',
      label: t('form.icon'),
      type: 'file',
      required: false,
      section: t('pages.services.tabs.media'),
      sectionOrder: 2,
      sidebar: false,
    }
  ];

  const handleSave = async (data: DashboardFormValues) => {
    const formData = new FormData();
    formData.append('name[en]', String(data.name_en ?? ''));
    formData.append('name[ar]', String(data.name_ar ?? ''));
    formData.append('description[en]', String(data.description_en ?? ''));
    formData.append('description[ar]', String(data.description_ar ?? ''));
    if (data.icon instanceof File) {
      formData.append('icon', data.icon);
    }

    const result = await updateService(id, formData);
    if (result.success) {
      router.back();
    }
  };

  const sData = service;

  const initialData = sData ? {
    name_en: typeof sData.name === 'object' ? (sData.name.en || '') : sData.name,
    name_ar: typeof sData.name === 'object' ? (sData.name.ar || '') : sData.name,
    description_en: typeof sData.description === 'object' ? (sData.description.en || '') : sData.description,
    description_ar: typeof sData.description === 'object' ? (sData.description.ar || '') : sData.description,
    icon: sData.icon_url ?? (
      sData.icon && !sData.icon.startsWith('http')
        ? `https://ecommerce.mazoom.online/storage/${sData.icon.replace(/\\/g, '/')}`
        : sData.icon
    ),
  } : undefined;

  return (
    <AddPage
      title={t('pages.services.editTitle')}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
      isSaving={fetching}
      initialData={initialData}
    />
  );
}
