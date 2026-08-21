import type { Metadata } from 'next';
import DashboardShell from './components/shell';
import { AuthProvider } from '@/components/auth-provider';

export const metadata: Metadata = {
  title: 'Dashboard | CodeVirtox Admin',
  description: 'CodeVirtox Administration Dashboard.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}

