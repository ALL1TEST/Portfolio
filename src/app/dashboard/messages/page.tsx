'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Eye, Check, Trash2, Loader2, Mail, MailOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
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

  const markAsRead = async (msg: ContactMessage) => {
    try {
      await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg.id, read: true }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
      );
      toast.success('Marked as read');
    } catch {
      toast.error('Failed to update');
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
                  <TableHead className="text-muted-text font-medium">Status</TableHead>
                  <TableHead className="text-muted-text font-medium">From</TableHead>
                  <TableHead className="text-muted-text font-medium hidden sm:table-cell">Subject</TableHead>
                  <TableHead className="text-muted-text font-medium hidden md:table-cell">Preview</TableHead>
                  <TableHead className="text-muted-text font-medium hidden lg:table-cell">Date</TableHead>
                  <TableHead className="text-muted-text font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((msg) => (
                  <TableRow
                    key={msg.id}
                    className={`border-stroke hover:bg-dark/50 ${!msg.read ? 'bg-brand/[0.03]' : ''}`}
                  >
                    <TableCell>
                      <div className={`w-2 h-2 rounded-full ${!msg.read ? 'bg-brand' : 'bg-stroke'}`} />
                    </TableCell>
                    <TableCell>
                      <div className="min-w-0">
                        <p className={`text-sm truncate ${!msg.read ? 'font-semibold text-white' : 'text-white'}`}>
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
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-text hover:text-white hover:bg-surface"
                          onClick={() => viewMessage(msg)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        {!msg.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-text hover:text-brand hover:bg-surface"
                            onClick={() => markAsRead(msg)}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-text hover:text-red-500 hover:bg-surface"
                          onClick={() => { setDeleteId(msg.id); setDeleteOpen(true); }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
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
        <DialogContent className="bg-surface border-stroke max-w-lg">
          {viewingMessage && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white">{viewingMessage.subject}</DialogTitle>
                <DialogDescription className="text-muted-text">
                  from {viewingMessage.name} ({viewingMessage.email}) &middot;{' '}
                  {format(new Date(viewingMessage.createdAt), 'MMMM d, yyyy \'at\' HH:mm')}
                </DialogDescription>
              </DialogHeader>
              <Separator className="bg-stroke" />
              <div className="max-h-96 overflow-y-auto">
                <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">
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
