'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Bell, Mail, MailOpen, ExternalLink, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface NotificationMessage {
  id: string;
  name: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<NotificationMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch on mount and poll every 30s
  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await fetch('/api/contact?limit=5');
        if (res.ok && mounted) {
          const data = await res.json();
          const msgs = Array.isArray(data) ? data : [];
          setMessages(msgs);
          setUnreadCount(msgs.filter((m: NotificationMessage) => !m.read).length);
        }
      } catch {
        // silently fail
      }
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Mark as read when clicking a message
  const handleMessageClick = async (msg: NotificationMessage) => {
    if (!msg.read) {
      try {
        await fetch('/api/contact', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: msg.id, read: true }),
        });
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        // silently fail
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const unread = messages.filter((m) => !m.read);
      await Promise.all(
        unread.map((m) =>
          fetch('/api/contact', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: m.id, read: true }),
          })
        )
      );
      setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
      setUnreadCount(0);
    } catch {
      // silently fail
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-muted-text hover:text-white hover:bg-surface transition-colors duration-200"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="w-5 h-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-[10px] font-bold text-white"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl bg-surface border border-stroke shadow-2xl shadow-black/40 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-stroke">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand" />
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge className="bg-brand text-white text-[10px] px-1.5 py-0 min-w-[20px] flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-brand hover:text-brand/80 font-medium transition-colors px-2 py-1 rounded hover:bg-brand/10"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded text-muted-text hover:text-white hover:bg-dark transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Message List */}
            <div className="max-h-80 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="py-10 text-center">
                  <MailOpen className="w-8 h-8 text-muted-text/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-text">No messages yet</p>
                  <p className="text-xs text-muted-text/60 mt-1">
                    Contact form messages will appear here
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-stroke/50">
                  {messages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => handleMessageClick(msg)}
                      className={cn(
                        'w-full text-left px-4 py-3 transition-colors duration-150 group',
                        !msg.read
                          ? 'bg-brand/[0.04] hover:bg-brand/[0.07]'
                          : 'hover:bg-dark/50'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* Unread dot */}
                        <div className="mt-2 flex-shrink-0">
                          <div
                            className={cn(
                              'w-2 h-2 rounded-full',
                              !msg.read ? 'bg-brand' : 'bg-stroke/50'
                            )}
                          />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={cn(
                                'text-sm truncate',
                                !msg.read
                                  ? 'font-semibold text-white'
                                  : 'font-medium text-muted-text'
                              )}
                            >
                              {msg.name}
                            </p>
                            <span className="text-[10px] text-muted-text/60 flex-shrink-0">
                              {format(new Date(msg.createdAt), 'MMM d')}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-brand/80 truncate mt-0.5">
                            {msg.subject}
                          </p>
                          <p className="text-xs text-muted-text/70 truncate mt-0.5">
                            {msg.message}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-stroke/50 px-4 py-2.5">
              <button
                onClick={() => {
                  setOpen(false);
                  router.push('/dashboard/messages');
                }}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-brand hover:text-brand/80 transition-colors py-1 rounded hover:bg-brand/5"
              >
                View all messages
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
