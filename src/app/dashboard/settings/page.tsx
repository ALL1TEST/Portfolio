'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Save, Loader2, User, Upload, Trash2, Camera, FileText, Search, X, Mail, Lock, KeyRound, Server, Send, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

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
  projectsPageTitle: string;
  projectsPageDescription: string;
  certificatesPageTitle: string;
  certificatesPageDescription: string;
  educationPageTitle: string;
  educationPageDescription: string;
  resumeIntro: string;
  resumeTechTitle: string;
  resumeExpTitle: string;
  contactPageTitle: string;
  contactPageDescription: string;
  footerCopyright: string;
  footerCredit: string;
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
  projectsPageTitle: '',
  projectsPageDescription: '',
  certificatesPageTitle: '',
  certificatesPageDescription: '',
  educationPageTitle: '',
  educationPageDescription: '',
  resumeIntro: '',
  resumeTechTitle: '',
  resumeExpTitle: '',
  contactPageTitle: '',
  contactPageDescription: '',
  footerCopyright: '',
  footerCredit: '',
};

const filterCategories = ['All', 'Media', 'Personal', 'Pages', 'Footer', 'Social'];

interface CardItem {
  id: string;
  category: string;
  title: string;
  children: React.ReactNode;
}

function FilterableCard({ category, title, searchQuery, activeFilter, children }: { category: string; title: string; searchQuery: string; activeFilter: string; children: React.ReactNode }) {
  const matchesCategory = activeFilter === 'All' || category === activeFilter || category === 'All';
  const q = searchQuery.toLowerCase();
  const matchesSearch = q === '' || title.toLowerCase().includes(q);
  if (!matchesCategory || !matchesSearch) return null;
  return <>{children}</>;
}

interface PendingFile {
  file: File;
  previewUrl: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [original, setOriginal] = useState<Profile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [pendingFiles, setPendingFiles] = useState<Record<string, PendingFile>>({});
  // Account change states
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // SMTP settings state
  const [smtpSettings, setSmtpSettings] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    smtpSecure: true,
    fromName: '',
    fromEmail: '',
    replyToEmail: '',
    contactReceiverEmail: '',
    hasPassword: false,
  });
  const [savingSmtp, setSavingSmtp] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  // Notification settings state
  const [notifSettings, setNotifSettings] = useState({
    contactEmailEnabled: false,
    adminLoginEmailEnabled: false,
  });
  const [savingNotif, setSavingNotif] = useState(false);

  // Fetch SMTP settings
  useEffect(() => {
    const fetchSmtp = async () => {
      try {
        const res = await fetch('/api/settings/smtp');
        if (res.ok) {
          const data = await res.json();
          setSmtpSettings({
            smtpHost: data.smtpHost || '',
            smtpPort: data.smtpPort || 587,
            smtpUser: data.smtpUser || '',
            smtpPass: '',
            smtpSecure: data.smtpSecure ?? true,
            fromName: data.fromName || '',
            fromEmail: data.fromEmail || '',
            replyToEmail: data.replyToEmail || '',
            contactReceiverEmail: data.contactReceiverEmail || '',
            hasPassword: data.hasPassword || false,
          });
        }
      } catch {
        // silently fail
      }
    };
    fetchSmtp();
  }, []);

  // Fetch notification settings
  useEffect(() => {
    const fetchNotif = async () => {
      try {
        const res = await fetch('/api/settings/notifications');
        if (res.ok) {
          const data = await res.json();
          setNotifSettings({
            contactEmailEnabled: data.contactEmailEnabled || false,
            adminLoginEmailEnabled: data.adminLoginEmailEnabled || false,
          });
        }
      } catch {
        // silently fail
      }
    };
    fetchNotif();
  }, []);

  const handleSaveSmtp = async () => {
    setSavingSmtp(true);
    try {
      const res = await fetch('/api/settings/smtp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpSettings),
      });
      if (res.ok) {
        toast.success('SMTP settings saved successfully');
      } else {
        toast.error('Failed to save SMTP settings');
      }
    } catch {
      toast.error('Failed to save SMTP settings');
    }
    finally { setSavingSmtp(false); }
  };

  const handleSendTestEmail = async () => {
    setSendingTest(true);
    try {
      const res = await fetch('/api/settings/test-email', { method: 'POST' });
      if (res.ok) {
        toast.success('Test email sent successfully!');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to send test email');
      }
    } catch {
      toast.error('Failed to send test email');
    }
    finally { setSendingTest(false); }
  };

  const handleSaveNotif = async () => {
    setSavingNotif(true);
    try {
      const res = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifSettings),
      });
      if (res.ok) {
        toast.success('Notification settings saved successfully');
      } else {
        toast.error('Failed to save notification settings');
      }
    } catch {
      toast.error('Failed to save notification settings');
    }
    finally { setSavingNotif(false); }
  };

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Only image files are allowed'); return; }

    const previewUrl = URL.createObjectURL(file);
    setPendingFiles(prev => ({ ...prev, profileImage: { file, previewUrl } }));
    updateField('profileImage', previewUrl);
    
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Only PDF files are allowed'); return; }

    const previewUrl = URL.createObjectURL(file);
    setPendingFiles(prev => ({ ...prev, cvFile: { file, previewUrl } }));
    updateField('cvFile', previewUrl);
    
    if (cvInputRef.current) cvInputRef.current.value = '';
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Only image files are allowed'); return; }

    const previewUrl = URL.createObjectURL(file);
    setPendingFiles(prev => ({ ...prev, logoUrl: { file, previewUrl } }));
    updateField('logoUrl', previewUrl);
    
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const getStoragePath = (url: string) => {
    const marker = '/storage/v1/object/public/uploads/';
    const index = url.indexOf(marker);
    if (index === -1) return null;
    return url.substring(index + marker.length);
  };

  const handleRemoveFile = async (url: string, field: keyof Profile) => {
    try {
      if (!url) return;

      if (pendingFiles[field]) {
        URL.revokeObjectURL(pendingFiles[field].previewUrl);
        setPendingFiles(prev => {
          const updated = { ...prev };
          delete updated[field];
          return updated;
        });
        updateField(field, (original[field] as any) || '');
        return;
      }

      const filePath = getStoragePath(url);
      if (!filePath) {
        toast.error('Could not determine file path');
        return;
      }

      const res = await fetch('/api/upload/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete file');
      
      updateField(field, '');
      toast.success('File deleted successfully');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to delete file');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let updatedProfile = { ...profile };

      const fileFields = Object.keys(pendingFiles) as Array<keyof Profile>;
      for (const field of fileFields) {
        const { file } = pendingFiles[field];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', field === 'cvFile' ? 'cv' : 'profile');

        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(`Failed to upload ${field}: ${errData.error}`);
        }
        const data = await uploadRes.json();
        updatedProfile[field] = data.url;
      }

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile),
      });
      
      if (res.ok) {
        const data = await res.json();
        
        // Delete old replaced files
        for (const field of fileFields) {
          const oldUrl = original[field] as string;
          if (oldUrl) {
            const filePath = getStoragePath(oldUrl);
            if (filePath) {
              fetch('/api/upload/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filePath }),
              }).catch(console.error);
            }
          }
        }

        setProfile(data);
        setOriginal(data);
        setPendingFiles({});
        toast.success('Profile saved successfully');
      } else { 
        const errData = await res.json().catch(()=>({}));
        throw new Error(errData.error || 'Failed to save profile'); 
      }
    } catch (err: any) { 
      console.error('Save error:', err);
      toast.error(err.message || 'Failed to save profile'); 
    }
    finally { setSaving(false); }
  };

  // Fetch user email for account settings from session, not profile
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const session = await res.json();
          if (session?.user?.email) {
            setCurrentEmail(session.user.email);
          }
        }
      } catch {
        // silently fail
      }
    };
    if (currentEmail === '' && !loading) fetchSession();
  }, [currentEmail, loading]);

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) { toast.error('New email is required'); return; }
    setSavingEmail(true);
    try {
      const res = await fetch('/api/auth/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentEmail, newEmail: newEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to change email'); return; }
      setCurrentEmail(data.email);
      setNewEmail('');
      toast.success('Email changed successfully');
    } catch { toast.error('Failed to change email'); }
    finally { setSavingEmail(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) { toast.error('All fields are required'); return; }
    if (newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    if (newPassword !== confirmNewPassword) { toast.error('Passwords do not match'); return; }
    setSavingPassword(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to change password'); return; }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      toast.success('Password changed successfully');
    } catch { toast.error('Failed to change password'); }
    finally { setSavingPassword(false); }
  };

  const hasChanges = JSON.stringify(profile) !== JSON.stringify(original) || Object.keys(pendingFiles).length > 0;

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full bg-surface rounded-xl" />
        ))}
      </div>
    );
  }

  // Build card list with categories
  const cardList: CardItem[] = [
    { id: 'account', category: 'Personal', title: 'Account', children: null },
    { id: 'profile-image', category: 'Media', title: 'Profile Image', children: null },
    { id: 'cv-upload', category: 'Media', title: 'CV Resume', children: null },
    { id: 'logo', category: 'Media', title: 'Logo', children: null },
    { id: 'personal-info', category: 'Personal', title: 'Personal Information', children: null },
    { id: 'about-text', category: 'Personal', title: 'About', children: null },
    { id: 'about-cards', category: 'Personal', title: 'About Cards', children: null },
    { id: 'featured-projects', category: 'Pages', title: 'Featured Projects Section', children: null },
    { id: 'footer', category: 'Footer', title: 'Footer', children: null },
    { id: 'achievement-stats', category: 'Personal', title: 'Achievement Stats', children: null },
    { id: 'projects-page', category: 'Pages', title: 'Projects Page', children: null },
    { id: 'certificates-page', category: 'Pages', title: 'Certificates Page', children: null },
    { id: 'education-page', category: 'Pages', title: 'Education Page', children: null },
    { id: 'resume-page', category: 'Pages', title: 'Resume Page', children: null },
    { id: 'contact-page', category: 'Pages', title: 'Contact Page', children: null },
    { id: 'social-links', category: 'Social', title: 'Social Links', children: null },
    { id: 'smtp-config', category: 'All', title: 'SMTP Configuration', children: null },
    { id: 'email-notifications', category: 'All', title: 'Email Notifications', children: null },
  ];

  const hasVisibleCards = () => {
    const q = searchQuery.toLowerCase();
    return cardList.some(
      (card) =>
        (activeFilter === 'All' || card.category === activeFilter || card.category === 'All') &&
        (q === '' || card.title.toLowerCase().includes(q))
    );
  };

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

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-surface border-stroke text-white placeholder:text-muted-text pl-9 pr-9"
          placeholder="Search settings..."
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-text hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category filter buttons */}
      <div className="flex flex-wrap gap-2">
        {filterCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${
              activeFilter === cat
                ? 'bg-brand text-white border-brand'
                : 'bg-surface border-stroke/50 text-muted-text hover:text-white hover:border-stroke'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Account — Change Email & Password */}
      <FilterableCard category="Personal" title="Account" searchQuery={searchQuery} activeFilter={activeFilter}>
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Account Settings</h3>
        <p className="text-xs text-muted-text mb-6">Change your login email and password.</p>

        <div className="space-y-6">
          {/* Change Email */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-brand" />
              <span className="text-sm font-medium text-white">Change Email</span>
            </div>
            <form onSubmit={handleChangeEmail} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-white/70">Current Email</Label>
                  <Input
                    type="email"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    required
                    className="bg-dark border-stroke text-white placeholder:text-muted-text"
                    placeholder="admin@codevirtox.com"
                    disabled={savingEmail}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-white/70">New Email</Label>
                  <Input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    className="bg-dark border-stroke text-white placeholder:text-muted-text"
                    placeholder="new@example.com"
                    disabled={savingEmail}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={savingEmail || !newEmail.trim() || newEmail === currentEmail}
                variant="outline"
                size="sm"
                className="border-stroke text-white hover:bg-dark gap-2 disabled:opacity-40"
              >
                {savingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                Update Email
              </Button>
            </form>
          </div>

          {/* Divider */}
          <div className="border-t border-stroke/30" />

          {/* Change Password */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound className="w-4 h-4 text-brand" />
              <span className="text-sm font-medium text-white">Change Password</span>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-white/70">Current Password</Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="bg-dark border-stroke text-white placeholder:text-muted-text"
                    placeholder="••••••••"
                    disabled={savingPassword}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-white/70">New Password</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-dark border-stroke text-white placeholder:text-muted-text"
                    placeholder="••••••••"
                    disabled={savingPassword}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-white/70">Confirm Password</Label>
                  <Input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-dark border-stroke text-white placeholder:text-muted-text"
                    placeholder="••••••••"
                    disabled={savingPassword}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={savingPassword || !currentPassword || !newPassword || newPassword !== confirmNewPassword}
                  variant="outline"
                  size="sm"
                  className="border-stroke text-white hover:bg-dark gap-2 disabled:opacity-40"
                >
                  {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  Update Password
                </Button>
                {newPassword && confirmNewPassword && newPassword !== confirmNewPassword && (
                  <p className="text-xs text-red-400">Passwords do not match</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </Card>
      </FilterableCard>

      {/* Profile Image */}
      <FilterableCard category="Media" title="Profile Image" searchQuery={searchQuery} activeFilter={activeFilter}>
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
              <Button type="button" variant="outline" size="sm" onClick={() => imageInputRef.current?.click()} className="border-stroke text-white hover:bg-dark gap-2">
                <Camera className="w-4 h-4" />
                Upload Image
              </Button>
              {profile.profileImage && (
                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveFile(profile.profileImage, 'profileImage')} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-text">Recommended: Square image, min 300×300px.</p>
            <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
        </div>
      </Card>
      </FilterableCard>

      {/* CV Upload */}
      <FilterableCard category="Media" title="CV Resume" searchQuery={searchQuery} activeFilter={activeFilter}>
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
              <Button type="button" variant="outline" size="sm" onClick={() => cvInputRef.current?.click()} className="border-stroke text-white hover:bg-dark gap-2">
                <Upload className="w-4 h-4" />
                Upload CV
              </Button>
              {(profile.cvFile || pendingFiles.cvFile) && (
                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveFile('cvFile')} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-text">PDF format only.</p>
            <input ref={cvInputRef} type="file" accept="application/pdf" onChange={handleCvUpload} className="hidden" />
          </div>
        </div>
      </Card>
      </FilterableCard>

      {/* Logo */}
      <FilterableCard category="Media" title="Logo" searchQuery={searchQuery} activeFilter={activeFilter}>
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
              <Button type="button" variant="outline" size="sm" onClick={() => logoInputRef.current?.click()} className="border-stroke text-white hover:bg-dark gap-2">
                <Camera className="w-4 h-4" />
                Upload Logo
              </Button>
              {(profile.logoUrl || pendingFiles.logoUrl) && (
                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveFile(profile.logoUrl, 'logoUrl')} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-text">Recommended: Square PNG with transparent background, min 200×200px.</p>
            <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </div>
        </div>
      </Card>
      </FilterableCard>

      {/* Personal Information */}
      <FilterableCard category="Personal" title="Personal Information" searchQuery={searchQuery} activeFilter={activeFilter}>
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
      </FilterableCard>

      {/* About Text */}
      <FilterableCard category="Personal" title="About" searchQuery={searchQuery} activeFilter={activeFilter}>
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">About</h3>
        <div className="space-y-2">
          <Label className="text-sm text-white">About Text</Label>
          <Textarea value={profile.aboutText} onChange={(e) => updateField('aboutText', e.target.value)} className="bg-dark border-stroke text-white placeholder:text-muted-text min-h-[200px]" placeholder="Tell visitors about yourself..." />
          <p className="text-xs text-muted-text">This appears on the About section of your portfolio.</p>
        </div>
      </Card>
      </FilterableCard>

      {/* About Cards */}
      <FilterableCard category="Personal" title="About Cards" searchQuery={searchQuery} activeFilter={activeFilter}>
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
      </FilterableCard>

      {/* Featured Projects Section */}
      <FilterableCard category="Pages" title="Featured Projects Section" searchQuery={searchQuery} activeFilter={activeFilter}>
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
      </FilterableCard>

      {/* Footer Bio */}
      <FilterableCard category="Footer" title="Footer" searchQuery={searchQuery} activeFilter={activeFilter}>
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Footer</h3>
        <div className="space-y-2">
          <Label className="text-sm text-white">Footer Bio</Label>
          <Textarea value={profile.footerBio} onChange={(e) => updateField('footerBio', e.target.value)} className="bg-dark border-stroke text-white placeholder:text-muted-text min-h-[100px]" placeholder="A short bio or tagline that appears in the footer..." />
          <p className="text-xs text-muted-text">This appears in the footer section of your website.</p>
        </div>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-white">Copyright Text</Label>
            <Input
              value={profile.footerCopyright}
              onChange={(e) => updateField('footerCopyright', e.target.value)}
              className="bg-dark border-stroke text-white placeholder:text-muted-text"
              placeholder="© 2026 ABDELLAH AIT-SI. All rights reserved."
            />
            <p className="text-xs text-muted-text">Leave empty to use the default: © {new Date().getFullYear()} {profile.fullName}. All rights reserved.</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-white">Credit Text</Label>
            <Input
              value={profile.footerCredit}
              onChange={(e) => updateField('footerCredit', e.target.value)}
              className="bg-dark border-stroke text-white placeholder:text-muted-text"
              placeholder="Designed & Built by CodeVirtox"
            />
            <p className="text-xs text-muted-text">Leave empty to use the default: Designed & Built by {profile.brandName}.</p>
          </div>
        </div>
      </Card>
      </FilterableCard>

      {/* Achievement Stats */}
      <FilterableCard category="Personal" title="Achievement Stats" searchQuery={searchQuery} activeFilter={activeFilter}>
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
      </FilterableCard>

      {/* Projects Page Section */}
      <FilterableCard category="Pages" title="Projects Page" searchQuery={searchQuery} activeFilter={activeFilter}>
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Projects Page</h3>
        <p className="text-xs text-muted-text mb-4">Edit the heading and description of the Projects section on your portfolio.</p>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-white">Section Title</Label>
            <Input
              value={profile.projectsPageTitle}
              onChange={(e) => updateField('projectsPageTitle', e.target.value)}
              className="bg-dark border-stroke text-white placeholder:text-muted-text"
              placeholder="Selected Projects"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-white">Section Description</Label>
            <Textarea
              value={profile.projectsPageDescription}
              onChange={(e) => updateField('projectsPageDescription', e.target.value)}
              className="bg-dark border-stroke text-white placeholder:text-muted-text min-h-[100px]"
              placeholder="A selection of projects showcasing..."
            />
          </div>
        </div>
      </Card>
      </FilterableCard>

      {/* Certificates Page Section */}
      <FilterableCard category="Pages" title="Certificates Page" searchQuery={searchQuery} activeFilter={activeFilter}>
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Certificates Page</h3>
        <p className="text-xs text-muted-text mb-4">Edit the heading and description of the Certificates section on your portfolio.</p>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-white">Section Title</Label>
            <Input
              value={profile.certificatesPageTitle}
              onChange={(e) => updateField('certificatesPageTitle', e.target.value)}
              className="bg-dark border-stroke text-white placeholder:text-muted-text"
              placeholder="Certificates & Credentials"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-white">Section Description</Label>
            <Textarea
              value={profile.certificatesPageDescription}
              onChange={(e) => updateField('certificatesPageDescription', e.target.value)}
              className="bg-dark border-stroke text-white placeholder:text-muted-text min-h-[100px]"
              placeholder="A collection of certifications..."
            />
          </div>
        </div>
      </Card>
      </FilterableCard>

      {/* Education Page Section */}
      <FilterableCard category="Pages" title="Education Page" searchQuery={searchQuery} activeFilter={activeFilter}>
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Education Page</h3>
        <p className="text-xs text-muted-text mb-4">Edit the heading and description of the Education section on your portfolio.</p>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-white">Section Title</Label>
            <Input
              value={profile.educationPageTitle}
              onChange={(e) => updateField('educationPageTitle', e.target.value)}
              className="bg-dark border-stroke text-white placeholder:text-muted-text"
              placeholder="My Educational Journey"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-white">Section Description</Label>
            <Textarea
              value={profile.educationPageDescription}
              onChange={(e) => updateField('educationPageDescription', e.target.value)}
              className="bg-dark border-stroke text-white placeholder:text-muted-text min-h-[100px]"
              placeholder="My academic background..."
            />
          </div>
        </div>
      </Card>
      </FilterableCard>

      {/* Resume Page Section */}
      <FilterableCard category="Pages" title="Resume Page" searchQuery={searchQuery} activeFilter={activeFilter}>
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Resume Page</h3>
        <p className="text-xs text-muted-text mb-4">Edit the texts displayed in the Resume section of your portfolio.</p>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-white">Resume Intro</Label>
            <Textarea
              value={profile.resumeIntro}
              onChange={(e) => updateField('resumeIntro', e.target.value)}
              className="bg-dark border-stroke text-white placeholder:text-muted-text min-h-[100px]"
              placeholder="Full-stack developer with hands-on experience..."
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-white">Technologies Section Title</Label>
            <Input
              value={profile.resumeTechTitle}
              onChange={(e) => updateField('resumeTechTitle', e.target.value)}
              className="bg-dark border-stroke text-white placeholder:text-muted-text"
              placeholder="Technologies I work with"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-white">Experience Section Title</Label>
            <Input
              value={profile.resumeExpTitle}
              onChange={(e) => updateField('resumeExpTitle', e.target.value)}
              className="bg-dark border-stroke text-white placeholder:text-muted-text"
              placeholder="Experience & Projects"
            />
          </div>
        </div>
      </Card>
      </FilterableCard>

      {/* Contact Page Section */}
      <FilterableCard category="Pages" title="Contact Page" searchQuery={searchQuery} activeFilter={activeFilter}>
      <Card className="bg-surface border-stroke p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Contact Page</h3>
        <p className="text-xs text-muted-text mb-4">Edit the heading and description of the Contact section on your portfolio.</p>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-white">Section Title</Label>
            <Input
              value={profile.contactPageTitle}
              onChange={(e) => updateField('contactPageTitle', e.target.value)}
              className="bg-dark border-stroke text-white placeholder:text-muted-text"
              placeholder="Let's Build Something Great Together."
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-white">Section Description</Label>
            <Textarea
              value={profile.contactPageDescription}
              onChange={(e) => updateField('contactPageDescription', e.target.value)}
              className="bg-dark border-stroke text-white placeholder:text-muted-text min-h-[100px]"
              placeholder="Have a project, a role, or just want to connect?..."
            />
          </div>
        </div>
      </Card>
      </FilterableCard>

      {/* Social Links */}
      <FilterableCard category="Social" title="Social Links" searchQuery={searchQuery} activeFilter={activeFilter}>
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
      </FilterableCard>

      {/* SMTP Configuration */}
      <FilterableCard category="All" title="SMTP Configuration" searchQuery={searchQuery} activeFilter={activeFilter}>
      <Card className="bg-surface border-stroke p-6">
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-4 h-4 text-brand" />
          <h3 className="text-sm font-semibold text-white">SMTP Configuration</h3>
        </div>
        <p className="text-xs text-muted-text mb-6">Configure your SMTP server to send emails for contact notifications and admin alerts.</p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-white/70">SMTP Host</Label>
              <Input
                value={smtpSettings.smtpHost}
                onChange={(e) => setSmtpSettings((prev) => ({ ...prev, smtpHost: e.target.value }))}
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="smtp.gmail.com"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-white/70">SMTP Port</Label>
              <Input
                type="number"
                value={smtpSettings.smtpPort}
                onChange={(e) => setSmtpSettings((prev) => ({ ...prev, smtpPort: parseInt(e.target.value) || 587 }))}
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="587"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-white/70">SMTP Username</Label>
              <Input
                value={smtpSettings.smtpUser}
                onChange={(e) => setSmtpSettings((prev) => ({ ...prev, smtpUser: e.target.value }))}
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder="user@gmail.com"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-white/70">SMTP Password</Label>
              <Input
                type="password"
                value={smtpSettings.smtpPass}
                onChange={(e) => setSmtpSettings((prev) => ({ ...prev, smtpPass: e.target.value }))}
                className="bg-dark border-stroke text-white placeholder:text-muted-text"
                placeholder={smtpSettings.hasPassword ? '••••••••••••' : 'Enter new password'}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={smtpSettings.smtpSecure}
              onCheckedChange={(checked) => setSmtpSettings((prev) => ({ ...prev, smtpSecure: checked }))}
            />
            <Label className="text-sm text-white">Use Secure Connection (TLS/SSL)</Label>
          </div>
          <div className="border-t border-stroke/30 pt-4">
            <p className="text-xs text-muted-text mb-4">Email identity settings</p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-white/70">From Name</Label>
                  <Input
                    value={smtpSettings.fromName}
                    onChange={(e) => setSmtpSettings((prev) => ({ ...prev, fromName: e.target.value }))}
                    className="bg-dark border-stroke text-white placeholder:text-muted-text"
                    placeholder="CodeVirtox Portfolio"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-white/70">From Email</Label>
                  <Input
                    value={smtpSettings.fromEmail}
                    onChange={(e) => setSmtpSettings((prev) => ({ ...prev, fromEmail: e.target.value }))}
                    className="bg-dark border-stroke text-white placeholder:text-muted-text"
                    placeholder="noreply@codevirtox.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-white/70">Reply-To Email</Label>
                  <Input
                    value={smtpSettings.replyToEmail}
                    onChange={(e) => setSmtpSettings((prev) => ({ ...prev, replyToEmail: e.target.value }))}
                    className="bg-dark border-stroke text-white placeholder:text-muted-text"
                    placeholder="reply@codevirtox.com"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-white/70">Contact Receiver Email</Label>
                  <Input
                    value={smtpSettings.contactReceiverEmail}
                    onChange={(e) => setSmtpSettings((prev) => ({ ...prev, contactReceiverEmail: e.target.value }))}
                    className="bg-dark border-stroke text-white placeholder:text-muted-text"
                    placeholder="admin@codevirtox.com"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSaveSmtp}
              disabled={savingSmtp}
              className="bg-brand hover:bg-brand-light text-white gap-2 disabled:opacity-40"
            >
              {savingSmtp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save SMTP Settings
            </Button>
            <Button
              onClick={handleSendTestEmail}
              disabled={sendingTest}
              variant="outline"
              className="border-stroke text-white hover:bg-dark gap-2 disabled:opacity-40"
            >
              {sendingTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send Test Email
            </Button>
          </div>
        </div>
      </Card>
      </FilterableCard>

      {/* Email Notifications */}
      <FilterableCard category="All" title="Email Notifications" searchQuery={searchQuery} activeFilter={activeFilter}>
      <Card className="bg-surface border-stroke p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-brand" />
          <h3 className="text-sm font-semibold text-white">Email Notifications</h3>
        </div>
        <p className="text-xs text-muted-text mb-6">Choose which events trigger email notifications. SMTP must be configured above.</p>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm text-white">Contact Form Notifications</Label>
              <p className="text-xs text-muted-text">Receive an email whenever someone submits the contact form.</p>
            </div>
            <Switch
              checked={notifSettings.contactEmailEnabled}
              onCheckedChange={(checked) => setNotifSettings((prev) => ({ ...prev, contactEmailEnabled: checked }))}
            />
          </div>
          <div className="border-t border-stroke/30" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm text-white">Admin Login Notifications</Label>
              <p className="text-xs text-muted-text">Receive an email whenever an admin successfully logs in.</p>
            </div>
            <Switch
              checked={notifSettings.adminLoginEmailEnabled}
              onCheckedChange={(checked) => setNotifSettings((prev) => ({ ...prev, adminLoginEmailEnabled: checked }))}
            />
          </div>
        </div>
        <div className="pt-4">
          <Button
            onClick={handleSaveNotif}
            disabled={savingNotif}
            className="bg-brand hover:bg-brand-light text-white gap-2 disabled:opacity-40"
          >
            {savingNotif ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Notifications
          </Button>
        </div>
      </Card>
      </FilterableCard>

      {/* Empty state when no cards match */}
      {!hasVisibleCards() && (
        <div className="text-center py-16">
          <p className="text-muted-text mb-2">No settings match your search.</p>
          <button onClick={() => { setSearchQuery(''); setActiveFilter('All'); }} className="text-xs text-brand hover:underline">
            Clear filters
          </button>
        </div>
      )}

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
