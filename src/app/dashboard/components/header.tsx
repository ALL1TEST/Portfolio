'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Menu, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { NotificationBell } from './notification-bell';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  userName?: string | null;
}

export function DashboardHeader({ title, onMenuClick, userName }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success('Logged out');
      router.push('/login');
      router.refresh();
    } catch {
      toast.error('Failed to logout');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-dark/80 backdrop-blur-md border-b border-stroke flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-text hover:text-white hover:bg-surface"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <NotificationBell />
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-text">
          <User className="w-4 h-4" />
          <span>{userName || 'Admin'}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-muted-text hover:text-white hover:bg-surface gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
