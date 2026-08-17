'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2, Loader2, ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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

interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  technologies: string;
  startDate: string;
  endDate: string;
  location: string;
  projectImage: string;
  githubUrl: string;
  liveDemoUrl: string;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
}

const emptyForm = {
  title: '',
  slug: '',
  description: '',
  technologies: '',
  startDate: '',
  endDate: '',
  location: 'Oulad Teima, Morocco',
  projectImage: '',
  githubUrl: '',
  liveDemoUrl: '',
  featured: false,
  displayOrder: 0,
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) setProjects(await res.json());
    } catch {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugify(title),
    }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingId(project.id);
    // Merge short + full description into single field, prefer fullDescription
    const description = project.fullDescription || project.shortDescription || '';
    setForm({
      title: project.title,
      slug: project.slug,
      description,
      technologies: (() => {
        try {
          const parsed = JSON.parse(project.technologies);
          return Array.isArray(parsed) ? parsed.join(', ') : project.technologies;
        } catch {
          return project.technologies;
        }
      })(),
      startDate: project.startDate,
      endDate: project.endDate,
      location: project.location,
      projectImage: project.projectImage,
      githubUrl: project.githubUrl,
      liveDemoUrl: project.liveDemoUrl,
      featured: project.featured,
      displayOrder: project.displayOrder,
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
        setForm((prev) => ({ ...prev, projectImage: data.url }));
        toast.success('Image uploaded');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Upload failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      // Reset file input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const technologies = form.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...form,
        technologies,
        // Store description in both fields for backward compatibility
        shortDescription: form.description,
        fullDescription: form.description,
      };

      const res = await fetch('/api/projects', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload),
      });

      if (res.ok) {
        toast.success(editingId ? 'Project updated' : 'Project created');
        setFormOpen(false);
        fetchProjects();
      } else {
        toast.error('Failed to save project');
      }
    } catch {
      toast.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/projects?id=${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Project deleted');
        setProjects((prev) => prev.filter((p) => p.id !== deleteId));
      } else {
        toast.error('Failed to delete project');
      }
    } catch {
      toast.error('Failed to delete project');
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-text">{projects.length} projects total</p>
        </div>
        <Button onClick={openCreate} className="bg-brand hover:bg-brand-light text-white gap-2">
          <Plus className="w-4 h-4" /> Add Project
        </Button>
      </div>

      {/* Table */}
      <Card className="bg-surface border-stroke overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 w-full bg-dark" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-text">No projects yet. Click &quot;Add Project&quot; to create one.</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[calc(100vh-16rem)]">
            <Table>
              <TableHeader>
                <TableRow className="border-stroke hover:bg-transparent">
                  <TableHead className="text-muted-text font-medium">Title</TableHead>
                  <TableHead className="text-muted-text font-medium hidden md:table-cell">Slug</TableHead>
                  <TableHead className="text-muted-text font-medium hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-muted-text font-medium">Featured</TableHead>
                  <TableHead className="text-muted-text font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id} className="border-stroke hover:bg-dark/50">
                    <TableCell className="font-medium text-white">{project.title}</TableCell>
                    <TableCell className="text-muted-text hidden md:table-cell font-mono text-xs">{project.slug}</TableCell>
                    <TableCell className="text-muted-text hidden sm:table-cell text-sm">
                      {format(new Date(project.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {project.featured && (
                        <Badge className="bg-brand/10 text-brand text-[10px] border-0">Featured</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-text hover:text-white hover:bg-surface"
                          onClick={() => openEdit(project)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-text hover:text-red-500 hover:bg-surface"
                          onClick={() => { setDeleteId(project.id); setDeleteOpen(true); }}
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

      {/* Create / Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-surface border-stroke max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">{editingId ? 'Edit Project' : 'Add Project'}</DialogTitle>
            <DialogDescription className="text-muted-text">
              {editingId ? 'Update project details below.' : 'Fill in the details to create a new project.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-white">Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  className="bg-dark border-stroke text-white placeholder:text-muted-text"
                  placeholder="My Project"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-white">Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  required
                  className="bg-dark border-stroke text-white placeholder:text-muted-text font-mono text-sm"
                  placeholder="my-project"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-white">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="bg-dark border-stroke text-white placeholder:text-muted-text min-h-[100px]"
                placeholder="Project description..."
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-sm text-white">Project Image</Label>
              <div className="flex items-start gap-3">
                {form.projectImage ? (
                  <div className="relative w-24 h-16 rounded-md overflow-hidden border border-stroke flex-shrink-0">
                    <img
                      src={form.projectImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, projectImage: '' }))}
                      className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-16 rounded-md border border-dashed border-stroke flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] text-muted-text">No image</span>
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="border-stroke text-white hover:bg-surface gap-1.5"
                    >
                      {uploading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ImagePlus className="w-3.5 h-3.5" />
                      )}
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                  </div>
                  <Input
                    value={form.projectImage}
                    onChange={(e) => setForm((p) => ({ ...p, projectImage: e.target.value }))}
                    className="bg-dark border-stroke text-white placeholder:text-muted-text text-xs"
                    placeholder="or paste image URL..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-white">Technologies (comma-separated)</Label>
              <Input
                value={form.technologies}
                onChange={(e) => setForm((p) => ({ ...p, technologies: e.target.value }))}
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="React, Next.js, TypeScript"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-white">Start Date</Label>
                <Input
                  value={form.startDate}
                  onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                  required
                  className="bg-dark border-stroke text-white placeholder:text-muted-text"
                  placeholder="2024-01"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-white">End Date</Label>
                <Input
                  value={form.endDate}
                  onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                  className="bg-dark border-stroke text-white placeholder:text-muted-text"
                  placeholder="Present"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-white">Location</Label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  className="bg-dark border-stroke text-white placeholder:text-muted-text"
                  placeholder="Oulad Teima, Morocco"
                />
              </div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-white">GitHub URL</Label>
                <Input
                  value={form.githubUrl}
                  onChange={(e) => setForm((p) => ({ ...p, githubUrl: e.target.value }))}
                  className="bg-dark border-stroke text-white placeholder:text-muted-text"
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-white">Live Demo URL</Label>
                <Input
                  value={form.liveDemoUrl}
                  onChange={(e) => setForm((p) => ({ ...p, liveDemoUrl: e.target.value }))}
                  className="bg-dark border-stroke text-white placeholder:text-muted-text"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={form.featured}
                onCheckedChange={(v) => setForm((p) => ({ ...p, featured: v }))}
              />
              <Label className="text-sm text-white">Featured Project</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)} className="border-stroke text-white hover:bg-surface">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-brand hover:bg-brand-light text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
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
            <AlertDialogTitle className="text-white">Delete Project</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-text">
              This action cannot be undone. The project will be permanently deleted.
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
