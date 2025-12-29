import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { 
  EllipsisVertical, 
  TrendingUp, 
  FolderPlus, 
  Clock, 
  ArrowRight,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Calendar,
  Zap,
  FileText,
  Settings,
  PlusCircle,
  Activity,
  Target,
  TrendingDown,
  Shield,
  HelpCircle,
  Eye,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { motion } from 'motion/react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const summaryCards = [
    {
      title: 'Active Projects',
      value: '12',
      trend: '+2 this week',
      trendDirection: 'up',
      icon: FolderPlus,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Pending Projects',
      value: '5',
      trend: '3 awaiting review',
      trendDirection: 'stable',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Monthly Burn Rate',
      value: '€52,400',
      trend: '-5% vs. last month',
      trendDirection: 'down',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  const recentProjects = [
    {
      id: 1,
      name: 'E-Commerce Platform Rebuild',
      client: 'RetailCo Inc.',
      status: 'active',
      date: '2025-12-15',
      startDate: '2025-12-15',
      budget: '€85,000',
      spent: '€42,500',
      scenario: 'Realistic',
      utilization: 82,
      risk: 'low',
      duration: '6 months',
      teamSize: 5,
      progress: 50,
    },
    {
      id: 2,
      name: 'Mobile App - iOS & Android',
      client: 'TechStart Ltd.',
      status: 'draft',
      date: '2025-12-20',
      startDate: '2025-12-20',
      budget: '€120,000',
      spent: '€0',
      scenario: 'Pessimistic',
      utilization: 95,
      risk: 'high',
      duration: '8 months',
      teamSize: 8,
      progress: 0,
    },
    {
      id: 3,
      name: 'API Integration Service',
      client: 'DataFlow Systems',
      status: 'completed',
      date: '2025-12-10',
      startDate: '2025-09-10',
      budget: '€42,000',
      spent: '€38,500',
      scenario: 'Optimistic',
      utilization: 68,
      risk: 'low',
      duration: '3 months',
      teamSize: 3,
      progress: 100,
    },
    {
      id: 4,
      name: 'Dashboard Analytics Tool',
      client: 'Analytics Pro',
      status: 'active',
      date: '2025-12-18',
      startDate: '2025-12-18',
      budget: '€55,000',
      spent: '€27,500',
      scenario: 'Realistic',
      utilization: 76,
      risk: 'medium',
      duration: '4 months',
      teamSize: 4,
      progress: 50,
    },
  ];

  // Budget trend data (last 6 months)
  const budgetTrendData = [
    { month: 'Jul', budget: 380000, actual: 365000 },
    { month: 'Aug', budget: 395000, actual: 385000 },
    { month: 'Sep', budget: 410000, actual: 425000 },
    { month: 'Oct', budget: 425000, actual: 415000 },
    { month: 'Nov', budget: 440000, actual: 435000 },
    { month: 'Dec', budget: 455000, actual: 428500 },
  ];

  // Cost scenarios comparison
  const costScenariosData = [
    { scenario: 'Optimistic', cost: 285000, fill: '#10B981' },
    { scenario: 'Realistic', cost: 356250, fill: '#4F46E5' },
    { scenario: 'Pessimistic', cost: 370500, fill: '#EF4444' },
  ];

  // Team utilization by role
  const teamUtilizationData = [
    { role: 'Frontend Dev', utilization: 85, color: '#3B82F6' },
    { role: 'Backend Dev', utilization: 92, color: '#10B981' },
    { role: 'Designer', utilization: 68, color: '#EC4899' },
    { role: 'DevOps', utilization: 75, color: '#F59E0B' },
    { role: 'QA', utilization: 71, color: '#8B5CF6' },
  ];

  // Top resources by cost
  const topResourcesData = [
    { name: 'Senior Backend Dev', count: 3, cost: 48000, color: '#4F46E5' },
    { name: 'Frontend Developer', count: 5, cost: 42000, color: '#3B82F6' },
    { name: 'UI/UX Designer', count: 2, cost: 28000, color: '#EC4899' },
    { name: 'DevOps Engineer', count: 2, cost: 26000, color: '#F59E0B' },
  ];

  // Recent activity timeline
  const recentActivities = [
    { id: 1, action: 'Project Created', project: 'CRM System Upgrade', time: '2 hours ago', icon: PlusCircle, color: 'text-green-600' },
    { id: 2, action: 'Budget Approved', project: 'E-Commerce Platform', time: '5 hours ago', icon: CheckCircle2, color: 'text-indigo-600' },
    { id: 3, action: 'Risk Alert', project: 'Mobile App - iOS & Android', time: '1 day ago', icon: AlertTriangle, color: 'text-amber-600' },
    { id: 4, action: 'Report Generated', project: 'API Integration Service', time: '2 days ago', icon: FileText, color: 'text-blue-600' },
  ];

  // Risk alerts
  const riskAlerts = recentProjects.filter(p => p.risk === 'high' || p.utilization > 90);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
      case 'draft':
        return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">Draft</Badge>;
      case 'completed':
        return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Completed</Badge>;
      default:
        return null;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">High Risk</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Medium Risk</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Low Risk</Badge>;
      default:
        return null;
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 90) return 'text-red-600';
    if (utilization > 80) return 'text-amber-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Header with Quick Actions */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-slate-900 mb-1">Welcome back, John</h1>
          <p className="text-slate-500">Here's what's happening with your projects today.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => onNavigate('new-project')} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
            <PlusCircle className="w-4 h-4" />
            New Project
          </Button>
          <Button variant="outline" onClick={() => onNavigate('employees')} className="gap-2">
            <Users className="w-4 h-4" />
            Manage Team
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-slate-500">{card.title}</CardTitle>
                  <div className={`${card.bgColor} p-2 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-slate-900 mb-1">{card.value}</div>
                  <div className="flex items-center gap-1">
                    {card.trendDirection === 'up' && <TrendingUp className="w-3 h-3 text-green-600" />}
                    {card.trendDirection === 'down' && <TrendingDown className="w-3 h-3 text-green-600" />}
                    {card.trendDirection === 'stable' && <Activity className="w-3 h-3 text-blue-600" />}
                    <p className="text-slate-500 text-sm">{card.trend}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Team Utilization & Top Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Utilization */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-900">Team Utilization by Role</CardTitle>
                <p className="text-slate-500 text-sm mt-1">Current allocation across all projects</p>
              </div>
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                      <HelpCircle className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-slate-900">Nasıl Hesaplanır?</DialogTitle>
                      <DialogDescription>
                        Team utilization hesaplama yöntemi
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      {/* Formula */}
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                        <div className="font-mono text-indigo-700 text-center py-2 bg-white rounded">
                          (Atanan Saat / Toplam Kapasite) × 100
                        </div>
                      </div>

                      {/* Standard */}
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-slate-900 font-medium mb-2 text-sm">Standart Kapasite</p>
                        <div className="space-y-1 text-sm text-slate-700">
                          <div className="flex justify-between">
                            <span>1 Ay</span>
                            <span className="font-mono">20 gün × 8 saat = 160 saat</span>
                          </div>
                        </div>
                      </div>

                      {/* Example */}
                      <div className="border border-slate-200 rounded-lg p-3">
                        <p className="text-slate-900 font-medium mb-2 text-sm">Örnek</p>
                        <div className="space-y-2 text-sm">
                          <div className="bg-blue-50 p-2 rounded text-slate-700">
                            3 Frontend Dev × 160 saat = <span className="font-bold">480 saat</span> (Toplam Kapasite)
                          </div>
                          <div className="bg-green-50 p-2 rounded text-slate-700">
                            Aktif projelere atanan = <span className="font-bold">408 saat</span>
                          </div>
                          <div className="bg-indigo-50 p-2 rounded text-center">
                            <span className="font-mono text-indigo-700">
                              (408 / 480) × 100 = <span className="font-bold text-lg">85%</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Range */}
                      <div>
                        <p className="text-slate-900 font-medium mb-2 text-sm">Optimal Aralık</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-sm p-2 bg-green-50 rounded">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-slate-700"><span className="font-semibold">70-85%</span> İdeal</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm p-2 bg-amber-50 rounded">
                            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <span className="text-slate-700"><span className="font-semibold">85-95%</span> Yüksek</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm p-2 bg-red-50 rounded">
                            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            <span className="text-slate-700"><span className="font-semibold">95%+</span> Kritik</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Target className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamUtilizationData.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-700 font-medium">{item.role}</span>
                  <span className={`font-mono ${getUtilizationColor(item.utilization)}`}>
                    {item.utilization}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.utilization}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Optimal range: 70-85%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Resources by Cost */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-900">Top Resources by Cost</CardTitle>
                <p className="text-slate-500 text-sm mt-1">Monthly cost breakdown</p>
              </div>
              <DollarSign className="w-5 h-5 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {topResourcesData.map((item, index) => (
              <motion.div
                key={index}
                className="bg-slate-50 rounded-lg p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-900 font-medium">{item.name}</span>
                  </div>
                  <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200">
                    {item.count} member{item.count > 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-indigo-600 font-mono font-bold text-xl">
                    €{item.cost.toLocaleString()}
                  </span>
                  <span className="text-slate-500 text-sm">/month total</span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-900">Recent Projects</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-indigo-600 hover:text-indigo-700"
              onClick={() => onNavigate('all-projects')}
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-slate-500">Project</th>
                  <th className="text-left py-3 px-4 text-slate-500">Status</th>
                  <th className="text-left py-3 px-4 text-slate-500">Budget / Spent</th>
                  <th className="text-left py-3 px-4 text-slate-500">Duration</th>
                  <th className="text-left py-3 px-4 text-slate-500">Start Date</th>
                  <th className="text-left py-3 px-4 text-slate-500">Progress</th>
                  <th className="text-right py-3 px-4 text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-slate-900 font-medium">{project.name}</p>
                        <p className="text-slate-500 text-xs">{project.client}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(project.status)}</td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-slate-900 font-mono text-sm">{project.budget}</p>
                        <p className="text-slate-500 font-mono text-xs">{project.spent} spent</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-slate-600 text-sm">
                        <Calendar className="w-3 h-3" />
                        <span>{project.duration}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-slate-600 text-sm">
                        {new Date(project.startDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden max-w-[80px]">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-slate-600 text-xs font-mono">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <EllipsisVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onNavigate('results')}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}