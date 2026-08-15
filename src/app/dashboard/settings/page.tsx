'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Save, Loader2, User, Upload, Trash2, Camera, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
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
  featuredProjectsTitle: string;
  featuredProjectsDescription: string;
  aboutCard1Title: string;
  aboutCard1Description: string;
  aboutCard2Title: string;
  aboutCard2Description: string;
  aboutCard3Title: string;
  aboutCard3Description: string;
  logoUrl: string;
  profileImage: string;
  cvFile: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
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
  featuredProjectsTitle: '',
  featuredProjectsDescription: '',
  aboutCard1Title: '',
  aboutCard1Description: '',
  aboutCard2Title: '',
  aboutCard2Description: '',
  aboutCard3Title: '',
  aboutCard3Description: '',
  logoUrl: '',
  profileImage: '',
  cvFile: '',
  stat1Value: '',
  stat1Label: '',
  stat2Value: '',
  stat2Label: '',
  stat3Value: '',
  stat3Label: '',
};

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [original, setOriginal] = useState<Profile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'profile' | 'cv' | 'logo' | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

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
    if (!file.type.startsWith('image/')) { toast.error('Only image files are allowed'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }

    setUploading('profile');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'profile');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        updateField('profileImage', data.url);
        toast.success('Image uploaded successfully');
      } else { toast.error('Failed to upload image'); }
    } catch { toast.error('Failed to upload image'); }
    finally { setUploading(null); if (imageInputRef.current) imageInputRef.current.value = ''; }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Only PDF files are allowed'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('File must be under 10MB'); return; }

    setUploading('cv');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'cv');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        updateField('cvFile', data.url);
        toast.success('CV uploaded successfully');
      } else { toast.error('Failed to upload CV'); }
    } catch { toast.error('Failed to upload CV'); }
    finally { setUploading(null); if (cvInputRef.current) cvInputRef.current.value = ''; }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Only image files are allowed'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }

    setUploading('logo');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'profile');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        updateField('logoUrl', data.url);
        toast.success('Logo uploaded successfully');
      } else { toast.error('Failed to upload logo'); }
    } catch { toast.error('Failed to upload logo'); }
    finally { setUploading(null); if (logoInputRef.current) logoInputRef.current.value = ''; }
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
      } else { toast.error('Failed to save profile'); }
    } catch { toast.error('Failed to save profile'); }
    finally { setSaving(false); }
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
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>

      {/* Profile Image */}
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Profile Image</h3>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-stroke/50 bg-dark flex-shrink-0">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-text"><User className="w-8 h-8" /></div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => imageInputRef.current?.click()} disabled={uploading === 'profile'} className="border-stroke text-white hover:bg-dark gap-2">
                {uploading === 'profile' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                {uploading === 'profile' ? 'Uploading...' : 'Upload Image'}
              </Button>
              {profile.profileImage && (
                <Button type="button" variant="ghost" size="sm" onClick={() => updateField('profileImage', '')} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-text">Recommended: Square image, min 300×300px. Max 5MB.</p>
            <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
        </div>
      </Card>

      {/* CV Upload */}
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">CV / Resume</h3>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-stroke/50 bg-dark flex-shrink-0 flex items-center justify-center">
            {profile.cvFile ? (
              <a href={profile.cvFile} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-muted-text hover:text-brand transition-colors">
                <FileText className="w-8 h-8" />
                <span className="text-[10px]">View CV</span>
              </a>
            ) : (
              <div className="flex flex-col items-center gap-1 text-muted-text/40">
                <FileText className="w-8 h-8" />
                <span className="text-[10px]">No CV</span>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => cvInputRef.current?.click()} disabled={uploading === 'cv'} className="border-stroke text-white hover:bg-dark gap-2">
                {uploading === 'cv' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading === 'cv' ? 'Uploading...' : 'Upload CV'}
              </Button>
              {profile.cvFile && (
                <Button type="button" variant="ghost" size="sm" onClick={() => updateField('cvFile', '')} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-text">PDF format only. Max 10MB.</p>
            <input ref={cvInputRef} type="file" accept=".pdf" onChange={handleCvUpload} className="hidden" />
          </div>
        </div>
      </Card>

      {/* Logo */}
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Logo</h3>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-stroke/50 bg-dark flex-shrink-0">
            {profile.logoUrl ? (
              <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-text/40">
                <img src="/logo.png" alt="Current logo" className="w-12 h-12 object-contain opacity-50" />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => logoInputRef.current?.click()} disabled={uploading === 'logo'} className="border-stroke text-white hover:bg-dark gap-2">
                {uploading === 'logo' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                {uploading === 'logo' ? 'Uploading...' : 'Upload Logo'}
              </Button>
              {profile.logoUrl && (
                <Button type="button" variant="ghost" size="sm" onClick={() => updateField('logoUrl', '')} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-text">Recommended: Square PNG with transparent background, min 200×200px. Max 5MB.</p>
            <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
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
              <Input value={profile.fullName} onChange={(e) => updateField('fullName', e.target.value)} className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="ABDELLAH AIT-SI" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-white">Brand Name</Label>
              <Input value={profile.brandName} onChange={(e) => updateField('brandName', e.target.value)} className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="CodeVirtox" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-white">Professional Title</Label>
            <Input value={profile.professionalTitle} onChange={(e) => updateField('professionalTitle', e.target.value)} className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="Full Stack Developer | AI & Automation" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-white">Short Bio</Label>
            <Input value={profile.shortBio} onChange={(e) => updateField('shortBio', e.target.value)} className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="I build modern web applications..." />
          </div>
        </div>
      </Card>

      {/* About Text */}
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">About</h3>
        <div className="space-y-2">
          <Label className="text-sm text-white">About Text</Label>
          <Textarea value={profile.aboutText} onChange={(e) => updateField('aboutText', e.target.value)} className="bg-dark border-stroke text-white placeholder:text-muted-text min-h-[200px]" placeholder="Tell visitors about yourself..." />
          <p className="text-xs text-muted-text">This appears on the About section of your portfolio.</p>
        </div>
      </Card>

      {/* About Cards */}
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">About Cards</h3>
        <p className="text-xs text-muted-text mb-4">Edit the 3 value cards displayed in the About section.</p>
        <div className="space-y-6">
          {(['1', '2', '3'] as const).map((num) => (
            <div key={num} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-md bg-brand/10 text-brand font-bold text-xs flex items-center justify-center flex-shrink-0">0{num}</span>
                <span className="text-xs font-medium text-muted-text">Card {num}</span>
              </div>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label className="text-xs text-white/70">Title</Label>
                  <Input
                    value={profile[`aboutCard${num}Title` as keyof Profile] as string}
                    onChange={(e) => updateField(`aboutCard${num}Title` as keyof Profile, e.target.value)}
                    className="bg-dark border-stroke text-white placeholder:text-muted-text"
                    placeholder={`Card ${num} title...`}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-white/70">Description</Label>
                  <Textarea
                    value={profile[`aboutCard${num}Description` as keyof Profile] as string}
                    onChange={(e) => updateField(`aboutCard${num}Description` as keyof Profile, e.target.value)}
                    className="bg-dark border-stroke text-white placeholder:text-muted-text min-h-[80px]"
                    placeholder={`Card ${num} description...`}
                  />
                </div>
              </div>
              {num !== '3' && <div className="border-b border-stroke/20" />}
            </div>
          ))}
        </div>
      </Card>

      {/* Featured Projects Section */}
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Featured Projects Section</h3>
        <p className="text-xs text-muted-text mb-4">Edit the heading and description of the Featured Projects section.</p>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-white">Section Title</Label>
            <Input
              value={profile.featuredProjectsTitle}
              onChange={(e) => updateField('featuredProjectsTitle', e.target.value)}
              className="bg-dark border-stroke text-white placeholder:text-muted-text"
              placeholder="Featured Projects"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-white">Section Description</Label>
            <Textarea
              value={profile.featuredProjectsDescription}
              onChange={(e) => updateField('featuredProjectsDescription', e.target.value)}
              className="bg-dark border-stroke text-white placeholder:text-muted-text min-h-[100px]"
              placeholder="A selection of projects showcasing..."
            />
          </div>
        </div>
      </Card>

      {/* Footer Bio */}
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Footer</h3>
        <div className="space-y-2">
          <Label className="text-sm text-white">Footer Bio</Label>
          <Textarea value={profile.footerBio} onChange={(e) => updateField('footerBio', e.target.value)} className="bg-dark border-stroke text-white placeholder:text-muted-text min-h-[100px]" placeholder="A short bio or tagline that appears in the footer..." />
          <p className="text-xs text-muted-text">This appears in the footer section of your website.</p>
        </div>
      </Card>

      {/* Achievement Stats */}
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Achievement Stats</h3>
        <p className="text-xs text-muted-text mb-4">Edit the 3 stats displayed in the stats section of your site.</p>
        <div className="space-y-6">
          {(['1', '2', '3'] as const).map((num) => (
            <div key={num} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-md bg-brand/10 text-brand font-bold text-xs flex items-center justify-center flex-shrink-0">#{num}</span>
                <span className="text-xs font-medium text-muted-text">Stat {num}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-white/70">Value</Label>
                  <Input
                    value={profile[`stat${num}Value` as keyof Profile] as string}
                    onChange={(e) => updateField(`stat${num}Value` as keyof Profile, e.target.value)}
                    className="bg-dark border-stroke text-white placeholder:text-muted-text"
                    placeholder="e.g. 6+"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-white/70">Label</Label>
                  <Input
                    value={profile[`stat${num}Label` as keyof Profile] as string}
                    onChange={(e) => updateField(`stat${num}Label` as keyof Profile, e.target.value)}
                    className="bg-dark border-stroke text-white placeholder:text-muted-text"
                    placeholder="e.g. Certificates"
                  />
                </div>
              </div>
              {num !== '3' && <div className="border-b border-stroke/20" />}
            </div>
          ))}
        </div>
      </Card>

      {/* Social Links */}
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Social Links</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-white">GitHub URL</Label>
              <Input value={profile.githubUrl} onChange={(e) => updateField('githubUrl', e.target.value)} className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="https://github.com/username" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-white">LinkedIn URL</Label>
              <Input value={profile.linkedinUrl} onChange={(e) => updateField('linkedinUrl', e.target.value)} className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="https://linkedin.com/in/username" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-white">Instagram URL</Label>
              <Input value={profile.instagramUrl} onChange={(e) => updateField('instagramUrl', e.target.value)} className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="https://instagram.com/username" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-white">Twitter URL</Label>
              <Input value={profile.twitterUrl} onChange={(e) => updateField('twitterUrl', e.target.value)} className="bg-dark border-stroke text-white placeholder:text-muted-text" placeholder="https://twitter.com/username" />
            </div>
          </div>
          <p className="text-xs text-muted-text">Leave a social link empty to hide its icon from the frontend.</p>
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
