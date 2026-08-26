'use client';

import AddPage from '@/components/shared/AddPage';
import { Field } from '@/components/shared/form/FormTypes';
import { useRouter } from 'next/navigation';
import { useApiAction } from '@/hooks/useApi';
import { servicesAdmin } from '@/services/service';
import { useTranslations } from 'next-intl';
import { DashboardFormValues } from '../../dashboard-utils';

export default function AddServicePage() {
  const router = useRouter();
  const t = useTranslations('admin');
  const tForm = useTranslations('admin.form');

  const { execute: addService } = useApiAction(servicesAdmin.addService, {
    showSuccessToast: true,
    successMsg: tForm('successAdd'),
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
      label: t('form.image'),
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

    const result = await addService(formData);
    if (result.success) {
      router.back();
    }
  };

  return (
    <AddPage
      title={t('pages.services.addTitle')}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
    />
  );
}
