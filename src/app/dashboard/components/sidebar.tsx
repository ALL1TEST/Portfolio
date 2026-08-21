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
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
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

function NavContent({
  collapsed = false,
  onToggleCollapse,
  onNavigate,
}: {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
}) {
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

    const handleLogoUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ logoUrl?: string }>;
      if (customEvent.detail?.logoUrl) {
        setProfile((prev) => ({ ...prev, logoUrl: customEvent.detail?.logoUrl }));
      } else {
        fetchProfile();
      }
    };

    window.addEventListener('logo-updated', handleLogoUpdate);
    return () => {
      window.removeEventListener('logo-updated', handleLogoUpdate);
    };
  }, [pathname]);

  const handleNav = useCallback(
    (href: string) => {
      router.push(href);
      onNavigate?.();
    },
    [router, onNavigate]
  );

  return (
    <div className="flex flex-col h-full select-none">
      {/* Brand Header */}
      <div
        className={cn(
          'flex items-center py-5 transition-all duration-300',
          collapsed ? 'px-2 justify-center flex-col gap-3' : 'px-4 justify-between'
        )}
      >
        <div
          onClick={() => handleNav('/dashboard')}
          className={cn(
            'flex items-center gap-2.5 min-w-0 cursor-pointer group',
            collapsed ? 'justify-center' : ''
          )}
          title={profile?.brandName ?? 'CodeVirtox'}
        >
          {(profile ? profile.logoUrl : '/logo.png') && (
            <img
              src={profile ? profile.logoUrl : '/logo.png'}
              alt="Logo"
              className={cn(
                'object-contain transition-all duration-300 flex-shrink-0',
                collapsed ? 'h-9 w-9' : 'h-10 w-auto'
              )}
            />
          )}
          {!collapsed && (
            <span className="text-xl font-medium tracking-tight text-white/90 truncate group-hover:text-white transition-colors">
              {profile?.brandName ?? 'CodeVirtox'}
            </span>
          )}
        </div>

        {/* Toggle Button in Header (Desktop) */}
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className={cn(
              'h-8 w-8 text-muted-text hover:text-white hover:bg-dark/80 transition-colors',
              collapsed ? 'hidden' : 'flex'
            )}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Divider */}
      <div className={cn('h-px bg-stroke transition-all duration-300', collapsed ? 'mx-2' : 'mx-3')} />

      {/* Navigation */}
      <ScrollArea className={cn('flex-1 py-4', collapsed ? 'px-1.5' : 'px-3')}>
        <nav className="space-y-1.5">
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
                title={collapsed ? item.label : undefined}
                className={cn(
                  'flex items-center rounded-xl text-sm font-medium transition-all duration-200 relative group cursor-pointer w-full',
                  collapsed
                    ? 'justify-center p-3 h-11'
                    : 'gap-3 px-3.5 py-2.5 text-left',
                  isActive
                    ? 'bg-brand/15 text-brand shadow-xs shadow-brand/10'
                    : 'text-muted-text hover:text-white hover:bg-dark/60'
                )}
              >
                {isActive && (
                  <div
                    className={cn(
                      'absolute bg-brand rounded-r transition-all duration-200',
                      collapsed ? 'left-0 top-2 bottom-2 w-1' : 'left-0 top-1/2 -translate-y-1/2 w-1 h-5'
                    )}
                  />
                )}
                <Icon
                  className={cn(
                    'flex-shrink-0 transition-transform duration-200 group-hover:scale-110',
                    collapsed ? 'w-5 h-5' : 'w-4.5 h-4.5',
                    isActive ? 'text-brand' : 'text-muted-text group-hover:text-white'
                  )}
                />
                {!collapsed && (
                  <span className="truncate font-medium">{item.label}</span>
                )}
                {item.showBadge && unreadCount > 0 && (
                  collapsed ? (
                    <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-brand text-[9px] font-bold text-white flex items-center justify-center shadow-xs">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  ) : (
                    <Badge className="ml-auto bg-brand text-white text-[10px] px-1.5 py-0.5 min-w-[20px] flex items-center justify-center">
                      {unreadCount}
                    </Badge>
                  )
                )}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer / Toggle Section */}
      <div
        className={cn(
          'border-t border-stroke transition-all duration-300',
          collapsed ? 'p-2 flex flex-col items-center gap-2' : 'px-4 py-3.5 flex items-center justify-between'
        )}
      >
        {!collapsed ? (
          <p className="text-[11px] text-muted-text/80 truncate">
            &copy; {new Date().getFullYear()} CodeVirtox
          </p>
        ) : null}

        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8 text-muted-text hover:text-white hover:bg-dark/80 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-brand" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </Button>
        )}
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

export function DesktopSidebar({
  collapsed = false,
  onToggleCollapse,
}: {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-screen bg-surface border-r border-stroke fixed left-0 top-0 z-30 transition-all duration-300 ease-in-out overflow-hidden',
        collapsed ? 'w-[70px]' : 'w-64'
      )}
    >
      <NavContent collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
    </aside>
  );
}

