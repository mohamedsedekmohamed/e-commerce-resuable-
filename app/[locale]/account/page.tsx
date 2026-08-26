import { redirect } from 'next/navigation';

export default async function AccountPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  redirect(`/${locale}/account/orders`);
}
