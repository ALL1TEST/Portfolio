'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  skills: string;
  certificateImage: string;
  credentialUrl: string;
  displayOrder: number;
  createdAt: string;
}

const emptyForm = {
  title: '',
  issuer: '',
  issueDate: '',
  skills: '',
  certificateImage: '',
  credentialUrl: '',
  displayOrder: 0,
};

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchCertificates = useCallback(async () => {
    try {
      const res = await fetch('/api/certificates');
      if (res.ok) setCertificates(await res.json());
    } catch {
      toast.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (cert: Certificate) => {
    setEditingId(cert.id);
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      skills: cert.skills,
      certificateImage: cert.certificateImage,
      credentialUrl: cert.credentialUrl,
      displayOrder: cert.displayOrder,
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const skills = form.skills
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = { ...form, skills };

      const res = await fetch('/api/certificates', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload),
      });

      if (res.ok) {
        toast.success(editingId ? 'Certificate updated' : 'Certificate created');
        setFormOpen(false);
        fetchCertificates();
      } else {
        toast.error('Failed to save certificate');
      }
    } catch {
      toast.error('Failed to save certificate');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/certificates?id=${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Certificate deleted');
        setCertificates((prev) => prev.filter((c) => c.id !== deleteId));
      } else {
        toast.error('Failed to delete certificate');
      }
    } catch {
      toast.error('Failed to delete certificate');
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
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-text">{certificates.length} certificates total</p>
        <Button onClick={openCreate} className="bg-brand hover:bg-brand-light text-white gap-2">
          <Plus className="w-4 h-4" /> Add Certificate
        </Button>
      </div>

      <Card className="bg-surface border-stroke overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full bg-dark" />
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-text">No certificates yet. Click &quot;Add Certificate&quot; to create one.</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[calc(100vh-16rem)]">
            <Table>
              <TableHeader>
                <TableRow className="border-stroke hover:bg-transparent">
                  <TableHead className="text-muted-text font-medium">Title</TableHead>
                  <TableHead className="text-muted-text font-medium hidden md:table-cell">Issuer</TableHead>
                  <TableHead className="text-muted-text font-medium hidden sm:table-cell">Issue Date</TableHead>
                  <TableHead className="text-muted-text font-medium hidden lg:table-cell">Skills</TableHead>
                  <TableHead className="text-muted-text font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((cert) => {
                  const skills: string[] = [];
                  try { skills.push(...JSON.parse(cert.skills)); } catch { /* ignore */ }
                  return (
                    <TableRow key={cert.id} className="border-stroke hover:bg-dark/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{cert.title}</span>
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-text hover:text-brand"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-text hidden md:table-cell">{cert.issuer}</TableCell>
                      <TableCell className="text-muted-text hidden sm:table-cell text-sm">
                        {cert.issueDate}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="text-[10px] px-1.5 py-0.5 bg-brand/10 text-brand rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {skills.length > 3 && (
                            <span className="text-[10px] text-muted-text">+{skills.length - 3}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-text hover:text-white hover:bg-surface"
                            onClick={() => openEdit(cert)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-text hover:text-red-500 hover:bg-surface"
                            onClick={() => { setDeleteId(cert.id); setDeleteOpen(true); }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </Card>

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-surface border-stroke max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">{editingId ? 'Edit Certificate' : 'Add Certificate'}</DialogTitle>
            <DialogDescription className="text-muted-text">
              {editingId ? 'Update certificate details.' : 'Add a new certificate.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-white">Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                required
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="AWS Cloud Practitioner"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-white">Issuer</Label>
                <Input
                  value={form.issuer}
                  onChange={(e) => setForm((p) => ({ ...p, issuer: e.target.value }))}
                  required
                  className="bg-dark border-stroke text-white placeholder:text-muted-text"
                  placeholder="Amazon Web Services"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-white">Issue Date</Label>
                <Input
                  value={form.issueDate}
                  onChange={(e) => setForm((p) => ({ ...p, issueDate: e.target.value }))}
                  required
                  className="bg-dark border-stroke text-white placeholder:text-muted-text"
                  placeholder="2024-01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-white">Skills (comma-separated)</Label>
              <Input
                value={form.skills}
                onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))}
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="Cloud, DevOps, Networking"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-white">Certificate Image URL</Label>
                <Input
                  value={form.certificateImage}
                  onChange={(e) => setForm((p) => ({ ...p, certificateImage: e.target.value }))}
                  className="bg-dark border-stroke text-white placeholder:text-muted-text"
                  placeholder="/images/cert.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-white">Credential URL</Label>
                <Input
                  value={form.credentialUrl}
                  onChange={(e) => setForm((p) => ({ ...p, credentialUrl: e.target.value }))}
                  className="bg-dark border-stroke text-white placeholder:text-muted-text"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-white">Display Order</Label>
              <Input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm((p) => ({ ...p, displayOrder: parseInt(e.target.value) || 0 }))}
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)} className="border-stroke text-white hover:bg-surface">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-brand hover:bg-brand-light text-white">
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editingId ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-surface border-stroke">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Certificate</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-text">
              This action cannot be undone. The certificate will be permanently deleted.
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
