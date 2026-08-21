'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Trash2, Mail, MailOpen, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/contact');
      if (res.ok) setMessages(await res.json());
    } catch {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const unreadCount = messages.filter((m) => !m.read).length;

  const viewMessage = async (msg: ContactMessage) => {
    setViewingMessage(msg);
    setViewOpen(true);

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
      } catch {
        // Silently fail
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/contact?id=${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Message deleted');
        setMessages((prev) => prev.filter((m) => m.id !== deleteId));
      } else {
        toast.error('Failed to delete');
      }
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Unread count banner */}
      {unreadCount > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-brand/10 border border-brand/20">
          <Mail className="w-5 h-5 text-brand flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <Badge className="bg-brand text-white text-xs">{unreadCount}</Badge>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-text">{messages.length} message{messages.length !== 1 ? 's' : ''} total</p>
      </div>

      <Card className="bg-surface border-stroke overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full bg-dark" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center">
            <MailOpen className="w-12 h-12 text-muted-text mx-auto mb-3" />
            <p className="text-muted-text">No messages yet.</p>
            <p className="text-sm text-muted-text mt-1">Messages from the contact form will appear here.</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[calc(100vh-18rem)]">
            <Table>
              <TableHeader>
                <TableRow className="border-stroke hover:bg-transparent">
                  <TableHead className="w-12 text-muted-text font-medium">Status</TableHead>
                  <TableHead className="text-muted-text font-medium">From</TableHead>
                  <TableHead className="text-muted-text font-medium hidden sm:table-cell">Subject</TableHead>
                  <TableHead className="text-muted-text font-medium hidden md:table-cell">Preview</TableHead>
                  <TableHead className="text-muted-text font-medium hidden lg:table-cell">Date</TableHead>
                  <TableHead className="w-16 text-muted-text font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((msg) => (
                  <TableRow
                    key={msg.id}
                    onClick={() => viewMessage(msg)}
                    className={`border-stroke hover:bg-dark/60 transition-colors cursor-pointer ${!msg.read ? 'bg-brand/[0.04]' : ''}`}
                  >
                    <TableCell>
                      <div
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${!msg.read ? 'bg-brand shadow-sm shadow-brand/40' : 'bg-stroke'}`}
                        title={msg.read ? 'Read' : 'Unread'}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="min-w-0">
                        <p className={`text-sm truncate ${!msg.read ? 'font-semibold text-white' : 'text-white/80'}`}>
                          {msg.name}
                        </p>
                        <p className="text-xs text-muted-text truncate">{msg.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-white hidden sm:table-cell truncate max-w-[200px]">
                      {msg.subject}
                    </TableCell>
                    <TableCell className="text-sm text-muted-text hidden md:table-cell truncate max-w-[250px]">
                      {msg.message}
                    </TableCell>
                    <TableCell className="text-sm text-muted-text hidden lg:table-cell whitespace-nowrap">
                      {format(new Date(msg.createdAt), 'MMM d, yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-text hover:text-white hover:bg-dark/80 focus-visible:ring-1 focus-visible:ring-brand data-[state=open]:bg-dark data-[state=open]:text-white transition-colors"
                            aria-label="Message options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-36 bg-surface border-stroke text-white shadow-2xl shadow-black/60 rounded-xl p-1"
                        >
                          <DropdownMenuItem
                            onClick={() => {
                              setDeleteId(msg.id);
                              setDeleteOpen(true);
                            }}
                            className="cursor-pointer text-xs flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300 rounded-lg px-2.5 py-2 font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </Card>

      {/* View Message Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="bg-surface border-stroke sm:max-w-xl md:max-w-2xl w-[calc(100%-2rem)] max-h-[85vh] flex flex-col p-0 overflow-hidden gap-0 rounded-2xl shadow-2xl shadow-black/70">
          {viewingMessage && (
            <>
              {/* Header & Metadata (pinned) */}
              <div className="p-6 pb-4 pr-12 border-b border-stroke flex flex-col gap-3 bg-surface/95 backdrop-blur-xs shrink-0">
                <DialogHeader className="text-left space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">
                      Subject
                    </span>
                  </div>
                  <DialogTitle className="text-base sm:text-lg font-bold text-white leading-snug break-words [overflow-wrap:anywhere]">
                    {viewingMessage.subject}
                  </DialogTitle>
                  <DialogDescription asChild>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-xs text-muted-text pt-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-semibold text-white/90">From:</span>
                        <span className="text-white/80 font-medium truncate">{viewingMessage.name}</span>
                        <span className="text-muted-text truncate">({viewingMessage.email})</span>
                      </div>
                      <span className="hidden sm:inline text-stroke">&bull;</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-semibold text-white/90">Date:</span>
                        <span>
                          {format(new Date(viewingMessage.createdAt), "MMM d, yyyy 'at' HH:mm")}
                        </span>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* Message Content (scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[calc(85vh-140px)]">
                <p className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed break-words [overflow-wrap:anywhere] select-text">
                  {viewingMessage.message}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-surface border-stroke">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Message</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-text">
              This action cannot be undone. The message will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-stroke text-white hover:bg-surface">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
