'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Project, Certificate, Skill, Education, Experience, Language, SoftSkill, Profile, ContactMessage } from '@/lib/types';

interface DataContextType {
  profile: Profile | null;
  projects: Project[];
  certificates: Certificate[];
  skills: Skill[];
  education: Education[];
  experiences: Experience[];
  languages: Language[];
  softSkills: SoftSkill[];
  loading: boolean;
}

const DataContext = createContext<DataContextType>({
  profile: null,
  projects: [],
  certificates: [],
  skills: [],
  education: [],
  experiences: [],
  languages: [],
  softSkills: [],
  loading: true,
});

export function DataProvider({ children, initialData }: { children: ReactNode, initialData?: Partial<DataContextType> }) {
  const [profile, setProfile] = useState<Profile | null>(initialData?.profile || null);
  const [projects, setProjects] = useState<Project[]>(initialData?.projects || []);
  const [certificates, setCertificates] = useState<Certificate[]>(initialData?.certificates || []);
  const [skills, setSkills] = useState<Skill[]>(initialData?.skills || []);
  const [education, setEducation] = useState<Education[]>(initialData?.education || []);
  const [experiences, setExperiences] = useState<Experience[]>(initialData?.experiences || []);
  const [languages, setLanguages] = useState<Language[]>(initialData?.languages || []);
  const [softSkills, setSoftSkills] = useState<SoftSkill[]>(initialData?.softSkills || []);
  const [loading, setLoading] = useState(!initialData);

  const fetchData = useCallback(async () => {
    try {
      const [profileRes, projectsRes, certsRes, skillsRes, resumeRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/projects'),
        fetch('/api/certificates'),
        fetch('/api/skills'),
        fetch('/api/resume'),
      ]);

      const [profileData, projectsData, certsData, skillsData, resumeData] = await Promise.all([
        profileRes.json(),
        projectsRes.json(),
        certsRes.json(),
        skillsRes.json(),
        resumeRes.json(),
      ]);

      // Deduplicate by ID before setting state (safety net against DB duplicates)
      const uniqueById = <T extends { id?: string; title?: string; name?: string }>(items: T[]): T[] =>
        Array.from(new Map(items.map(item => [item.id || item.title || item.name || JSON.stringify(item), item])).values());

      setProfile(profileData);
      setProjects(uniqueById(projectsData));
      setCertificates(uniqueById(certsData));
      setSkills(uniqueById(skillsData));
      setEducation(uniqueById(resumeData.education || []));
      setExperiences(uniqueById(resumeData.experience || []));
      setLanguages(uniqueById(resumeData.languages || []));
      setSoftSkills(uniqueById(resumeData.softSkills || []));
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh when user switches back to this tab (e.g., after editing in dashboard)
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') fetchData();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [fetchData]);

  return (
    <DataContext.Provider value={{ profile, projects, certificates, skills, education, experiences, languages, softSkills, loading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}

// Contact message submission
export function useContactSubmit() {
  const submit = useCallback(async (data: { name: string; email: string; subject: string; message: string }) => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to send message');
    }
    return res.json();
  }, []);

  return submit;
}
