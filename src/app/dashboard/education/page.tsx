'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
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

const emptyForm = {
  degree: '',
  field: '',
  institution: '',
  location: '',
  year: '',
  displayOrder: 0,
};

export default function EducationPage() {
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/education');
      if (res.ok) setItems(await res.json());
    } catch {
      toast.error('Failed to fetch education entries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, displayOrder: items.length > 0 ? Math.max(...items.map((i) => i.displayOrder)) + 1 : 0 });
    setFormOpen(true);
  };

  const openEdit = (item: Education) => {
    setEditingId(item.id);
    setForm({
      degree: item.degree,
      field: item.field,
      institution: item.institution,
      location: item.location,
      year: item.year,
      displayOrder: item.displayOrder,
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/education', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
      });
      if (res.ok) {
        toast.success(editingId ? 'Education updated' : 'Education created');
        setFormOpen(false);
        fetchItems();
      } else {
        toast.error('Failed to save education');
      }
    } catch {
      toast.error('Failed to save education');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/education?id=${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Education deleted');
        setItems((prev) => prev.filter((i) => i.id !== deleteId));
      } else {
        toast.error('Failed to delete education');
      }
    } catch {
      toast.error('Failed to delete education');
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const handleReorder = async (item: Education, direction: 'up' | 'down') => {
    const idx = items.findIndex((i) => i.id === item.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;

    const swapItem = items[swapIdx];
    const updatedCurrent = { ...item, displayOrder: swapItem.displayOrder };
    const updatedSwap = { ...swapItem, displayOrder: item.displayOrder };

    try {
      const [res1, res2] = await Promise.all([
        fetch('/api/education', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCurrent),
        }),
        fetch('/api/education', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSwap),
        }),
      ]);
      if (res1.ok && res2.ok) {
        const newItems = [...items];
        newItems[idx] = updatedSwap;
        newItems[swapIdx] = updatedCurrent;
        newItems.sort((a, b) => a.displayOrder - b.displayOrder);
        setItems(newItems);
      } else {
        toast.error('Failed to reorder');
      }
    } catch {
      toast.error('Failed to reorder');
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
          <p className="text-sm text-muted-text">{items.length} education entries</p>
        </div>
        <Button onClick={openCreate} className="bg-brand hover:bg-brand-light text-white gap-2">
          <Plus className="w-4 h-4" /> Add Education
        </Button>
      </div>

      {/* Table */}
      <Card className="bg-surface border-stroke overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full bg-dark" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-text">No education entries yet. Click &quot;Add Education&quot; to create one.</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[calc(100vh-16rem)]">
            <Table>
              <TableHeader>
                <TableRow className="border-stroke hover:bg-transparent">
                  <TableHead className="text-muted-text font-medium w-[80px]">Order</TableHead>
                  <TableHead className="text-muted-text font-medium">Institution</TableHead>
                  <TableHead className="text-muted-text font-medium hidden md:table-cell">Degree / Field</TableHead>
                  <TableHead className="text-muted-text font-medium hidden sm:table-cell">Year</TableHead>
                  <TableHead className="text-muted-text font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, idx) => (
                  <TableRow key={item.id} className="border-stroke hover:bg-dark/50">
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-text hover:text-white hover:bg-surface"
                          disabled={idx === 0}
                          onClick={() => handleReorder(item, 'up')}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-text hover:text-white hover:bg-surface"
                          disabled={idx === items.length - 1}
                          onClick={() => handleReorder(item, 'down')}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-white">{item.institution}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>
                        <p className="text-sm text-white">{item.degree}</p>
                        <p className="text-xs text-muted-text">{item.field}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-text hidden sm:table-cell text-sm">{item.year}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-text hover:text-white hover:bg-surface"
                          onClick={() => openEdit(item)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-text hover:text-red-500 hover:bg-surface"
                          onClick={() => { setDeleteId(item.id); setDeleteOpen(true); }}
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

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-surface border-stroke max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">{editingId ? 'Edit Education' : 'Add Education'}</DialogTitle>
            <DialogDescription className="text-muted-text">
              {editingId ? 'Update education details.' : 'Fill in the education details.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-white">Institution</Label>
              <Input
                value={form.institution}
                onChange={(e) => setForm((p) => ({ ...p, institution: e.target.value }))}
                required
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="University of ..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-white">Degree</Label>
                <Input
                  value={form.degree}
                  onChange={(e) => setForm((p) => ({ ...p, degree: e.target.value }))}
                  required
                  className="bg-dark border-stroke text-white placeholder:text-muted-text"
                  placeholder="Bachelor's Degree"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-white">Field</Label>
                <Input
                  value={form.field}
                  onChange={(e) => setForm((p) => ({ ...p, field: e.target.value }))}
                  required
                  className="bg-dark border-stroke text-white placeholder:text-muted-text"
                  placeholder="Computer Science"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-white">Year</Label>
                <Input
                  value={form.year}
                  onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
                  required
                  className="bg-dark border-stroke text-white placeholder:text-muted-text"
                  placeholder="2020 – 2024"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-white">Location</Label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  className="bg-dark border-stroke text-white placeholder:text-muted-text"
                  placeholder="City, Country"
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
            <AlertDialogTitle className="text-white">Delete Education</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-text">
              This action cannot be undone. The education entry will be permanently deleted.
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
