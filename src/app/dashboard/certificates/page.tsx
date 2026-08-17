'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, ExternalLink, Upload, FileText, X } from 'lucide-react';
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

interface PendingFile {
  file: File;
  previewUrl: string;
}

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
  const [pendingFiles, setPendingFiles] = useState<Record<string, PendingFile>>({});
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

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
    setPendingFiles({});
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
    setPendingFiles({});
    setFormOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedImages = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedImages.includes(file.type) && !file.type.startsWith('image/')) { toast.error('Only image files are allowed'); return; }
    const previewUrl = URL.createObjectURL(file);
    setPendingFiles(prev => ({ ...prev, certificateImage: { file, previewUrl } }));
    setForm((p) => ({ ...p, certificateImage: previewUrl }));
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedDocs = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedDocs.includes(file.type)) { toast.error('Only PDF and Word documents are allowed'); return; }
    const previewUrl = URL.createObjectURL(file);
    setPendingFiles(prev => ({ ...prev, credentialUrl: { file, previewUrl } }));
    setForm((p) => ({ ...p, credentialUrl: previewUrl }));
    if (pdfInputRef.current) pdfInputRef.current.value = '';
  };



  const handleRemoveFile = async (url: string, field: 'certificateImage' | 'credentialUrl') => {
    console.log(`[FILE_REMOVE] Button clicked`);
    console.log(`[FILE_REMOVE] Field: ${field}`);
    console.log(`[FILE_REMOVE] Original value: ${url}`);
    
    try {
      if (!url) {
        console.log(`[FILE_REMOVE] Value is null/empty`);
        return;
      }

      if (pendingFiles[field]) {
        console.log(`[FILE_REMOVE] Removing unsaved pending file for ${field}`);
        URL.revokeObjectURL(pendingFiles[field].previewUrl);
        setPendingFiles(prev => {
          const updated = { ...prev };
          delete updated[field];
          return updated;
        });
        const originalCert = editingId ? certificates.find(c => c.id === editingId) : null;
        setForm((p) => ({ ...p, [field]: originalCert ? originalCert[field] : '' }));
        return;
      }

      const filePath = extractStoragePath(url);
      console.log(`[STORAGE_PATH] Result returned by utility: ${filePath}`);
      if (!filePath) {
        toast.error('Could not determine file path');
        return;
      }
      
      console.log(`[DELETE_API] Sending filePath: ${filePath}`);
      const res = await fetch('/api/upload/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath }),
      });
      const data = await res.json();
      console.log(`[DELETE_API] Response status: ${res.status}`);
      console.log(`[DELETE_API] Supabase delete result:`, data);
      
      if (!res.ok) throw new Error(data.error || 'Failed to delete file');
      
      setForm((p) => ({ ...p, [field]: '' }));
      console.log(`[FILE_REMOVE] Frontend state updated`);
      console.log(`[FILE_REMOVE] Save Changes is required to persist this deletion in the database`);
      toast.success('File deleted successfully');
    } catch (error: any) {
      console.error('[FILE_REMOVE] Error:', error);
      toast.error(error.message || 'Failed to delete file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalCertificateImage = form.certificateImage;
      let finalCredentialUrl = form.credentialUrl;

      if (pendingFiles.certificateImage) {
        const formData = new FormData();
        formData.append('file', pendingFiles.certificateImage.file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          finalCertificateImage = data.url;
        } else {
           throw new Error('Failed to upload image');
        }
      }
      
      if (pendingFiles.credentialUrl) {
        const formData = new FormData();
        formData.append('file', pendingFiles.credentialUrl.file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          finalCredentialUrl = data.url;
        } else {
           throw new Error('Failed to upload PDF');
        }
      }

      const skills = form.skills
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...form,
        certificateImage: finalCertificateImage,
        credentialUrl: finalCredentialUrl,
        skills,
        category: form.category.trim(),
      };

      // Save the certificate data
      const res = await fetch('/api/certificates', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload),
      });

      // Auto-reorder when editing (shift others to fill gap)
      if (editingId && res.ok) {
        const otherItems = certificates.filter((c) => c.id !== editingId);
        const sortedOthers = [...otherItems].sort((a, b) => a.displayOrder - b.displayOrder);
        const newPos = Math.max(1, Math.min(form.displayOrder, certificates.length));
        const reordered = [
          ...sortedOthers.slice(0, newPos - 1),
          { id: editingId, displayOrder: newPos },
          ...sortedOthers.slice(newPos - 1),
        ].map((item, idx) => ({ id: item.id, displayOrder: idx + 1 }));
        await fetch('/api/certificates', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reorder: reordered }),
        });
      }

      if (res.ok) {
        if (editingId) {
          const originalCert = certificates.find(c => c.id === editingId);
          if (originalCert) {
            const fileFields: ('certificateImage' | 'credentialUrl')[] = ['certificateImage', 'credentialUrl'];
            for (const field of fileFields) {
              if (pendingFiles[field] && originalCert[field]) {
                const filePath = extractStoragePath(originalCert[field]);
                if (filePath) {
                  fetch('/api/upload/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ filePath }),
                  }).catch(console.error);
                }
              }
            }
          }
        }

        toast.success(editingId ? 'Certificate updated' : 'Certificate created');
        setFormOpen(false);
        fetchCertificates();
      } else {
        const errData = await res.json().catch(()=>({}));
        throw new Error(errData.error || 'Failed to save certificate');
      }
    } catch (err: any) {
      console.error('Save error:', err);
      toast.error(err.message || 'Failed to save certificate');
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
        // Re-sequence remaining items from 1
        const remaining = certificates
          .filter((c) => c.id !== deleteId)
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((item, idx) => ({ id: item.id, displayOrder: idx + 1 }));
        if (remaining.length > 0) {
          await fetch('/api/certificates', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reorder: remaining }),
          });
        }
        fetchCertificates();
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
                <div className="flex items-center gap-2">
                  {form.credentialUrl && form.credentialUrl.endsWith('.pdf') && (
                    <div className="flex items-center gap-1.5 px-2 py-1.5 bg-red-500/10 border border-red-500/20 rounded-md shrink-0">
                      <FileText className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-[10px] text-red-300 max-w-[80px] truncate">{form.credentialUrl.split('/').pop()}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(form.credentialUrl, 'credentialUrl')}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <Input
                    value={form.credentialUrl}
                    onChange={(e) => setForm((p) => ({ ...p, credentialUrl: e.target.value }))}
                    className="bg-dark border-stroke text-white placeholder:text-muted-text flex-1"
                    placeholder="https://credentials.example.com/..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="border-stroke text-muted-text hover:text-white hover:bg-surface shrink-0"
                    onClick={() => pdfInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.doc,.docx"
                  className="hidden"
                  onChange={handlePdfUpload}
                />
                <p className="text-[11px] text-stroke">Paste a URL or click the upload button to upload a PDF file.</p>
              </div>
            </div>

            {/* Image upload */}
            <div className="space-y-2">
              <Label className="text-sm text-white">Certificate Image</Label>
              <div className="flex items-start gap-3">
                {form.certificateImage ? (
                  <div className="relative w-16 h-12 rounded-md overflow-hidden border border-stroke flex-shrink-0">
                    <img src={form.certificateImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(form.certificateImage, 'certificateImage')}
                      className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors"
                    >
                      <X className="w-2.5 h-2.5 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-12 rounded-md border border-dashed border-stroke flex items-center justify-center flex-shrink-0">
                    <span className="text-[9px] text-muted-text">No img</span>
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => imageInputRef.current?.click()}
                      className="border-stroke text-white hover:bg-surface gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload Image
                    </Button>
                  </div>
                  <Input
                    value={form.certificateImage}
                    onChange={(e) => setForm((p) => ({ ...p, certificateImage: e.target.value }))}
                    className="bg-dark border-stroke text-white placeholder:text-muted-text text-xs"
                    placeholder="or paste image URL..."
                  />
                </div>
              </div>
            </div>

            {/* Display Order */}
            <div className="space-y-2">
              <Label className="text-sm text-white">Display Order</Label>
              <Input
                type="number"
                min={0}
                value={form.displayOrder || ''}
                onChange={(e) => setForm((p) => ({ ...p, displayOrder: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="0"
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
