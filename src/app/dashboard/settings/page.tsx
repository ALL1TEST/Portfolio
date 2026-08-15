'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Save, Loader2, User, Upload, Trash2, Camera } from 'lucide-react';
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
  footerBio: string;
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  profileImage: string;
  cvFile: string;
}

const emptyProfile: Profile = {
  fullName: '',
  brandName: '',
  professionalTitle: '',
  shortBio: '',
  aboutText: '',
  footerBio: '',
  email: '',
  phone: '',
  location: '',
  githubUrl: '',
  linkedinUrl: '',
  instagramUrl: '',
  twitterUrl: '',
  profileImage: '',
  cvFile: '',
};

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [original, setOriginal] = useState<Profile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'profile');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        updateField('profileImage', data.url);
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    updateField('profileImage', '');
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

      {/* Profile Image */}
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Profile Image</h3>
        <div className="flex items-center gap-6">
          {/* Preview */}
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-stroke/50 bg-dark flex-shrink-0">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-text">
                <User className="w-8 h-8" />
              </div>
            )}
          </div>

          {/* Upload controls */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="border-stroke text-white hover:bg-dark gap-2"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
              {profile.profileImage && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeImage}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-text">
              Recommended: Square image, min 300×300px. Max 5MB.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </Card>

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
              placeholder="I build modern web applications, scalable backend systems, and automation solutions that help turn ideas into reliable digital products."
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

      {/* Footer Bio */}
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Footer</h3>
        <div className="space-y-2">
          <Label className="text-sm text-white">Footer Bio</Label>
          <Textarea
            value={profile.footerBio}
            onChange={(e) => updateField('footerBio', e.target.value)}
            className="bg-dark border-stroke text-white placeholder:text-muted-text min-h-[100px]"
            placeholder="A short bio or tagline that appears in the footer of your site..."
          />
          <p className="text-xs text-muted-text">This appears in the footer section of your website.</p>
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
              <Label className="text-sm text-white">Instagram URL</Label>
              <Input
                value={profile.instagramUrl}
                onChange={(e) => updateField('instagramUrl', e.target.value)}
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="https://instagram.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-white">Twitter URL</Label>
              <Input
                value={profile.twitterUrl}
                onChange={(e) => updateField('twitterUrl', e.target.value)}
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <p className="text-xs text-muted-text">
            Leave a social link empty to hide its icon from the frontend.
          </p>
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
