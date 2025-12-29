import { useState } from 'react';
import { Employees } from './components/employees';
import { AllProjects } from './components/all-projects';
import { ProjectDetail } from './components/project-detail';
import { Toaster } from './components/ui/toaster';
import { Users, FolderOpen, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SavedProject {
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
  teamMembers?: {
    id: number;
    name: string;
    avatar: string;
    role: string;
    allocation: number;
    rate: number;
  }[];
}

interface Employee {
  id: number;
  name: string;
  avatar: string;
  role: string;
  compensationType: 'hourly' | 'monthly';
  rate: number;
  techStack: string[];
  availability: 'available' | 'busy' | 'offline';
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<'projects' | 'employees'>('projects');
  const [selectedProject, setSelectedProject] = useState<SavedProject | null>(null);

  // Mock data - in real app, fetch from API
  const [savedProjects] = useState<SavedProject[]>([
    {
      id: 1,
      name: 'E-Commerce Platform',
      client: 'TechCorp Inc.',
      status: 'active',
      budget: '€120,000',
      spent: '€45,000',
      scenario: 'Realistic',
      startDate: '2024-01-15',
      endDate: '2024-07-15',
      duration: '6 months',
      progress: 38,
      teamMembers: [
        {
          id: 1,
          name: 'Sarah Johnson',
          avatar: 'SJ',
          role: 'Frontend Developer',
          allocation: 50,
          rate: 85,
        },
        {
          id: 2,
          name: 'Michael Chen',
          avatar: 'MC',
          role: 'Backend Developer',
          allocation: 50,
          rate: 90,
        },
      ],
    },
    {
      id: 2,
      name: 'Mobile Banking App',
      client: 'FinanceHub',
      status: 'active',
      budget: '€95,000',
      spent: '€82,000',
      scenario: 'Optimistic',
      startDate: '2023-11-01',
      endDate: '2024-05-01',
      duration: '6 months',
      progress: 86,
      teamMembers: [
        {
          id: 9,
          name: 'Olivia Garcia',
          avatar: 'OG',
          role: 'Mobile Developer',
          allocation: 80,
          rate: 87,
        },
        {
          id: 2,
          name: 'Michael Chen',
          avatar: 'MC',
          role: 'Backend Developer',
          allocation: 20,
          rate: 90,
        },
      ],
    },
    {
      id: 3,
      name: 'CRM Dashboard',
      client: 'SalesForce Pro',
      status: 'draft',
      budget: '€65,000',
      spent: '€0',
      scenario: 'Realistic',
      startDate: '2024-03-01',
      endDate: '2024-07-01',
      duration: '4 months',
      progress: 0,
    },
    {
      id: 4,
      name: 'Inventory Management',
      client: 'RetailChain Ltd.',
      status: 'completed',
      budget: '€78,000',
      spent: '€76,500',
      scenario: 'Pessimistic',
      startDate: '2023-09-01',
      endDate: '2024-01-01',
      duration: '4 months',
      progress: 100,
    },
    {
      id: 5,
      name: 'Healthcare Portal',
      client: 'MediCare Systems',
      status: 'on-hold',
      budget: '€145,000',
      spent: '€32,000',
      scenario: 'Realistic',
      startDate: '2024-02-01',
      endDate: '2024-10-01',
      duration: '8 months',
      progress: 22,
    },
  ]);

  const [employees] = useState<Employee[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'SJ',
      role: 'Frontend Developer',
      compensationType: 'hourly',
      rate: 85,
      techStack: ['React', 'TypeScript', 'Tailwind CSS'],
      availability: 'available',
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'MC',
      role: 'Backend Developer',
      compensationType: 'hourly',
      rate: 90,
      techStack: ['Node.js', 'Python', 'PostgreSQL'],
      availability: 'available',
    },
    {
      id: 3,
      name: 'Emma Williams',
      avatar: 'EW',
      role: 'Project Manager',
      compensationType: 'monthly',
      rate: 6000,
      techStack: ['Agile', 'Scrum', 'Jira'],
      availability: 'busy',
    },
    {
      id: 4,
      name: 'David Martinez',
      avatar: 'DM',
      role: 'Full Stack Developer',
      compensationType: 'hourly',
      rate: 88,
      techStack: ['React', 'Node.js', 'MongoDB'],
      availability: 'available',
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      avatar: 'LA',
      role: 'UI/UX Designer',
      compensationType: 'monthly',
      rate: 5500,
      techStack: ['Figma', 'Adobe XD', 'Sketch'],
      availability: 'available',
    },
    {
      id: 6,
      name: 'James Wilson',
      avatar: 'JW',
      role: 'DevOps Engineer',
      compensationType: 'hourly',
      rate: 92,
      techStack: ['Docker', 'Kubernetes', 'AWS'],
      availability: 'available',
    },
    {
      id: 7,
      name: 'Sophia Brown',
      avatar: 'SB',
      role: 'QA Engineer',
      compensationType: 'hourly',
      rate: 75,
      techStack: ['Selenium', 'Jest', 'Cypress'],
      availability: 'available',
    },
    {
      id: 8,
      name: 'Robert Taylor',
      avatar: 'RT',
      role: 'Product Manager',
      compensationType: 'monthly',
      rate: 6500,
      techStack: ['Agile', 'Product Management'],
      availability: 'busy',
    },
    {
      id: 9,
      name: 'Olivia Garcia',
      avatar: 'OG',
      role: 'Mobile Developer',
      compensationType: 'hourly',
      rate: 87,
      techStack: ['React Native', 'Swift', 'Kotlin'],
      availability: 'available',
    },
    {
      id: 10,
      name: 'William Lee',
      avatar: 'WL',
      role: 'Backend Developer',
      compensationType: 'monthly',
      rate: 5800,
      techStack: ['Java', 'Spring Boot', 'MySQL'],
      availability: 'offline',
    },
  ]);

  const handleBackFromProjectDetail = () => {
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Toaster />
      
      {/* Header */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 z-20 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.4 }}
            className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h1 className="text-slate-900 font-bold">EstiMate AI</h1>
            <p className="text-slate-500 text-xs">Project Insights</p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="px-6 pt-6 pb-6">
        <AnimatePresence mode="wait">
          {selectedProject ? (
            <ProjectDetail 
              key="project-detail"
              project={selectedProject} 
              onBack={handleBackFromProjectDetail} 
            />
          ) : (
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentTab === 'projects' ? (
                <AllProjects 
                  onNavigate={() => {}} 
                  projects={savedProjects} 
                  onDeleteProject={() => {}}
                  onSelectProject={setSelectedProject}
                />
              ) : (
                <Employees 
                  employees={employees} 
                  onUpdateEmployees={() => {}} 
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation - Hide when viewing project details */}
      <AnimatePresence>
        {!selectedProject && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-pb z-30"
          >
            <div className="flex items-stretch">
              <button
                onClick={() => setCurrentTab('projects')}
                className={`flex-1 flex flex-col items-center justify-center py-3 transition-all relative ${
                  currentTab === 'projects'
                    ? 'text-indigo-600'
                    : 'text-slate-400'
                }`}
              >
                {currentTab === 'projects' && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-indigo-600 rounded-b-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center"
                >
                  <FolderOpen className={`w-6 h-6 mb-1 ${currentTab === 'projects' ? 'stroke-[2.5]' : ''}`} />
                  <span className={`text-xs ${currentTab === 'projects' ? 'font-semibold' : 'font-medium'}`}>
                    Projects
                  </span>
                </motion.div>
              </button>
              
              <button
                onClick={() => setCurrentTab('employees')}
                className={`flex-1 flex flex-col items-center justify-center py-3 transition-all relative ${
                  currentTab === 'employees'
                    ? 'text-indigo-600'
                    : 'text-slate-400'
                }`}
              >
                {currentTab === 'employees' && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-indigo-600 rounded-b-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center"
                >
                  <Users className={`w-6 h-6 mb-1 ${currentTab === 'employees' ? 'stroke-[2.5]' : ''}`} />
                  <span className={`text-xs ${currentTab === 'employees' ? 'font-semibold' : 'font-medium'}`}>
                    Team
                  </span>
                </motion.div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}