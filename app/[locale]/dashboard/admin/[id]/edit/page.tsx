'use client';

import AddPage from '@/components/shared/AddPage';
import { Field } from '@/components/shared/form/FormTypes';
import { useRouter, useParams } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { adminsAdmin } from '@/services/admins';
import { useLocale, useTranslations } from 'next-intl';
import { DashboardFormValues } from '../../../dashboard-utils';
export default function EditAdminPage() {
  const router = useRouter();
  const tForm = useTranslations('admin.form');
  const locale = useLocale();
  const params = useParams();
  const id     = params.id as string;

  // Fetch existing admin data
  const { data: admin, isLoading: fetching } = useApiGet(
    adminsAdmin.getAdmin,
    id,
    locale,
  );

  const { execute: updateAdmin } = useApiAction(adminsAdmin.updateAdmin, {
    showSuccessToast: true,
    successMsg: tForm('successDelete'),
  });

  const fields: Field[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    requiredMessage: 'Name is required',
    section: 'Personal Information',
    sectionOrder: 1,
    sidebar: false,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    requiredMessage: 'Email address is required',
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
    patternMessage: 'Please enter a valid email address',
    section: 'Account Information',
    sectionOrder: 2,
    sidebar: false,
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'text',
    required: true,
    requiredMessage: 'Phone number is required',
    pattern: /^[0-9]{7,15}$/, 
    patternMessage: 'Please enter a valid phone number (7-15 digits only)',
    section: 'Account Information',
    sectionOrder: 2,
    sidebar: false,
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: false, // 👈 اختياري لكي لا يجبر المسؤول على تحديثه دائماً
    section: 'Account Information',
    sectionOrder: 2,
    sidebar: false,
    placeholder: 'Leave blank to keep current',
    // 👇 نستخدم الـ customValidator للتحقق الذكي (فقط إذا كتب شيئاً)
    customValidator: (value) => {
      if (!value || String(value).trim() === '') {
        return null; // فارغ؟ يمر بسلام ويحافظ على الباسورد القديم
      }
      if (String(value).length < 8) {
        return 'Password must be at least 8 characters long'; // كتب شيئاً؟ يجب ألا يقل عن 8 أحرف
      }
      return null;
    },
  },
];

  const handleSave = async (data: DashboardFormValues) => {
    const payload = { ...data };
    if (typeof payload.password !== 'string' || payload.password.trim() === '') {
      delete payload.password;
    }
    const result = await updateAdmin(id, payload);
    if (result.success) {
      router.back();
    }
  };

  return (
    <AddPage
      title="Edit Admin"
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
      isSaving={fetching}
      initialData={admin ? {
        name:  admin.name  ?? '',
        email: admin.email ?? '',
        phone: admin.phone ?? '',
      } : undefined}
    />
  );
}
