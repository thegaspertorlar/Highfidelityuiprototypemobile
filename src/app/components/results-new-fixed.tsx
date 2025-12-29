import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Alert, AlertDescription } from './ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Sparkles,
  Download,
  Share2,
  HelpCircle,
  AlertTriangle,
  TrendingUp,
  Shield,
  Zap,
  FileText,
  CheckCircle2,
  XCircle,
  Info,
  Calculator,
  Clock,
  Users as UsersIcon,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { useState } from 'react';
import { toast } from 'sonner';

interface ResultsProps {
  onNavigate: (view: string) => void;
  projectData: {
    features: Array<{
      id: number;
      name: string;
      complexity: 'Low' | 'Medium' | 'High';
      storyPoints: number;
    }>;
    teamMembers: Array<{
      id: number;
      name: string;
      role: string;
      compensationType: 'hourly' | 'monthly';
      costValue: number;
      allocationPercentage: number;
      computedMonthlyCost: number;
    }>;
    duration: number;
    projectName: string;
  } | null;
  onSaveProject: (scenario: 'Optimistic' | 'Realistic' | 'Pessimistic') => void;
}

export function ResultsNew({ onNavigate, projectData, onSaveProject }: ResultsProps) {
  const [selectedScenario, setSelectedScenario] = useState<'Optimistic' | 'Realistic' | 'Pessimistic'>('Realistic');

  if (!projectData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <XCircle className="w-16 h-16 text-slate-300" />
        <h2 className="text-slate-900">No Project Data Available</h2>
        <p className="text-slate-500">Please create a project first to see financial projections.</p>
        <Button onClick={() => onNavigate('new-project')} className="bg-indigo-600 hover:bg-indigo-700">
          Create New Project
        </Button>
      </div>
    );
  }

  // Resource-driven calculations
  const projectDuration = projectData.duration;
  const monthlyBurnRate = projectData.teamMembers.reduce((acc, member) => acc + member.computedMonthlyCost, 0);
  
  // Base cost (Optimistic): Raw capacity
  const baseCost = monthlyBurnRate * projectDuration;
  
  // Realistic: Efficiency adjusted (assumes 80% productive time - 20% overhead for meetings, leave, etc.)
  const realisticCost = baseCost * 1.25; // Divide by 0.8 = multiply by 1.25
  
  // Pessimistic: Risk loaded (+30% buffer for unknowns)
  const pessimisticCost = baseCost * 1.30;

  // Calculate total scope (story points)
  const totalStoryPoints = projectData.features.reduce((sum, f) => sum + f.storyPoints, 0);
  
  // Calculate capacity (total available hours)
  const totalCapacityHours = projectData.teamMembers.reduce((total, member) => {
    // Full month = 160 hours, apply allocation percentage
    const hoursPerMonth = 160 * (member.allocationPercentage / 100);
    const totalHours = hoursPerMonth * projectDuration;
    return total + totalHours;
  }, 0);

  // Estimate required effort (story points * 8 hours)
  const estimatedEffortHours = totalStoryPoints * 8;
  
  // Reality check: Is scope realistic for timeline?
  const utilizationRate = totalCapacityHours > 0 ? (estimatedEffortHours / totalCapacityHours) * 100 : 0;
  const isOverloaded = utilizationRate > 100;
  const isHighRisk = utilizationRate > 85;
  
  // Suggested duration based on scope
  const suggestedDuration = totalCapacityHours > 0 
    ? Math.ceil((estimatedEffortHours / (totalCapacityHours / projectDuration))) 
    : projectDuration;

  // Chart 1: Cost Comparison (Simple Bar Chart) - 3 scenarios side by side
  const costComparisonData = [
    { scenario: 'Optimistic', cost: baseCost, fill: '#10B981' },
    { scenario: 'Realistic', cost: realisticCost, fill: '#4F46E5' },
    { scenario: 'Pessimistic', cost: pessimisticCost, fill: '#EF4444' },
  ];

  // Chart 2: Budget Breakdown (Donut Chart) - Dynamic based on selected scenario
  const selectedCost = selectedScenario === 'Optimistic' ? baseCost : selectedScenario === 'Realistic' ? realisticCost : pessimisticCost;
  const selectedMultiplier = selectedScenario === 'Optimistic' ? 1.0 : selectedScenario === 'Realistic' ? 1.25 : 1.30;
  
  const teamSalariesCost = monthlyBurnRate * projectDuration;
  const toolsVendorsCost = teamSalariesCost * 0.10; // 10% of team cost
  const inefficiencyRiskCost = selectedCost - teamSalariesCost; // Buffer based on scenario
  
  const totalBudget = teamSalariesCost + toolsVendorsCost + inefficiencyRiskCost;
  
  const budgetBreakdownData = [
    { 
      name: 'Team Salaries', 
      value: teamSalariesCost, 
      color: '#4F46E5', 
      percentage: Math.round((teamSalariesCost / totalBudget) * 100) 
    },
    { 
      name: 'Tools & Vendors', 
      value: toolsVendorsCost, 
      color: '#8B5CF6', 
      percentage: Math.round((toolsVendorsCost / totalBudget) * 100) 
    },
    { 
      name: 'Inefficiency/Risk Buffer', 
      value: inefficiencyRiskCost, 
      color: '#9CA3AF', 
      percentage: Math.round((inefficiencyRiskCost / totalBudget) * 100) 
    },
  ];

  // Team composition data - Total project cost by role
  const teamCompositionByRole = projectData.teamMembers.reduce((acc: any[], member) => {
    const existing = acc.find((item) => item.name === member.role);
    const totalRoleCost = member.computedMonthlyCost * projectDuration; // Total cost for entire project
    
    if (existing) {
      existing.value += totalRoleCost;
      existing.count += 1;
    } else {
      acc.push({
        name: member.role,
        value: totalRoleCost, // Total cost, not count
        count: 1,
        color: getColorForRole(member.role),
      });
    }
    return acc;
  }, []);

  function getColorForRole(role: string): string {
    const colors: { [key: string]: string } = {
      'Frontend Developer': '#3B82F6',
      'Backend Developer': '#10B981',
      'Full Stack Developer': '#6366F1',
      'UI/UX Designer': '#EC4899',
      'DevOps Engineer': '#F59E0B',
      'Project Manager': '#8B5CF6',
      'QA Engineer': '#F97316',
      'Mobile Developer': '#06B6D4',
      'Data Engineer': '#14B8A6',
    };
    return colors[role] || '#64748B';
  }

  const handleSaveAsDraft = () => {
    onSaveProject(selectedScenario);
    toast.success('Project saved successfully!', {
      description: `"${projectData?.projectName}" has been saved as draft with ${selectedScenario} scenario.`,
    });
    setTimeout(() => {
      onNavigate('all-projects');
    }, 500);
  };

  return (
    <TooltipProvider>
      <div className="space-y-8 max-w-7xl pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-slate-900 mb-1">Financial Projections</h1>
            <p className="text-slate-500">{projectData.projectName}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={() => onNavigate('new-project')}>
              Adjust Parameters
            </Button>
            <Button onClick={handleSaveAsDraft} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
              Save as Draft
            </Button>
          </div>
        </div>

        {/* Reality Check Alert (AI Innovation) */}
        {(isOverloaded || isHighRisk) && (
          <Alert className={`border-2 ${isOverloaded ? 'border-red-300 bg-red-50' : 'border-amber-300 bg-amber-50'}`}>
            <div className="flex gap-4">
              <AlertTriangle className={`w-6 h-6 ${isOverloaded ? 'text-red-600' : 'text-amber-600'} flex-shrink-0`} />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold ${isOverloaded ? 'text-red-900' : 'text-amber-900'}`}>
                    ⚠️ AI Reality Check
                  </h3>
                  <Badge className={isOverloaded ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'}>
                    {utilizationRate.toFixed(0)}% Capacity Utilization
                  </Badge>
                </div>
                <AlertDescription className={isOverloaded ? 'text-red-800' : 'text-amber-800'}>
                  {isOverloaded ? (
                    <>
                      You allocated <strong>{projectDuration} months</strong>, but the scope ({totalStoryPoints} SP) requires approximately{' '}
                      <strong>{suggestedDuration} months</strong> for this team size. Consider adding{' '}
                      <strong>1 more Backend Developer</strong> or extending the timeline by{' '}
                      <strong>{suggestedDuration - projectDuration} month(s)</strong>.
                    </>
                  ) : (
                    <>
                      Your scope ({totalStoryPoints} SP) is achievable but tight for <strong>{projectDuration} months</strong>.{' '}
                      Team utilization is <strong>{utilizationRate.toFixed(0)}%</strong>. Consider adding a{' '}
                      <strong>15-20% time buffer</strong> to account for meetings, code reviews, and unexpected delays.
                    </>
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        {/* Project Scope Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Project Scope Summary
              </CardTitle>
              <Badge className="bg-indigo-100 text-indigo-700">
                {projectData.features.length} Features • {totalStoryPoints} SP Total
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">#</th>
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">Feature Name</th>
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">Complexity</th>
                    <th className="text-right py-3 px-4 text-slate-500 font-medium">Story Points</th>
                  </tr>
                </thead>
                <tbody>
                  {projectData.features.map((feature, index) => (
                    <tr key={feature.id} className="border-b border-slate-100">
                      <td className="py-3 px-4 text-slate-400 text-sm">{index + 1}</td>
                      <td className="py-3 px-4 text-slate-900">{feature.name}</td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            feature.complexity === 'Low'
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                              : feature.complexity === 'Medium'
                              ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                              : 'bg-rose-100 text-rose-700 hover:bg-rose-100'
                          }
                        >
                          {feature.complexity}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-mono text-slate-900">{feature.storyPoints}</span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-semibold">
                    <td colSpan={3} className="py-3 px-4 text-slate-900">Total</td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono text-indigo-600 text-lg">{totalStoryPoints}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-2 text-sm text-slate-500">
              <Info className="w-4 h-4" />
              <span>Features and estimates were defined in the project setup phase</span>
            </div>
          </CardContent>
        </Card>

        {/* Three-Scenario Cards (Centerpiece) */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-slate-900">Cost Scenarios</h2>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-4 h-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <p className="text-sm">
                  Three-point estimation based on PMI/COCOMO standards. Realistic scenario accounts for 20% overhead (meetings, leave, ramp-up).
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Optimistic Scenario */}
            <Card 
              className={`border-2 hover:shadow-xl transition-all duration-300 cursor-pointer ${
                selectedScenario === 'Optimistic' 
                  ? 'border-emerald-500 ring-4 ring-emerald-100 bg-emerald-50' 
                  : 'border-emerald-200 bg-white'
              }`}
              onClick={() => setSelectedScenario('Optimistic')}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Optimistic</Badge>
                    {selectedScenario === 'Optimistic' && (
                      <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Selected
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button 
                          onClick={(e) => e.stopPropagation()} 
                          className="p-1 hover:bg-emerald-100 rounded-full transition-colors"
                        >
                          <Info className="w-4 h-4 text-emerald-600" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-emerald-600">
                            <Zap className="w-6 h-6" />
                            Optimistic Scenario - Details
                          </DialogTitle>
                          <DialogDescription>
                            Best-case scenario assuming perfect conditions
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6 mt-4">
                          {/* Formula */}
                          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                            <div className="flex items-center gap-2 mb-3">
                              <Calculator className="w-5 h-5 text-emerald-600" />
                              <h3 className="font-semibold text-emerald-900">Calculation Formula</h3>
                            </div>
                            <div className="font-mono text-sm bg-white p-3 rounded border border-emerald-200">
                              <div>Base Cost = Monthly Burn Rate × Duration</div>
                              <div className="mt-2 text-emerald-600">€{baseCost.toLocaleString()} = €{monthlyBurnRate.toLocaleString()}/mo × {projectDuration} months</div>
                            </div>
                            <div className="mt-3 text-sm text-emerald-800">
                              <strong>Risk Buffer:</strong> 0% - No contingency added
                            </div>
                          </div>

                          {/* Included Factors */}
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              Included Factors
                            </h3>
                            <ul className="space-y-2 text-sm text-slate-700">
                              <li className="flex items-start gap-2">
                                <span className="text-emerald-600 mt-0.5">✓</span>
                                <span><strong>Team salaries</strong> at full allocation ({projectData.teamMembers.length} members)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-emerald-600 mt-0.5">✓</span>
                                <span><strong>100% productive time</strong> - assumes perfect efficiency</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-emerald-600 mt-0.5">✓</span>
                                <span><strong>Fixed scope</strong> - no changes or additions</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-emerald-600 mt-0.5">✓</span>
                                <span><strong>Ideal velocity</strong> - team performs at peak productivity</span>
                              </li>
                            </ul>
                          </div>

                          {/* Not Included */}
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                              <XCircle className="w-5 h-5 text-slate-400" />
                              Not Included
                            </h3>
                            <ul className="space-y-2 text-sm text-slate-600">
                              <li className="flex items-start gap-2">
                                <span className="text-slate-400 mt-0.5">✗</span>
                                <span>Meetings, stand-ups, retrospectives</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-slate-400 mt-0.5">✗</span>
                                <span>Code reviews and QA cycles</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-slate-400 mt-0.5">✗</span>
                                <span>Sick leave, vacations, holidays</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-slate-400 mt-0.5">✗</span>
                                <span>Onboarding time for new team members</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-slate-400 mt-0.5">✗</span>
                                <span>Scope creep or change requests</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-slate-400 mt-0.5">✗</span>
                                <span>Technical debt or refactoring</span>
                              </li>
                            </ul>
                          </div>

                          {/* When to Use */}
                          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <h3 className="font-semibold text-slate-900 mb-2">📌 When to Use This Scenario</h3>
                            <ul className="space-y-1.5 text-sm text-slate-700">
                              <li>• Internal baseline comparison</li>
                              <li>• Theoretical capacity planning</li>
                              <li>• Best-case budget proposals</li>
                              <li>• <strong className="text-amber-600">Not recommended</strong> for client contracts or actual budgeting</li>
                            </ul>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Zap className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <div className="text-emerald-600 font-mono text-3xl mb-1">
                    €{baseCost.toLocaleString()}
                  </div>
                  <p className="text-slate-500 text-sm">Raw Capacity</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-slate-600">
                  If everything goes perfectly. 100% productive time, no scope creep, ideal team velocity.
                </p>
                <div className="pt-3 border-t border-emerald-100 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Monthly Burn:</span>
                    <span className="font-mono">€{monthlyBurnRate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Duration:</span>
                    <span>{projectDuration} months</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Risk Factor:</span>
                    <span>0%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Realistic Scenario (Highlighted) */}
            <Card 
              className={`border-3 transition-all duration-300 relative cursor-pointer ${
                selectedScenario === 'Realistic' 
                  ? 'border-indigo-600 ring-4 ring-indigo-100 bg-indigo-50 hover:shadow-2xl' 
                  : 'border-indigo-400 bg-white hover:shadow-2xl'
              }`}
              onClick={() => setSelectedScenario('Realistic')}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-indigo-600 text-white hover:bg-indigo-600 shadow-lg">
                  ⭐ Recommended
                </Badge>
              </div>
              <CardHeader className="space-y-3 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600 text-white hover:bg-blue-600">Realistic</Badge>
                    {selectedScenario === 'Realistic' && (
                      <Badge className="bg-indigo-600 text-white hover:bg-indigo-600 gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Selected
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button 
                          onClick={(e) => e.stopPropagation()} 
                          className="p-1 hover:bg-indigo-100 rounded-full transition-colors"
                        >
                          <Info className="w-4 h-4 text-indigo-600" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-indigo-600">
                            <Shield className="w-6 h-6" />
                            Realistic Scenario - Details
                          </DialogTitle>
                          <DialogDescription>
                            Industry-standard scenario with 20% efficiency buffer
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6 mt-4">
                          {/* Formula */}
                          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                            <div className="flex items-center gap-2 mb-3">
                              <Calculator className="w-5 h-5 text-indigo-600" />
                              <h3 className="font-semibold text-indigo-900">Calculation Formula</h3>
                            </div>
                            <div className="font-mono text-sm bg-white p-3 rounded border border-indigo-200 space-y-2">
                              <div>Realistic Cost = Base Cost ÷ Efficiency Factor</div>
                              <div>Realistic Cost = Base Cost ÷ 0.80</div>
                              <div className="mt-2 text-indigo-600">€{realisticCost.toLocaleString()} = €{baseCost.toLocaleString()} × 1.25</div>
                            </div>
                            <div className="mt-3 text-sm text-indigo-800">
                              <strong>Risk Buffer:</strong> +20% (80% productive time assumed)
                            </div>
                            <div className="mt-2 text-xs text-indigo-600">
                              Based on PMI/COCOMO standards and industry best practices
                            </div>
                          </div>

                          {/* Included Factors */}
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                              Included Factors
                            </h3>
                            <ul className="space-y-2 text-sm text-slate-700">
                              <li className="flex items-start gap-2">
                                <span className="text-indigo-600 mt-0.5">✓</span>
                                <span><strong>Team salaries</strong> for {projectData.teamMembers.length} members</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-indigo-600 mt-0.5">✓</span>
                                <span><strong>Daily meetings</strong> (~10% time): stand-ups, planning, retrospectives</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-indigo-600 mt-0.5">✓</span>
                                <span><strong>Code reviews & QA</strong> (~5% time): peer review, testing cycles</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-indigo-600 mt-0.5">✓</span>
                                <span><strong>Leave & holidays</strong> (~3% time): vacation, sick leave</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-indigo-600 mt-0.5">✓</span>
                                <span><strong>Onboarding & ramp-up</strong> (~2% time): knowledge transfer</span>
                              </li>
                            </ul>
                          </div>

                          {/* Overhead Breakdown */}
                          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <h3 className="font-semibold text-slate-900 mb-3">20% Overhead Breakdown</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">Meetings & Ceremonies</span>
                                <span className="font-mono text-indigo-600">~10%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">Code Review & Testing</span>
                                <span className="font-mono text-indigo-600">~5%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">Leave & Time Off</span>
                                <span className="font-mono text-indigo-600">~3%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">Onboarding & Context Switching</span>
                                <span className="font-mono text-indigo-600">~2%</span>
                              </div>
                              <div className="flex justify-between items-center border-t border-slate-300 pt-2 mt-2">
                                <span className="text-slate-900 font-semibold">Total Overhead</span>
                                <span className="font-mono text-indigo-600 font-semibold">20%</span>
                              </div>
                            </div>
                          </div>

                          {/* When to Use */}
                          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                            <h3 className="font-semibold text-indigo-900 mb-2">⭐ When to Use This Scenario</h3>
                            <ul className="space-y-1.5 text-sm text-indigo-800">
                              <li>• <strong>Client proposals</strong> and contract negotiations</li>
                              <li>• <strong>Budget planning</strong> for stakeholders</li>
                              <li>• <strong>Resource allocation</strong> decisions</li>
                              <li>• <strong>Most projects</strong> - this is the recommended default</li>
                            </ul>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Shield className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <div className="text-indigo-600 font-mono text-3xl mb-1">
                    €{realisticCost.toLocaleString()}
                  </div>
                  <p className="text-slate-600 font-medium text-sm">Efficiency Adjusted (80%)</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-slate-700 font-medium">
                  Accounts for 20% overhead: meetings, code reviews, testing, onboarding, and typical inefficiencies.
                </p>
                <div className="pt-3 border-t border-indigo-200 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-700">
                    <span>Monthly Burn:</span>
                    <span className="font-mono">€{(monthlyBurnRate * 1.25).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Duration:</span>
                    <span>{projectDuration} months</span>
                  </div>
                  <div className="flex justify-between text-indigo-600 font-medium">
                    <span>Overhead Buffer:</span>
                    <span>+20%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pessimistic Scenario */}
            <Card 
              className={`border-2 hover:shadow-xl transition-all duration-300 cursor-pointer ${
                selectedScenario === 'Pessimistic' 
                  ? 'border-rose-500 ring-4 ring-rose-100 bg-rose-50' 
                  : 'border-rose-200 bg-white'
              }`}
              onClick={() => setSelectedScenario('Pessimistic')}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">Pessimistic</Badge>
                    {selectedScenario === 'Pessimistic' && (
                      <Badge className="bg-rose-600 text-white hover:bg-rose-600 gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Selected
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button 
                          onClick={(e) => e.stopPropagation()} 
                          className="p-1 hover:bg-rose-100 rounded-full transition-colors"
                        >
                          <Info className="w-4 h-4 text-rose-600" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-rose-600">
                            <AlertTriangle className="w-6 h-6" />
                            Pessimistic Scenario - Details
                          </DialogTitle>
                          <DialogDescription>
                            Worst-case scenario with 30% risk contingency buffer
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6 mt-4">
                          {/* Formula */}
                          <div className="bg-rose-50 rounded-lg p-4 border border-rose-200">
                            <div className="flex items-center gap-2 mb-3">
                              <Calculator className="w-5 h-5 text-rose-600" />
                              <h3 className="font-semibold text-rose-900">Calculation Formula</h3>
                            </div>
                            <div className="font-mono text-sm bg-white p-3 rounded border border-rose-200 space-y-2">
                              <div>Pessimistic Cost = Base Cost × Risk Multiplier</div>
                              <div>Pessimistic Cost = Base Cost × 1.30</div>
                              <div className="mt-2 text-rose-600">€{pessimisticCost.toLocaleString()} = €{baseCost.toLocaleString()} × 1.30</div>
                            </div>
                            <div className="mt-3 text-sm text-rose-800">
                              <strong>Risk Buffer:</strong> +30% contingency for high-risk factors
                            </div>
                            <div className="mt-2 text-xs text-rose-600">
                              Recommended for projects with high uncertainty or complexity
                            </div>
                          </div>

                          {/* Included Factors */}
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-rose-600" />
                              Included Factors
                            </h3>
                            <ul className="space-y-2 text-sm text-slate-700">
                              <li className="flex items-start gap-2">
                                <span className="text-rose-600 mt-0.5">✓</span>
                                <span><strong>All Realistic factors</strong> plus additional risk buffers</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-rose-600 mt-0.5">✓</span>
                                <span><strong>Scope creep</strong> (~10%): Feature additions, changing requirements</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-rose-600 mt-0.5">✓</span>
                                <span><strong>Technical debt</strong> (~5%): Refactoring, architecture changes</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-rose-600 mt-0.5">✓</span>
                                <span><strong>Team turnover</strong> (~5%): Knowledge loss, hiring delays</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-rose-600 mt-0.5">✓</span>
                                <span><strong>Integration issues</strong> (~5%): Third-party APIs, dependencies</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-rose-600 mt-0.5">✓</span>
                                <span><strong>Unexpected delays</strong> (~5%): Blockers, infrastructure issues</span>
                              </li>
                            </ul>
                          </div>

                          {/* Risk Factors */}
                          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                            <h3 className="font-semibold text-amber-900 mb-3">⚠️ Risk Factors Covered</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                                <span className="text-slate-700"><strong>New technology stack</strong> - Learning curve & unknowns</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                                <span className="text-slate-700"><strong>Unclear requirements</strong> - Evolving scope</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                                <span className="text-slate-700"><strong>Distributed team</strong> - Communication overhead</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                                <span className="text-slate-700"><strong>Complex integrations</strong> - Third-party dependencies</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                                <span className="text-slate-700"><strong>Regulatory compliance</strong> - Additional reviews & audits</span>
                              </div>
                            </div>
                          </div>

                          {/* 30% Buffer Breakdown */}
                          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <h3 className="font-semibold text-slate-900 mb-3">30% Risk Buffer Breakdown</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">Base Overhead (Realistic)</span>
                                <span className="font-mono text-rose-600">20%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">Scope Changes & Creep</span>
                                <span className="font-mono text-rose-600">+5%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">Technical & Integration Risks</span>
                                <span className="font-mono text-rose-600">+3%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">Team & Process Risks</span>
                                <span className="font-mono text-rose-600">+2%</span>
                              </div>
                              <div className="flex justify-between items-center border-t border-slate-300 pt-2 mt-2">
                                <span className="text-slate-900 font-semibold">Total Risk Buffer</span>
                                <span className="font-mono text-rose-600 font-semibold">30%</span>
                              </div>
                            </div>
                          </div>

                          {/* When to Use */}
                          <div className="bg-rose-50 rounded-lg p-4 border border-rose-200">
                            <h3 className="font-semibold text-rose-900 mb-2">🎯 When to Use This Scenario</h3>
                            <ul className="space-y-1.5 text-sm text-rose-800">
                              <li>• <strong>High-risk projects</strong> - New technology, unclear scope</li>
                              <li>• <strong>Fixed-price contracts</strong> - Protect against overruns</li>
                              <li>• <strong>Executive reporting</strong> - Worst-case planning</li>
                              <li>• <strong>Stakeholder communication</strong> - Set realistic expectations</li>
                            </ul>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  </div>
                </div>
                <div>
                  <div className="text-rose-600 font-mono text-3xl mb-1">
                    €{pessimisticCost.toLocaleString()}
                  </div>
                  <p className="text-slate-500 text-sm">Risk Loaded</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-slate-600">
                  Includes 30% contingency buffer for scope changes, technical debt, and unexpected delays.
                </p>
                <div className="pt-3 border-t border-rose-100 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Monthly Burn:</span>
                    <span className="font-mono">€{(monthlyBurnRate * 1.30).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Duration:</span>
                    <span>{projectDuration} months</span>
                  </div>
                  <div className="flex justify-between text-rose-600 font-medium">
                    <span>Risk Buffer:</span>
                    <span>+30%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Visualizations Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Cost Comparison (Simple Bar Chart) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-slate-900">Cost Comparison</CardTitle>
              <p className="text-slate-500 text-sm">Direct comparison of 3 scenarios</p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="scenario" stroke="#64748B" />
                    <YAxis
                      stroke="#64748B"
                      tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                    />
                    <RechartsTooltip
                      formatter={(value: number) => `€${value.toLocaleString()}`}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                    />
                    <Bar dataKey="cost" radius={[8, 8, 0, 0]}>
                      {costComparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {costComparisonData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="text-slate-600 text-sm">{item.scenario}</span>
                    </div>
                    <span className="font-mono text-slate-900">€{item.cost.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chart 2: Budget Breakdown (Donut Chart) - Dynamic */}
          <Card>
            <CardHeader>
              <CardTitle className="text-slate-900">Budget Breakdown</CardTitle>
              <p className="text-slate-500 text-sm">Where the money goes - {selectedScenario} scenario</p>
            </CardHeader>
            <CardContent>
              <div className="h-80 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percentage }) => `${name.split(' ')[0]} ${percentage}%`}
                    >
                      {budgetBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value: number) => `€${value.toLocaleString()}`}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Label: Total Cost - Dynamic */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <div className="text-slate-500 text-xs">Total</div>
                  <div className={`font-mono font-bold text-lg ${
                    selectedScenario === 'Optimistic' ? 'text-emerald-600' :
                    selectedScenario === 'Realistic' ? 'text-indigo-600' :
                    'text-rose-600'
                  }`}>
                    €{selectedCost.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {budgetBreakdownData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 text-sm">{item.name}</span>
                    </div>
                    <span className="text-slate-900 text-sm">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Composition Chart - Role-based Total Cost */}
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900">Team Composition</CardTitle>
            <p className="text-slate-500 text-sm">Total project cost by role ({projectDuration} months)</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={teamCompositionByRole}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      label={({ name }) => name}
                    >
                      {teamCompositionByRole.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value: number, name: string, props: any) => [
                        `€${value.toLocaleString()} (${props.payload.count} member${props.payload.count > 1 ? 's' : ''})`,
                        props.payload.name,
                      ]}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {teamCompositionByRole.map((item, index) => (
                  <div key={index} className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-900 font-medium">{item.name}</span>
                      </div>
                      <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200">
                        {item.count} member{item.count > 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-indigo-600 font-mono font-bold text-xl">
                        €{item.value.toLocaleString()}
                      </div>
                      <div className="text-slate-500 text-xs mt-0.5">
                        Total for {projectDuration} months
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Scope Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Project Scope Summary
              </CardTitle>
              <Badge className="bg-indigo-100 text-indigo-700">
                {projectData.features.length} Features • {totalStoryPoints} SP Total
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">#</th>
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">Feature Name</th>
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">Complexity</th>
                    <th className="text-right py-3 px-4 text-slate-500 font-medium">Story Points</th>
                  </tr>
                </thead>
                <tbody>
                  {projectData.features.map((feature, index) => (
                    <tr key={feature.id} className="border-b border-slate-100">
                      <td className="py-3 px-4 text-slate-400 text-sm">{index + 1}</td>
                      <td className="py-3 px-4 text-slate-900">{feature.name}</td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            feature.complexity === 'Low'
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                              : feature.complexity === 'Medium'
                              ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                              : 'bg-rose-100 text-rose-700 hover:bg-rose-100'
                          }
                        >
                          {feature.complexity}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-mono text-slate-900">{feature.storyPoints}</span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-semibold">
                    <td colSpan={3} className="py-3 px-4 text-slate-900">Total</td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono text-indigo-600 text-lg">{totalStoryPoints}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-slate-200">
          <Button variant="outline" onClick={() => onNavigate('new-project')} size="lg">
            Adjust Parameters
          </Button>
          <Button variant="outline" onClick={handleSaveAsDraft} size="lg">
            Save as Draft
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}