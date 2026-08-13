'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FolderOpen,
  Award,
  Code2,
  Mail,
  Plus,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface Stats {
  projectsCount: number;
  certificatesCount: number;
  skillsCount: number;
  unreadMessages: number;
  recentProjects: Array<{
    id: string;
    title: string;
    slug: string;
    featured: boolean;
    createdAt: string;
  }>;
  recentMessages: Array<{
    id: string;
    name: string;
    subject: string;
    message: string;
    read: boolean;
    createdAt: string;
  }>;
}

const statCards = [
  { key: 'projectsCount' as const, label: 'Total Projects', icon: FolderOpen, href: '/dashboard/projects' },
  { key: 'certificatesCount' as const, label: 'Total Certificates', icon: Award, href: '/dashboard/certificates' },
  { key: 'skillsCount' as const, label: 'Total Skills', icon: Code2, href: '/dashboard/skills' },
  { key: 'unreadMessages' as const, label: 'Unread Messages', icon: Mail, href: '/dashboard/messages' },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) setStats(await res.json());
      } catch {
        // Silently handle
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.key} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}>
            <Link href={card.href}>
              <Card className="bg-surface border-stroke hover:border-brand/30 transition-colors p-5 cursor-pointer group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                    <card.icon className="w-5 h-5 text-brand" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-text opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {loading ? (
                  <Skeleton className="h-8 w-16 bg-dark" />
                ) : (
                  <p className="text-2xl font-bold text-white">{stats?.[card.key] ?? 0}</p>
                )}
                <p className="text-sm text-muted-text mt-1">{card.label}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.3 }}>
          <Card className="bg-surface border-stroke">
            <div className="flex items-center justify-between p-5 pb-3">
              <h2 className="text-base font-semibold text-white">Recent Projects</h2>
              <Link href="/dashboard/projects">
                <Button variant="ghost" size="sm" className="text-brand text-xs hover:bg-brand/10 gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
            <div className="px-5 pb-5">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full bg-dark rounded-lg" />
                  ))}
                </div>
              ) : stats?.recentProjects && stats.recentProjects.length > 0 ? (
                <div className="space-y-2">
                  {stats.recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-dark/50 hover:bg-dark transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white truncate">{project.title}</p>
                          {project.featured && (
                            <Badge className="bg-brand/10 text-brand text-[10px] px-1.5 py-0 border-0 flex-shrink-0">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-text mt-0.5">
                          {format(new Date(project.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-text text-center py-8">No projects yet</p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Recent Messages */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.4 }}>
          <Card className="bg-surface border-stroke">
            <div className="flex items-center justify-between p-5 pb-3">
              <h2 className="text-base font-semibold text-white">Recent Messages</h2>
              <Link href="/dashboard/messages">
                <Button variant="ghost" size="sm" className="text-brand text-xs hover:bg-brand/10 gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
            <div className="px-5 pb-5">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full bg-dark rounded-lg" />
                  ))}
                </div>
              ) : stats?.recentMessages && stats.recentMessages.length > 0 ? (
                <div className="space-y-2">
                  {stats.recentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-dark/50 hover:bg-dark transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!msg.read ? 'bg-brand' : 'bg-stroke'}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm font-medium truncate ${!msg.read ? 'text-white' : 'text-muted-text'}`}>
                            {msg.name}
                          </p>
                          <span className="text-[11px] text-muted-text flex-shrink-0">
                            {format(new Date(msg.createdAt), 'MMM d')}
                          </span>
                        </div>
                        <p className="text-xs text-muted-text font-medium truncate">{msg.subject}</p>
                        <p className="text-xs text-muted-text truncate mt-0.5">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-text text-center py-8">No messages yet</p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.5 }}>
        <Card className="bg-surface border-stroke p-5">
          <h2 className="text-base font-semibold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/projects">
              <Button variant="outline" className="border-stroke text-white hover:bg-brand/10 hover:border-brand/30 hover:text-brand gap-2">
                <Plus className="w-4 h-4" /> Add Project
              </Button>
            </Link>
            <Link href="/dashboard/certificates">
              <Button variant="outline" className="border-stroke text-white hover:bg-brand/10 hover:border-brand/30 hover:text-brand gap-2">
                <Plus className="w-4 h-4" /> Add Certificate
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="border-stroke text-white hover:bg-brand/10 hover:border-brand/30 hover:text-brand gap-2">
                <Plus className="w-4 h-4" /> Update Profile
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
