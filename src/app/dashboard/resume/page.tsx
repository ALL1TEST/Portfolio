'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, GraduationCap, Briefcase, Languages, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

// ----- Types -----
interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  year: string;
  displayOrder: number;
}

interface Experience {
  id: string;
  title: string;
  description: string;
  technologies: string;
  startDate: string;
  endDate: string;
  location: string;
  displayOrder: number;
}

interface Language {
  id: string;
  name: string;
  level: string;
  displayOrder: number;
}

interface SoftSkill {
  id: string;
  name: string;
  icon: string;
  displayOrder: number;
}

// ----- Education Tab -----
const emptyEducation = { degree: '', field: '', institution: '', location: '', year: '', displayOrder: 0 };

function EducationTab() {
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyEducation);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/education');
      if (res.ok) setItems(await res.json());
    } catch { /* ignore */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => { setEditingId(null); setForm(emptyEducation); setFormOpen(true); };
  const openEdit = (item: Education) => {
    setEditingId(item.id);
    setForm({ degree: item.degree, field: item.field, institution: item.institution, location: item.location, year: item.year, displayOrder: item.displayOrder });
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await fetch('/api/education', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
      });
      if (res.ok) { toast.success(editingId ? 'Updated' : 'Created'); setFormOpen(false); fetchItems(); }
      else toast.error('Failed to save');
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/education?id=${deleteId}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Deleted'); setItems((p) => p.filter((i) => i.id !== deleteId)); }
      else toast.error('Failed');
    } catch { toast.error('Failed'); } finally { setDeleteOpen(false); setDeleteId(null); }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button onClick={openCreate} size="sm" className="bg-brand hover:bg-brand-light text-white gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Education
        </Button>
      </div>
      <Card className="bg-surface border-stroke overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[1, 2].map((i) => <Skeleton key={i} className="h-12 w-full bg-dark" />)}</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center"><p className="text-sm text-muted-text">No education entries yet.</p></div>
        ) : (
          <ScrollArea className="max-h-96">
            <Table>
              <TableHeader>
                <TableRow className="border-stroke hover:bg-transparent">
                  <TableHead className="text-muted-text font-medium">Degree</TableHead>
                  <TableHead className="text-muted-text font-medium hidden md:table-cell">Field</TableHead>
                  <TableHead className="text-muted-text font-medium hidden sm:table-cell">Institution</TableHead>
                  <TableHead className="text-muted-text font-medium hidden lg:table-cell">Year</TableHead>
                  <TableHead className="text-muted-text font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="border-stroke hover:bg-dark/50">
                    <TableCell className="font-medium text-white">{item.degree}</TableCell>
                    <TableCell className="text-muted-text hidden md:table-cell">{item.field}</TableCell>
                    <TableCell className="text-muted-text hidden sm:table-cell">{item.institution}</TableCell>
                    <TableCell className="text-muted-text hidden lg:table-cell">{item.year}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-text hover:text-white hover:bg-surface" onClick={() => openEdit(item)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-text hover:text-red-500 hover:bg-surface" onClick={() => { setDeleteId(item.id); setDeleteOpen(true); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-surface border-stroke max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">{editingId ? 'Edit Education' : 'Add Education'}</DialogTitle>
            <DialogDescription className="text-muted-text">Fill in the education details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-sm text-white">Degree</Label><Input value={form.degree} onChange={(e) => setForm((p) => ({ ...p, degree: e.target.value }))} required className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="Bachelor's Degree" /></div>
              <div className="space-y-2"><Label className="text-sm text-white">Field</Label><Input value={form.field} onChange={(e) => setForm((p) => ({ ...p, field: e.target.value }))} required className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="Computer Science" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-sm text-white">Institution</Label><Input value={form.institution} onChange={(e) => setForm((p) => ({ ...p, institution: e.target.value }))} required className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="University of ..." /></div>
              <div className="space-y-2"><Label className="text-sm text-white">Year</Label><Input value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} required className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="2020 - 2024" /></div>
            </div>
            <div className="space-y-2"><Label className="text-sm text-white">Location</Label><Input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="City, Country" /></div>
            <div className="space-y-2"><Label className="text-sm text-white">Display Order</Label><Input type="number" value={form.displayOrder} onChange={(e) => setForm((p) => ({ ...p, displayOrder: parseInt(e.target.value) || 0 }))} className="bg-dark border-stroke text-white placeholder:text-muted-text" /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)} className="border-stroke text-white hover:bg-surface">Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-brand hover:bg-brand-light text-white">{saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}{editingId ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-surface border-stroke">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Entry</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-text">This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-stroke text-white hover:bg-surface">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ----- Experience Tab -----
const emptyExperience = { title: '', description: '', technologies: '', startDate: '', endDate: '', location: 'Oulad Teima, Morocco', displayOrder: 0 };

function ExperienceTab() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyExperience);

  const fetchItems = useCallback(async () => {
    try { const res = await fetch('/api/experience'); if (res.ok) setItems(await res.json()); } catch { /* ignore */ } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => { setEditingId(null); setForm(emptyExperience); setFormOpen(true); };
  const openEdit = (item: Experience) => {
    setEditingId(item.id);
    setForm({ title: item.title, description: item.description, technologies: item.technologies, startDate: item.startDate, endDate: item.endDate, location: item.location, displayOrder: item.displayOrder });
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const techs = form.technologies.split(',').map((t) => t.trim()).filter(Boolean);
      const payload = { ...form, technologies: techs };
      const res = await fetch('/api/experience', { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload) });
      if (res.ok) { toast.success(editingId ? 'Updated' : 'Created'); setFormOpen(false); fetchItems(); } else toast.error('Failed');
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { const res = await fetch(`/api/experience?id=${deleteId}`, { method: 'DELETE' }); if (res.ok) { toast.success('Deleted'); setItems((p) => p.filter((i) => i.id !== deleteId)); } else toast.error('Failed'); } catch { toast.error('Failed'); } finally { setDeleteOpen(false); setDeleteId(null); }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button onClick={openCreate} size="sm" className="bg-brand hover:bg-brand-light text-white gap-1.5"><Plus className="w-3.5 h-3.5" /> Add Experience</Button>
      </div>
      <Card className="bg-surface border-stroke overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[1, 2].map((i) => <Skeleton key={i} className="h-12 w-full bg-dark" />)}</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center"><p className="text-sm text-muted-text">No experience entries yet.</p></div>
        ) : (
          <ScrollArea className="max-h-96">
            <Table>
              <TableHeader>
                <TableRow className="border-stroke hover:bg-transparent">
                  <TableHead className="text-muted-text font-medium">Title</TableHead>
                  <TableHead className="text-muted-text font-medium hidden md:table-cell">Period</TableHead>
                  <TableHead className="text-muted-text font-medium hidden lg:table-cell">Location</TableHead>
                  <TableHead className="text-muted-text font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="border-stroke hover:bg-dark/50">
                    <TableCell className="font-medium text-white">{item.title}</TableCell>
                    <TableCell className="text-muted-text hidden md:table-cell text-sm">{item.startDate} — {item.endDate || 'Present'}</TableCell>
                    <TableCell className="text-muted-text hidden lg:table-cell text-sm">{item.location}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-text hover:text-white hover:bg-surface" onClick={() => openEdit(item)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-text hover:text-red-500 hover:bg-surface" onClick={() => { setDeleteId(item.id); setDeleteOpen(true); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-surface border-stroke max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">{editingId ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
            <DialogDescription className="text-muted-text">Fill in the experience details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label className="text-sm text-white">Title</Label><Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="Full Stack Developer" /></div>
            <div className="space-y-2"><Label className="text-sm text-white">Description</Label><Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="What you did..." /></div>
            <div className="space-y-2"><Label className="text-sm text-white">Technologies (comma-separated)</Label><Input value={form.technologies} onChange={(e) => setForm((p) => ({ ...p, technologies: e.target.value }))} className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="React, Node.js, MongoDB" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-sm text-white">Start Date</Label><Input value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} required className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="2024-01" /></div>
              <div className="space-y-2"><Label className="text-sm text-white">End Date</Label><Input value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="Present" /></div>
            </div>
            <div className="space-y-2"><Label className="text-sm text-white">Location</Label><Input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} className="bg-dark border-stroke text-white placeholder:text-muted-text" /></div>
            <div className="space-y-2"><Label className="text-sm text-white">Display Order</Label><Input type="number" value={form.displayOrder} onChange={(e) => setForm((p) => ({ ...p, displayOrder: parseInt(e.target.value) || 0 }))} className="bg-dark border-stroke text-white placeholder:text-muted-text" /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)} className="border-stroke text-white hover:bg-surface">Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-brand hover:bg-brand-light text-white">{saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}{editingId ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-surface border-stroke">
          <AlertDialogHeader><AlertDialogTitle className="text-white">Delete Entry</AlertDialogTitle><AlertDialogDescription className="text-muted-text">This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel className="border-stroke text-white hover:bg-surface">Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ----- Languages Tab -----
const emptyLanguage = { name: '', level: '', displayOrder: 0 };

function LanguagesTab() {
  const [items, setItems] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyLanguage);

  const fetchItems = useCallback(async () => {
    try { const res = await fetch('/api/languages'); if (res.ok) setItems(await res.json()); } catch { /* ignore */ } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => { setEditingId(null); setForm(emptyLanguage); setFormOpen(true); };
  const openEdit = (item: Language) => { setEditingId(item.id); setForm({ name: item.name, level: item.level, displayOrder: item.displayOrder }); setFormOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await fetch('/api/languages', { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingId ? { ...form, id: editingId } : form) });
      if (res.ok) { toast.success(editingId ? 'Updated' : 'Created'); setFormOpen(false); fetchItems(); } else toast.error('Failed');
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { const res = await fetch(`/api/languages?id=${deleteId}`, { method: 'DELETE' }); if (res.ok) { toast.success('Deleted'); setItems((p) => p.filter((i) => i.id !== deleteId)); } else toast.error('Failed'); } catch { toast.error('Failed'); } finally { setDeleteOpen(false); setDeleteId(null); }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button onClick={openCreate} size="sm" className="bg-brand hover:bg-brand-light text-white gap-1.5"><Plus className="w-3.5 h-3.5" /> Add Language</Button>
      </div>
      <Card className="bg-surface border-stroke overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[1, 2].map((i) => <Skeleton key={i} className="h-12 w-full bg-dark" />)}</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center"><p className="text-sm text-muted-text">No languages added yet.</p></div>
        ) : (
          <ScrollArea className="max-h-96">
            <Table>
              <TableHeader>
                <TableRow className="border-stroke hover:bg-transparent">
                  <TableHead className="text-muted-text font-medium">Language</TableHead>
                  <TableHead className="text-muted-text font-medium">Level</TableHead>
                  <TableHead className="text-muted-text font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="border-stroke hover:bg-dark/50">
                    <TableCell className="font-medium text-white">{item.name}</TableCell>
                    <TableCell className="text-muted-text">{item.level}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-text hover:text-white hover:bg-surface" onClick={() => openEdit(item)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-text hover:text-red-500 hover:bg-surface" onClick={() => { setDeleteId(item.id); setDeleteOpen(true); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-surface border-stroke max-w-md">
          <DialogHeader><DialogTitle className="text-white">{editingId ? 'Edit Language' : 'Add Language'}</DialogTitle><DialogDescription className="text-muted-text">Language details.</DialogDescription></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label className="text-sm text-white">Language</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="Arabic" /></div>
            <div className="space-y-2"><Label className="text-sm text-white">Level</Label><Input value={form.level} onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))} required className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="Native / Fluent / ..." /></div>
            <div className="space-y-2"><Label className="text-sm text-white">Display Order</Label><Input type="number" value={form.displayOrder} onChange={(e) => setForm((p) => ({ ...p, displayOrder: parseInt(e.target.value) || 0 }))} className="bg-dark border-stroke text-white placeholder:text-muted-text" /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)} className="border-stroke text-white hover:bg-surface">Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-brand hover:bg-brand-light text-white">{saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}{editingId ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-surface border-stroke">
          <AlertDialogHeader><AlertDialogTitle className="text-white">Delete Entry</AlertDialogTitle><AlertDialogDescription className="text-muted-text">This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel className="border-stroke text-white hover:bg-surface">Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ----- Soft Skills Tab -----
const emptySoftSkill = { name: '', icon: '', displayOrder: 0 };

function SoftSkillsTab() {
  const [items, setItems] = useState<SoftSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptySoftSkill);

  const fetchItems = useCallback(async () => {
    try { const res = await fetch('/api/soft-skills'); if (res.ok) setItems(await res.json()); } catch { /* ignore */ } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => { setEditingId(null); setForm(emptySoftSkill); setFormOpen(true); };
  const openEdit = (item: SoftSkill) => { setEditingId(item.id); setForm({ name: item.name, icon: item.icon, displayOrder: item.displayOrder }); setFormOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await fetch('/api/soft-skills', { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingId ? { ...form, id: editingId } : form) });
      if (res.ok) { toast.success(editingId ? 'Updated' : 'Created'); setFormOpen(false); fetchItems(); } else toast.error('Failed');
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { const res = await fetch(`/api/soft-skills?id=${deleteId}`, { method: 'DELETE' }); if (res.ok) { toast.success('Deleted'); setItems((p) => p.filter((i) => i.id !== deleteId)); } else toast.error('Failed'); } catch { toast.error('Failed'); } finally { setDeleteOpen(false); setDeleteId(null); }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button onClick={openCreate} size="sm" className="bg-brand hover:bg-brand-light text-white gap-1.5"><Plus className="w-3.5 h-3.5" /> Add Soft Skill</Button>
      </div>
      <Card className="bg-surface border-stroke overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[1, 2].map((i) => <Skeleton key={i} className="h-12 w-full bg-dark" />)}</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center"><p className="text-sm text-muted-text">No soft skills added yet.</p></div>
        ) : (
          <ScrollArea className="max-h-96">
            <Table>
              <TableHeader>
                <TableRow className="border-stroke hover:bg-transparent">
                  <TableHead className="text-muted-text font-medium">Skill</TableHead>
                  <TableHead className="text-muted-text font-medium">Icon</TableHead>
                  <TableHead className="text-muted-text font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="border-stroke hover:bg-dark/50">
                    <TableCell className="font-medium text-white">{item.name}</TableCell>
                    <TableCell className="text-muted-text">{item.icon || '—'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-text hover:text-white hover:bg-surface" onClick={() => openEdit(item)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-text hover:text-red-500 hover:bg-surface" onClick={() => { setDeleteId(item.id); setDeleteOpen(true); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-surface border-stroke max-w-md">
          <DialogHeader><DialogTitle className="text-white">{editingId ? 'Edit Soft Skill' : 'Add Soft Skill'}</DialogTitle><DialogDescription className="text-muted-text">Soft skill details.</DialogDescription></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label className="text-sm text-white">Name</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="Problem Solving" /></div>
            <div className="space-y-2"><Label className="text-sm text-white">Icon (emoji)</Label><Input value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="🧠" /></div>
            <div className="space-y-2"><Label className="text-sm text-white">Display Order</Label><Input type="number" value={form.displayOrder} onChange={(e) => setForm((p) => ({ ...p, displayOrder: parseInt(e.target.value) || 0 }))} className="bg-dark border-stroke text-white placeholder:text-muted-text" /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)} className="border-stroke text-white hover:bg-surface">Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-brand hover:bg-brand-light text-white">{saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}{editingId ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-surface border-stroke">
          <AlertDialogHeader><AlertDialogTitle className="text-white">Delete Entry</AlertDialogTitle><AlertDialogDescription className="text-muted-text">This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel className="border-stroke text-white hover:bg-surface">Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ----- Main Page -----
export default function ResumePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Tabs defaultValue="education" className="space-y-4">
        <TabsList className="bg-surface border border-stroke">
          <TabsTrigger value="education" className="data-[state=active]:bg-brand data-[state=active]:text-white text-muted-text gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" /> Education
          </TabsTrigger>
          <TabsTrigger value="experience" className="data-[state=active]:bg-brand data-[state=active]:text-white text-muted-text gap-1.5">
            <Briefcase className="w-3.5 h-3.5" /> Experience
          </TabsTrigger>
          <TabsTrigger value="languages" className="data-[state=active]:bg-brand data-[state=active]:text-white text-muted-text gap-1.5">
            <Languages className="w-3.5 h-3.5" /> Languages
          </TabsTrigger>
          <TabsTrigger value="soft-skills" className="data-[state=active]:bg-brand data-[state=active]:text-white text-muted-text gap-1.5">
            <Heart className="w-3.5 h-3.5" /> Soft Skills
          </TabsTrigger>
        </TabsList>

        <TabsContent value="education"><EducationTab /></TabsContent>
        <TabsContent value="experience"><ExperienceTab /></TabsContent>
        <TabsContent value="languages"><LanguagesTab /></TabsContent>
        <TabsContent value="soft-skills"><SoftSkillsTab /></TabsContent>
      </Tabs>
    </motion.div>
  );
}
