'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Bell, Mail, MailOpen, ExternalLink, X, ArrowLeft, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface NotificationMessage {
  id: string;
  name: string;
  email: string;
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
  const [selectedMessage, setSelectedMessage] = useState<NotificationMessage | null>(null);
  const dismissedIds = useRef(new Set<string>());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch on mount and poll every 30s
  useEffect(() => {
    let mounted = true;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const fetchNotifications = async (attempt = 0) => {
      try {
        const res = await fetch('/api/contact?limit=5');
        if (res.ok && mounted) {
          const data = await res.json();
          const msgs = (Array.isArray(data) ? data : []).filter(
            (m: NotificationMessage) => !dismissedIds.current.has(m.id)
          );
          setMessages(msgs);
          setUnreadCount(msgs.filter((m: NotificationMessage) => !m.read).length);
          return; // success — stop retrying
        }
        if (res.status === 401 && mounted) {
          // Session not ready yet — retry in 2s (up to 5 times)
          if (attempt < 5) {
            retryTimer = setTimeout(() => fetchNotifications(attempt + 1), 2000);
          }
        }
      } catch {
        // Network error — retry once after 3s
        if (attempt < 2 && mounted) {
          retryTimer = setTimeout(() => fetchNotifications(attempt + 1), 3000);
        }
      }
    };

    fetchNotifications();

    // After initial success, poll every 30s
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        // Reset to list view when closing
        setTimeout(() => setSelectedMessage(null), 200);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Click a message — show it inline in the dropdown
  const handleMessageClick = async (msg: NotificationMessage) => {
    // Dismiss from bell list
    dismissedIds.current.add(msg.id);
    setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    if (!msg.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    // Mark as read in DB
    if (!msg.read) {
      try {
        await fetch('/api/contact', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: msg.id, read: true }),
        });
      } catch {
        // silently fail
      }
    }
    // Show message inline — do NOT navigate
    setSelectedMessage(msg);
  };

  // Go back to notification list
  const handleBackToList = () => {
    setSelectedMessage(null);
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

  // Clear all — remove all notifications from the bell
  const handleClearAll = () => {
    messages.forEach((m) => dismissedIds.current.add(m.id));
    setMessages([]);
    setUnreadCount(0);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setOpen(!open);
          if (open) {
            // When closing, reset to list
            setTimeout(() => setSelectedMessage(null), 200);
          }
        }}
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
            {!selectedMessage ? (
              <>
                {/* Header — List View */}
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
                    {messages.length > 0 && (
                      <>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[11px] text-brand hover:text-brand/80 font-medium transition-colors px-2 py-1 rounded hover:bg-brand/10"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={handleClearAll}
                          className="text-[11px] text-red-400 hover:text-red-300 font-medium transition-colors px-2 py-1 rounded hover:bg-red-400/10"
                        >
                          Clear all
                        </button>
                      </>
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
                      setSelectedMessage(null);
                      router.push('/dashboard/messages');
                    }}
                    className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-brand hover:text-brand/80 transition-colors py-1 rounded hover:bg-brand/5"
                  >
                    View all messages
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Message Detail View */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-stroke">
                  <button
                    onClick={handleBackToList}
                    className="p-1 rounded text-muted-text hover:text-white hover:bg-dark transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Mail className="w-4 h-4 text-brand flex-shrink-0" />
                    <h3 className="text-sm font-semibold text-white truncate">
                      Message
                    </h3>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1 rounded text-muted-text hover:text-white hover:bg-dark transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Message Content */}
                <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                  {/* Subject */}
                  <h4 className="text-base font-semibold text-white">
                    {selectedMessage.subject}
                  </h4>

                  {/* Sender info */}
                  <div className="flex items-center gap-2 text-xs text-muted-text">
                    <span className="font-medium text-white/80">{selectedMessage.name}</span>
                    <span>&middot;</span>
                    <span>{selectedMessage.email}</span>
                    <span>&middot;</span>
                    <span>{format(new Date(selectedMessage.createdAt), 'MMM d, yyyy HH:mm')}</span>
                  </div>

                  <Separator className="bg-stroke" />

                  {/* Full message body */}
                  <div className="max-h-56 overflow-y-auto">
                    <p className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>

                  {/* Action: go to all messages */}
                  <div className="pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setOpen(false);
                        setSelectedMessage(null);
                        router.push('/dashboard/messages');
                      }}
                      className="w-full text-xs text-brand hover:text-brand/80 hover:bg-brand/5"
                    >
                      View all messages
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
