import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface TeamMember {
  id: number;
  name: string;
  avatar: string;
  role: string;
  allocation: number;
  rate: number;
}

interface ProjectDetailProps {
  project: {
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
    teamMembers?: TeamMember[];
  };
  onBack: () => void;
}

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState('budget');

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Calculate budget metrics
  const budgetNum = parseFloat(project.budget.replace(/[€,]/g, ''));
  const spentNum = parseFloat(project.spent.replace(/[€,]/g, ''));
  const budgetUsage = budgetNum > 0 ? Math.round((spentNum / budgetNum) * 100) : 0;
  const remaining = budgetNum - spentNum;

  // Budget breakdown data
  const teamSalariesPercent = 74;
  const toolsPercent = 7;
  const riskPercent = 19;

  const teamSalaries = Math.round((budgetNum * teamSalariesPercent) / 100);
  const tools = Math.round((budgetNum * toolsPercent) / 100);
  const risk = Math.round((budgetNum * riskPercent) / 100);

  const budgetBreakdown = [
    { name: 'Team Salaries', value: teamSalaries, percent: teamSalariesPercent, color: '#4F46E5' },
    { name: 'Tools & Vendors', value: tools, percent: toolsPercent, color: '#8B5CF6' },
    { name: 'Inefficiency/Risk Buffer', value: risk, percent: riskPercent, color: '#94A3B8' },
  ];

  // Team composition by role
  const getTeamComposition = () => {
    if (!project.teamMembers || project.teamMembers.length === 0) return [];
    
    const roleMap = new Map<string, { count: number; totalCost: number; color: string }>();
    const roleColors: { [key: string]: string } = {
      'Frontend Developer': '#3B82F6',
      'Backend Developer': '#10B981',
      'Mobile Developer': '#3B82F6',
      'Project Manager': '#8B5CF6',
      'Full Stack Developer': '#06B6D4',
      'DevOps Engineer': '#F59E0B',
      'UI/UX Designer': '#EC4899',
    };
    
    // Parse duration (e.g., "6 months" -> 6)
    const durationMonths = parseInt(project.duration.split(' ')[0]) || 6;
    
    project.teamMembers.forEach(member => {
      const existing = roleMap.get(member.role);
      // Calculate monthly cost: rate * allocation / 100
      const monthlyCost = (member.rate * member.allocation) / 100;
      const totalCost = monthlyCost * durationMonths;
      
      if (existing) {
        existing.count += 1;
        existing.totalCost += totalCost;
      } else {
        roleMap.set(member.role, {
          count: 1,
          totalCost: totalCost,
          color: roleColors[member.role] || '#64748B',
        });
      }
    });
    
    return Array.from(roleMap.entries()).map(([role, data]) => ({
      role,
      count: data.count,
      totalCost: data.totalCost,
      color: data.color,
    }));
  };

  const teamComposition = getTeamComposition();
  const durationMonths = parseInt(project.duration.split(' ')[0]) || 6;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0 mt-1"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-slate-900 font-bold mb-1">{project.name}</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-slate-500 text-sm">{project.client}</p>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)} animate-pulse`} />
              <span className="text-xs text-slate-600 capitalize font-medium">{project.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="bg-gradient-to-br from-indigo-50 via-white to-white border-indigo-100">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm text-slate-500">Overall Progress</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{project.progress}%</span>
                <Badge variant="outline" className="bg-white border-indigo-200 text-indigo-700 text-xs">
                  {project.scenario}
                </Badge>
              </div>
            </div>
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="none" className="text-slate-200" />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  className={getProgressColor(project.progress).replace('bg-', 'text-')}
                  initial={{ strokeDasharray: '0 201' }}
                  animate={{ strokeDasharray: `${(project.progress / 100) * 201} 201` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </svg>
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 mt-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 0.8 }}
              className={`h-full rounded-full ${getProgressColor(project.progress)}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-slate-100">
          <TabsTrigger value="budget" className="text-xs py-2">Budget</TabsTrigger>
          <TabsTrigger value="team" className="text-xs py-2">Team</TabsTrigger>
          <TabsTrigger value="timeline" className="text-xs py-2">Timeline</TabsTrigger>
        </TabsList>

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6 pb-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Total Budget</span>
                  <span className="font-mono font-bold text-slate-900">{project.budget}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Total Spent</span>
                  <span className="font-mono font-bold text-indigo-600">{project.spent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Remaining</span>
                  <span className="font-mono font-bold text-emerald-600">€{remaining.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Budget Usage</span>
                  <span className="font-semibold text-slate-700">{budgetUsage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${budgetUsage}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-full rounded-full ${
                      budgetUsage > 90 ? 'bg-rose-500' : budgetUsage > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget Breakdown */}
          <Card>
            <CardContent className="pt-6 pb-6">
              <div className="mb-4">
                <h3 className="text-slate-900 font-semibold">Budget Breakdown</h3>
                <p className="text-xs text-slate-500 mt-0.5">Where the money goes - {project.scenario} scenario</p>
              </div>
              
              {/* Donut Chart */}
              <div className="relative mb-4">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={budgetBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={2}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {budgetBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 10} className="fill-slate-500 text-xs">
                                  Total
                                </tspan>
                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 12} className="fill-slate-900 text-xl font-bold">
                                  {project.budget}
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                {budgetBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-slate-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{item.percent}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Composition */}
          {teamComposition.length > 0 && (
            <Card>
              <CardContent className="pt-6 pb-6">
                <div className="mb-4">
                  <h3 className="text-slate-900 font-semibold">Team Composition</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Total project cost by role ({durationMonths} months)</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-center">
                  {/* Pie Chart */}
                  <div className="w-48 h-48 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={teamComposition}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="totalCost"
                          startAngle={90}
                          endAngle={-270}
                        >
                          {teamComposition.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Role List */}
                  <div className="flex-1 space-y-3 w-full">
                    {teamComposition.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-slate-900 font-medium truncate">{item.role}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <Badge variant="secondary" className="text-xs">
                            {item.count} member{item.count > 1 ? 's' : ''}
                          </Badge>
                          <div className="text-right">
                            <div className="text-sm font-bold text-slate-900">
                              €{Math.round(item.totalCost).toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-500">Total for {durationMonths} months</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4 mt-4">
          {project.teamMembers && project.teamMembers.length > 0 ? (
            <Card>
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-900 font-semibold text-sm">Team Members</h3>
                  <Badge variant="outline">{project.teamMembers.length} Members</Badge>
                </div>
                <div className="space-y-3">
                  {project.teamMembers.map((member, idx) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
                        {member.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 text-sm truncate">{member.name}</div>
                        <div className="text-xs text-slate-500">{member.role}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-slate-500">Allocation</div>
                        <div className="font-semibold text-indigo-600 text-sm">{member.allocation}%</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No team members assigned yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6 pb-6 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="text-xs text-slate-500">Start Date</div>
                  <div className="font-semibold text-slate-900">{formatDate(project.startDate)}</div>
                </div>
                <Calendar className="w-5 h-5 text-slate-400" />
                <div className="space-y-1 text-right">
                  <div className="text-xs text-slate-500">End Date</div>
                  <div className="font-semibold text-slate-900">{formatDate(project.endDate)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 rounded-lg">
                <Clock className="w-5 h-5 text-indigo-600" />
                <div className="flex-1">
                  <div className="text-xs text-indigo-600">Total Duration</div>
                  <div className="font-semibold text-indigo-900">{project.duration}</div>
                </div>
              </div>

              {/* Visual Timeline */}
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-slate-500">Project Timeline</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1 }}
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                  <span>Started</span>
                  <span>{project.progress}% Complete</span>
                  <span>Expected End</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
