'use client';

import AddPage from '@/components/shared/AddPage';
import { Field } from '@/components/shared/form/FormTypes';
import { useRouter, useParams } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { usersAdmin } from '@/services/users';
import { useLocale, useTranslations } from 'next-intl';
import { DashboardFormValues } from '../../../dashboard-utils';

export default function EditUserPage() {
  const router = useRouter();
  const tForm = useTranslations('admin.form');
  const t = useTranslations('admin');
  const locale = useLocale();
  const params = useParams();
  const id = params.id as string;

  const { data: user, isLoading: fetching } = useApiGet(usersAdmin.getUser, id, locale);

  const { execute: updateUser } = useApiAction(usersAdmin.updateUser, {
    showSuccessToast: true,
    successMsg: tForm('successEdit'),
  });

  const fields: Field[] = [
    {
      name: 'name',
      label: t('table.name'),
      type: 'text',
      required: true,
      requiredMessage: tForm('nameRequired'),
      section: tForm('personalInfo'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'email',
      label: t('table.email'),
      type: 'email',
      required: true,
      requiredMessage: tForm('emailRequired'),
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      patternMessage: tForm('invalidEmail'),
      section: tForm('accountInfo'),
      sectionOrder: 2,
      sidebar: false,
    },
    {
      name: 'phone',
      label: t('table.phone'),
      type: 'text',
      required: true,
      requiredMessage: tForm('phoneRequired'),
      pattern: /^[0-9]{7,15}$/,
      patternMessage: tForm('invalidPhone'),
      section: tForm('accountInfo'),
      sectionOrder: 2,
      sidebar: false,
    },
    {
      name: 'password',
      label: tForm('password'),
      type: 'password',
      required: false,
      section: tForm('accountInfo'),
      sectionOrder: 2,
      sidebar: false,
      placeholder: 'Leave blank to keep current',
      customValidator: (value) => {
        if (!value || String(value).trim() === '') return null;
        if (String(value).length < 8) return tForm('passwordLength');
        return null;
      },
    },
  ];

  const handleSave = async (data: DashboardFormValues) => {
    const payload = { ...data };
    if (typeof payload.password !== 'string' || payload.password.trim() === '') {
      delete payload.password;
    }
    const result = await updateUser(id, payload);
    if (result.success) {
      router.back();
    }
  };

  const userData = user?.data || user;

  return (
    <AddPage
      title={t('pages.users.editTitle')}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
      isSaving={fetching}
      initialData={userData ? {
        name: userData.name ?? '',
        email: userData.email ?? '',
        phone: userData.phone ?? '',
      } : undefined}
    />
  );
}
