'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, ExternalLink, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  credentialId: string;
  category: string;
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
  credentialId: '',
  category: '',
  displayOrder: 0,
};

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  // Dynamically derive categories from existing certificates
  const existingCategories = useMemo(() => {
    const cats = new Set<string>();
    certificates.forEach((c) => {
      if (c.category && c.category.trim()) cats.add(c.category.trim());
    });
    return Array.from(cats).sort();
  }, [certificates]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (cert: Certificate) => {
    setEditingId(cert.id);
    // Parse JSON skills string into comma-separated text for the form
    const parsedSkills = (() => {
      try {
        const parsed = JSON.parse(cert.skills);
        return Array.isArray(parsed) ? parsed.join(', ') : cert.skills;
      } catch {
        return cert.skills;
      }
    })();
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      skills: parsedSkills,
      certificateImage: cert.certificateImage,
      credentialUrl: cert.credentialUrl,
      credentialId: cert.credentialId || '',
      category: cert.category || '',
      displayOrder: cert.displayOrder,
    });
    setFormOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setForm((p) => ({ ...p, certificateImage: data.url }));
        toast.success('Image uploaded');
      } else {
        toast.error('Failed to upload image');
      }
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const skills = form.skills
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...form,
        skills,
        category: form.category.trim(),
      };

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
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || 'Failed to save certificate');
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
        <div>
          <p className="text-sm text-muted-text">{certificates.length} certificates total</p>
          {existingCategories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {existingCategories.map((cat) => (
                <span key={cat} className="text-[10px] px-2 py-0.5 bg-brand/10 text-brand rounded-full">
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
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
                  <TableHead className="text-muted-text font-medium hidden sm:table-cell">Category</TableHead>
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
                            <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-muted-text hover:text-brand">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-text hidden md:table-cell">{cert.issuer}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {cert.category ? (
                          <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-brand/30 text-brand bg-brand/5">
                            {cert.category}
                          </Badge>
                        ) : (
                          <span className="text-xs text-stroke">—</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {skills.slice(0, 3).map((skill) => (
                            <span key={skill} className="text-[10px] px-1.5 py-0.5 bg-brand/10 text-brand rounded">
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
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-text hover:text-white hover:bg-surface" onClick={() => openEdit(cert)}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-text hover:text-red-500 hover:bg-surface" onClick={() => { setDeleteId(cert.id); setDeleteOpen(true); }}>
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
            {/* Title */}
            <div className="space-y-2">
              <Label className="text-sm text-white">Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                required
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="Python Programming Fundamentals"
              />
            </div>

            {/* Issuer & Issue Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-white">Issuing Organization *</Label>
                <Input
                  value={form.issuer}
                  onChange={(e) => setForm((p) => ({ ...p, issuer: e.target.value }))}
                  required
                  className="bg-dark border-stroke text-white placeholder:text-muted-text"
                  placeholder="Microsoft"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-white">Issue Date *</Label>
                <Input
                  value={form.issueDate}
                  onChange={(e) => setForm((p) => ({ ...p, issueDate: e.target.value }))}
                  required
                  className="bg-dark border-stroke text-white placeholder:text-muted-text"
                  placeholder="2025-05"
                />
              </div>
            </div>

            {/* Category — with datalist for existing + new */}
            <div className="space-y-2">
              <Label className="text-sm text-white">Category</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                list="category-suggestions"
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="e.g. Programming, Cybersecurity, AI..."
              />
              <datalist id="category-suggestions">
                {['Programming', 'Web Development', 'Cybersecurity', 'Databases', 'AI', 'Cloud Computing', 'PHP', 'Python', 'Computer Hardware', ...existingCategories.filter(c => !['Programming', 'Web Development', 'Cybersecurity', 'Databases', 'AI', 'Cloud Computing', 'PHP', 'Python', 'Computer Hardware'].includes(c))].filter((v, i, a) => a.indexOf(v) === i).map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              <p className="text-[11px] text-stroke">Type an existing category or create a new one. Only categories with certificates appear as filters on the public page.</p>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label className="text-sm text-white">Skills / Technologies (comma-separated)</Label>
              <Input
                value={form.skills}
                onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))}
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="Python, Data Structures, Algorithms"
              />
            </div>

            {/* Credential ID & Credential URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-white">Credential ID</Label>
                <Input
                  value={form.credentialId}
                  onChange={(e) => setForm((p) => ({ ...p, credentialId: e.target.value }))}
                  className="bg-dark border-stroke text-white placeholder:text-muted-text"
                  placeholder="ABC-123-XYZ"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-white">Credential URL</Label>
                <Input
                  value={form.credentialUrl}
                  onChange={(e) => setForm((p) => ({ ...p, credentialUrl: e.target.value }))}
                  className="bg-dark border-stroke text-white placeholder:text-muted-text"
                  placeholder="https://credentials.example.com/..."
                />
              </div>
            </div>

            {/* Image upload */}
            <div className="space-y-2">
              <Label className="text-sm text-white">Certificate Image</Label>
              <div className="flex gap-2">
                <Input
                  value={form.certificateImage}
                  onChange={(e) => setForm((p) => ({ ...p, certificateImage: e.target.value }))}
                  className="bg-dark border-stroke text-white placeholder:text-muted-text flex-1"
                  placeholder="/uploads/certificate.jpg"
                />
                <Button type="button" variant="outline" className="border-stroke text-muted-text hover:text-white hover:bg-surface shrink-0" onClick={() => document.getElementById('cert-image-upload')?.click()}>
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                </Button>
                <input
                  id="cert-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {/* Display Order */}
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
