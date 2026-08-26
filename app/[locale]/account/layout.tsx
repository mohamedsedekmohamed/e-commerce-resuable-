import React from 'react';
import UserSidebar from '@/components/account/UserSidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'My Account',
};

export default async function AccountLayout({ children, params }: { children: React.ReactNode, params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('user_token')?.value || cookieStore.get('admin_token')?.value;

  if (!token) {
    redirect(`/${locale}/auth/login`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Navbar />
      <div className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 h-full">
          <div className="flex flex-col md:flex-row gap-8 h-full items-start">
            <div className="w-full md:w-64 shrink-0 md:sticky md:top-24">
              <UserSidebar />
            </div>
            <div className="flex-1 bg-card border border-border/60 shadow-sm p-6 md:p-8 rounded-2xl min-h-[600px] w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
