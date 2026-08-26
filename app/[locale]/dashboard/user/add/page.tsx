'use client';

import AddPage from '@/components/shared/AddPage';
import { Field } from '@/components/shared/form/FormTypes';
import { useRouter } from 'next/navigation';
import { useApiAction } from '@/hooks/useApi';
import { usersAdmin } from '@/services/users';
import { useTranslations } from 'next-intl';
import { DashboardFormValues } from '../../dashboard-utils';

export default function AddUserPage() {
  const router = useRouter();
  const t = useTranslations('admin');

  const { execute: addUser } = useApiAction(usersAdmin.addUser, {
    showSuccessToast: true,
    successMsg: t('form.successAdd'),
  });

  const fields: Field[] = [
    {
      name: 'name',
      label: t('table.name'),
      type: 'text',
      required: true,
      requiredMessage: t('form.nameRequired'),
      section: t('form.personalInfo'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'email',
      label: t('table.email'),
      type: 'email',
      required: true,
      requiredMessage: t('form.emailRequired'),
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      patternMessage: t('form.invalidEmail'),
      section: t('form.accountInfo'),
      sectionOrder: 2,
      sidebar: false,
    },
    {
      name: 'phone',
      label: t('table.phone'),
      type: 'text',
      required: true,
      requiredMessage: t('form.phoneRequired'),
      pattern: /^[0-9]{7,15}$/,
      patternMessage: t('form.invalidPhone'),
      section: t('form.accountInfo'),
      sectionOrder: 2,
      sidebar: false,
    },
    {
      name: 'password',
      label: t('form.password'),
      type: 'password',
      required: true,
      requiredMessage: t('form.passwordRequired'),
      pattern: /^.{8,}$/,
      patternMessage: t('form.passwordLength'),
      section: t('form.accountInfo'),
      sectionOrder: 2,
      sidebar: false,
    },
  ];

  const handleSave = async (data: DashboardFormValues) => {
    const result = await addUser(data);
    if (result.success) {
      router.back();
    }
  };

  return (
    <AddPage
      title={t('pages.users.addTitle')}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
    />
  );
}
