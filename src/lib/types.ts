export interface Profile {
  id: string;
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
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  logoUrl: string;
  profileImage: string;
  cvFile: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  technologies: string; // JSON string
  startDate: string;
  endDate: string;
  location: string;
  projectImage: string;
  githubUrl: string;
  liveDemoUrl: string;
  featured: boolean;
  displayOrder: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  skills: string; // JSON string
  certificateImage: string;
  credentialUrl: string;
  credentialId: string;
  category: string;
  displayOrder: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string;
  displayOrder: number;
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  year: string;
  displayOrder: number;
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  technologies: string; // JSON string
  startDate: string;
  endDate: string;
  location: string;
  displayOrder: number;
}

export interface Language {
  id: string;
  name: string;
  level: string;
  displayOrder: number;
}

export interface SoftSkill {
  id: string;
  name: string;
  icon: string;
  displayOrder: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}
