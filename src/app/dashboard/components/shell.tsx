'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { DesktopSidebar, MobileSidebar } from './sidebar';
import { DashboardHeader } from './header';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/projects': 'Projects',
  '/dashboard/certificates': 'Certificates',
  '/dashboard/skills': 'Skills',
  '/dashboard/resume': 'Resume',
  '/dashboard/messages': 'Messages',
  '/dashboard/settings': 'Settings',
};

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const title = pageTitles[pathname] || 'Dashboard';

  return (
    <div className="min-h-screen bg-dark">
      <DesktopSidebar />
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:ml-64 flex flex-col min-h-screen">
        <DashboardHeader
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          userName={session?.user?.name}
        />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
