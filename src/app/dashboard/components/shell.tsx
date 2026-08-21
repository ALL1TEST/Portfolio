'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { DesktopSidebar, MobileSidebar } from './sidebar';
import { DashboardHeader } from './header';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/projects': 'Projects',
  '/dashboard/certificates': 'Certificates',
  '/dashboard/education': 'Education',
  '/dashboard/skills': 'Skills',
  '/dashboard/resume': 'Resume',
  '/dashboard/messages': 'Messages',
  '/dashboard/settings': 'Settings',
};

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('dashboard_sidebar_collapsed');
      if (stored === 'true') {
        setCollapsed(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem('dashboard_sidebar_collapsed', String(next));
    } catch {
      // ignore
    }
  };

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
      <DesktopSidebar collapsed={collapsed} onToggleCollapse={toggleCollapse} />
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-300 ease-in-out',
          collapsed ? 'md:ml-[70px]' : 'md:ml-64'
        )}
      >
        <DashboardHeader
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          userName={session?.user?.name}
        />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
