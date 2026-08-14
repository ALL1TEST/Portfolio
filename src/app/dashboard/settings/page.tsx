'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Save, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface Profile {
  id?: string;
  fullName: string;
  brandName: string;
  professionalTitle: string;
  shortBio: string;
  aboutText: string;
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  profileImage: string;
  cvFile: string;
}

const emptyProfile: Profile = {
  fullName: '',
  brandName: '',
  professionalTitle: '',
  shortBio: '',
  aboutText: '',
  email: '',
  phone: '',
  location: '',
  githubUrl: '',
  linkedinUrl: '',
  profileImage: '',
  cvFile: '',
};

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [original, setOriginal] = useState<Profile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setOriginal(data);
        }
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const updateField = (field: keyof Profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        const data = await res.json();
        setOriginal(data);
        toast.success('Profile saved successfully');
      } else {
        toast.error('Failed to save profile');
      }
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = JSON.stringify(profile) !== JSON.stringify(original);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full bg-surface rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-3xl"
    >
      {/* Header with save button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
            <User className="w-5 h-5 text-brand" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Profile Information</h2>
            <p className="text-sm text-muted-text">Update your personal and professional details</p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="bg-brand hover:bg-brand-light text-white gap-2 disabled:opacity-40"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </Button>
      </div>

      {/* Personal Information */}
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-white">Full Name</Label>
              <Input
                value={profile.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="ABDELLAH AIT-SI"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-white">Brand Name</Label>
              <Input
                value={profile.brandName}
                onChange={(e) => updateField('brandName', e.target.value)}
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="CodeVirtox"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-white">Professional Title</Label>
            <Input
              value={profile.professionalTitle}
              onChange={(e) => updateField('professionalTitle', e.target.value)}
              className="bg-dark border-stroke text-white placeholder:text-muted-text"
              placeholder="Full Stack Developer | AI & Automation"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-white">Short Bio</Label>
            <Input
              value={profile.shortBio}
              onChange={(e) => updateField('shortBio', e.target.value)}
              className="bg-dark border-stroke text-white placeholder:text-muted-text"
              placeholder="Building modern web applications and smart automated solutions."
            />
          </div>
        </div>
      </Card>

      {/* About Text */}
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">About</h3>
        <div className="space-y-2">
          <Label className="text-sm text-white">About Text</Label>
          <Textarea
            value={profile.aboutText}
            onChange={(e) => updateField('aboutText', e.target.value)}
            className="bg-dark border-stroke text-white placeholder:text-muted-text min-h-[200px]"
            placeholder="Tell visitors about yourself, your background, experience, and what drives you..."
          />
          <p className="text-xs text-muted-text">This appears on the About section of your portfolio.</p>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-white">Email</Label>
              <Input
                value={profile.email}
                onChange={(e) => updateField('email', e.target.value)}
                type="email"
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="contact@codevirtox.com"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-white">Phone</Label>
              <Input
                value={profile.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="+212 600-000-000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-white">Location</Label>
            <Input
              value={profile.location}
              onChange={(e) => updateField('location', e.target.value)}
              className="bg-dark border-stroke text-white placeholder:text-muted-text"
              placeholder="Oulad Teima, Morocco"
            />
          </div>
        </div>
      </Card>

      {/* Social Links */}
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Social Links</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-white">GitHub URL</Label>
              <Input
                value={profile.githubUrl}
                onChange={(e) => updateField('githubUrl', e.target.value)}
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="https://github.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-white">LinkedIn URL</Label>
              <Input
                value={profile.linkedinUrl}
                onChange={(e) => updateField('linkedinUrl', e.target.value)}
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-white">Profile Image URL</Label>
              <Input
                value={profile.profileImage}
                onChange={(e) => updateField('profileImage', e.target.value)}
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="/images/profile.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-white">CV File URL</Label>
              <Input
                value={profile.cvFile}
                onChange={(e) => updateField('cvFile', e.target.value)}
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="/cv/resume.pdf"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Unsaved changes indicator */}
      {hasChanges && (
        <div className="flex items-center gap-2 text-xs text-brand">
          <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          Unsaved changes
        </div>
      )}
    </motion.div>
  );
}
