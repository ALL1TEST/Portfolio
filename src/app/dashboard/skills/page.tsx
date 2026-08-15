'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const DEFAULT_CATEGORIES = [
  'Programming',
  'Web',
  'Back-end',
  'Databases',
  'AI & Automation',
  'CMS',
  'Tools & Cloud',
  'SEO',
];

const CATEGORIES = DEFAULT_CATEGORIES;

interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string;
  displayOrder: number;
}

const emptyForm = {
  name: '',
  category: 'Programming',
  icon: '',
  displayOrder: 0,
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [customCategory, setCustomCategory] = useState('');

  const fetchSkills = useCallback(async () => {
    try {
      const res = await fetch('/api/skills');
      if (res.ok) setSkills(await res.json());
    } catch {
      toast.error('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

    const allCategories = [...DEFAULT_CATEGORIES, ...new Set(skills.filter(s => !DEFAULT_CATEGORIES.includes(s.category)).map(s => s.category))];

  const groupedSkills = allCategories.map((cat) => ({
    category: cat,
    skills: skills.filter((s) => s.category === cat),
  }));

  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const openCreate = (category?: string) => {
    setEditingId(null);
    const cat = category || 'Programming';
    setForm({ ...emptyForm, category: DEFAULT_CATEGORIES.includes(cat) ? cat : cat });
    setCustomCategory(DEFAULT_CATEGORIES.includes(cat) ? '' : cat);
    setShowCustomCategory(!DEFAULT_CATEGORIES.includes(cat));
    setFormOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setEditingId(skill.id);
    const isDefault = DEFAULT_CATEGORIES.includes(skill.category);
    setForm({
      name: skill.name,
      category: isDefault ? skill.category : skill.category,
      icon: skill.icon,
      displayOrder: skill.displayOrder,
    });
    setCustomCategory(isDefault ? '' : skill.category);
    setShowCustomCategory(!isDefault);
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const finalCategory = showCustomCategory ? customCategory.trim() : form.category;
      const payload = { ...form, category: finalCategory };
      const res = await fetch('/api/skills', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload),
      });

      if (res.ok) {
        toast.success(editingId ? 'Skill updated' : 'Skill created');
        setFormOpen(false);
        setCustomCategory('');
        setShowCustomCategory(false);
        fetchSkills();
      } else {
        toast.error('Failed to save skill');
      }
    } catch {
      toast.error('Failed to save skill');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/skills?id=${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Skill deleted');
        setSkills((prev) => prev.filter((s) => s.id !== deleteId));
      } else {
        toast.error('Failed to delete skill');
      }
    } catch {
      toast.error('Failed to delete skill');
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
        <p className="text-sm text-muted-text">{skills.length} skills across {allCategories.length} categories</p>
        <Button onClick={() => openCreate()} className="bg-brand hover:bg-brand-light text-white gap-2">
          <Plus className="w-4 h-4" /> Add Skill
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 w-full bg-surface rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groupedSkills.map(({ category, skills: catSkills }) => (
            <Card key={category} className="bg-surface border-stroke">
              <div className="flex items-center justify-between p-4 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{category}</h3>
                  <Badge className="bg-brand/10 text-brand text-[10px] border-0 px-1.5">
                    {catSkills.length}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-text hover:text-brand text-xs hover:bg-brand/10 gap-1"
                  onClick={() => openCreate(category)}
                >
                  <Plus className="w-3 h-3" /> Add
                </Button>
              </div>
              <div className="px-4 pb-4">
                {catSkills.length === 0 ? (
                  <p className="text-xs text-muted-text text-center py-4">No skills in this category</p>
                ) : (
                  <div className="space-y-1">
                    {catSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-dark/50 hover:bg-dark transition-colors group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <GripVertical className="w-3.5 h-3.5 text-stroke flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {skill.icon && (
                            <span className="text-sm flex-shrink-0">{skill.icon}</span>
                          )}
                          <span className="text-sm text-white truncate">{skill.name}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-text hover:text-white hover:bg-surface"
                            onClick={() => openEdit(skill)}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-text hover:text-red-500 hover:bg-surface"
                            onClick={() => { setDeleteId(skill.id); setDeleteOpen(true); }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-surface border-stroke max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">{editingId ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
            <DialogDescription className="text-muted-text">
              {editingId ? 'Update skill details.' : 'Add a new skill to your collection.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-white">Skill Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="React"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-white">Category</Label>
              <div className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <Select
                    value={showCustomCategory ? '__new__' : form.category}
                    onValueChange={(v) => {
                      if (v === '__new__') {
                        setShowCustomCategory(true);
                        setCustomCategory('');
                        setForm((p) => ({ ...p, category: '' }));
                      } else {
                        setShowCustomCategory(false);
                        setCustomCategory('');
                        setForm((p) => ({ ...p, category: v }));
                      }
                    }}
                  >
                    <SelectTrigger className="bg-dark border-stroke text-white">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-surface border-stroke">
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-white focus:bg-dark focus:text-white">
                          {cat}
                        </SelectItem>
                      ))}
                      <SelectItem value="__new__" className="text-brand focus:bg-brand/10 focus:text-brand font-medium">
                        + Add Category
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {showCustomCategory && (
                <Input
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  required
                  autoFocus
                  className="bg-dark border-stroke text-white placeholder:text-muted-text mt-2"
                  placeholder="Enter new category name"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-white">Icon (emoji or text)</Label>
              <Input
                value={form.icon}
                onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="⚡"
              />
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
            <AlertDialogTitle className="text-white">Delete Skill</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-text">
              This action cannot be undone.
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
