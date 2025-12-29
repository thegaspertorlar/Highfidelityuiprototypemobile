import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Search, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface AllProjectsProps {
  onNavigate: (view: string) => void;
  projects: Project[];
  onDeleteProject: (id: number) => void;
  onSelectProject: (project: Project) => void;
}

interface Project {
  id: number;
  name: string;
  client: string;
  status: 'active' | 'draft' | 'completed' | 'on-hold';
  budget: string;
  spent: string;
  scenario: string;
  startDate: string;
  endDate: string;
  duration: string;
  progress: number;
}

export function AllProjects({ projects: savedProjects, onSelectProject }: AllProjectsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects
  const filteredProjects = savedProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500';
      case 'draft':
        return 'bg-slate-400';
      case 'completed':
        return 'bg-blue-500';
      case 'on-hold':
        return 'bg-amber-500';
      default:
        return 'bg-slate-400';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-emerald-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  // Group projects by status
  const activeProjects = filteredProjects.filter(p => p.status === 'active');
  const otherProjects = filteredProjects.filter(p => p.status !== 'active');

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11 h-12 text-base border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
        />
      </div>

      {/* Active Projects */}
      {activeProjects.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-slate-900 font-semibold text-sm uppercase tracking-wide">
            Active Projects
          </h2>
          <div className="space-y-3">
            {activeProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-lg hover:border-indigo-200 transition-all active:scale-[0.98]"
                  onClick={() => onSelectProject(project)}
                >
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-center gap-4">
                      {/* Status indicator */}
                      <div className="shrink-0">
                        <div className={`w-12 h-12 rounded-xl ${getStatusColor(project.status)} flex items-center justify-center`}>
                          <span className="text-white font-bold text-lg">{project.progress}%</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-slate-900 font-semibold truncate mb-0.5">
                          {project.name}
                        </h3>
                        <p className="text-slate-500 text-sm truncate">{project.client}</p>
                        
                        {/* Progress bar */}
                        <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                          <div
                            className={`h-full rounded-full ${getProgressColor(project.progress)} transition-all`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-slate-900 font-semibold text-sm uppercase tracking-wide">
            Other Projects
          </h2>
          <div className="space-y-3">
            {otherProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (activeProjects.length + index) * 0.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-lg hover:border-slate-300 transition-all active:scale-[0.98]"
                  onClick={() => onSelectProject(project)}
                >
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-center gap-4">
                      {/* Status indicator */}
                      <div className="shrink-0">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-slate-900 font-medium truncate">
                            {project.name}
                          </h3>
                          <Badge
                            variant="secondary"
                            className="capitalize text-xs shrink-0"
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-slate-500 text-sm truncate">{project.client}</p>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">No projects found</p>
          <p className="text-slate-400 text-sm mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
