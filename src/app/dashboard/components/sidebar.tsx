'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  Award,
  Code2,
  FileText,
  Mail,
  Settings,
  Zap,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { label: 'Certificates', href: '/dashboard/certificates', icon: Award },
  { label: 'Education', href: '/dashboard/education', icon: GraduationCap },
  { label: 'Skills', href: '/dashboard/skills', icon: Code2 },
  { label: 'Resume', href: '/dashboard/resume', icon: FileText },
  { label: 'Messages', href: '/dashboard/messages', icon: Mail, showBadge: true },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [profile, setProfile] = useState<{ logoUrl?: string; brandName?: string } | null>(null);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.unreadMessages || 0);
        }
      } catch {
        // Silently fail
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch {
        // Silently fail
      }
    };
    fetchProfile();
  }, [pathname]);

  const handleNav = useCallback(
    (href: string) => {
      router.push(href);
      onNavigate?.();
    },
    [router, onNavigate]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-4 py-6 flex items-center gap-2.5">
        <img
          src={profile?.logoUrl || '/logo.png'}
          alt="Logo"
          className="object-contain h-10 w-auto flex-shrink-0"
        />
        <span className="text-xl font-medium tracking-tight text-white/90">
          {profile?.brandName || 'CodeVirtox'}
        </span>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-stroke" />

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group w-full text-left cursor-pointer',
                  isActive
                    ? 'bg-brand/10 text-brand'
                    : 'text-muted-text hover:text-white hover:bg-surface'
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand rounded-r" />
                )}
                <Icon className={cn('w-4.5 h-4.5 flex-shrink-0', isActive && 'text-brand')} />
                <span>{item.label}</span>
                {item.showBadge && unreadCount > 0 && (
                  <Badge className="ml-auto bg-brand text-white text-[10px] px-1.5 py-0.5 min-w-[20px] flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-stroke">
        <p className="text-[11px] text-muted-text">
          &copy; {new Date().getFullYear()} CodeVirtox
        </p>
      </div>
    </div>
  );
}

export function MobileSidebar({ open, onClose }: SidebarProps) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose?.()}>
      <SheetContent side="left" className="bg-surface border-stroke p-0 w-72">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <NavContent onNavigate={onClose} />
      </SheetContent>
    </Sheet>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-surface border-r border-stroke fixed left-0 top-0">
      <NavContent />
    </aside>
  );
}
